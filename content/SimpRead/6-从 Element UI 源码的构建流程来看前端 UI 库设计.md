---
title: 6-从 Element UI 源码的构建流程来看前端 UI 库设计
uid: 
aliases: []
author: 
description: 
tags: []
date-created: 2025-02-16
date-modified: 2025-02-16
status: 
banner: "https://images.unsplash.com/photo-1738028449238-fa5ae8c33bce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Njc1ODd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3Mzk2NzIwNzd8&ixlib=rb-4.0.3&q=85&fit=crop&w=880&max-h=540"
url: https://juejin.cn/post/6844904197863964685#heading-8
---

## 引言

由于业务需要，近期团队要搞一套自己的 `UI` 组件库，框架方面还是 `Vue`。而业界已经有比较成熟的一些 `UI` 库了，比如 `ElementUI`、`AntDesign`、`Vant` 等。

结合框架 `Vue`，我们选择在 `ElementUI` 基础上进行改造。但 `造轮子` 绝非易事，首先需要先去了解它整个但构建流程、目录设计等。

本文通过分析 `ElementUI` 完整的构建流程，最后给出搭建一个完备的组件库需要做的一些工作，希望对于想了解 `ElementUI` 源码或者也有搭建 `UI` 组件库需求的你，可以提供一些帮助！

我们先来看下 `ElementUI` 的源码的目录结构。

## 目录结构解析

* github：存放了 `Element UI` 贡献指南、`issue` 和 `PR` 模板
* build：存放了打包相关的配置文件
* examples：组件相关示例 demo
* packages：组件源码
* src：存放入口文件和一些工具辅助函数
* test：单元测试相关文件，这也是一个优秀的开源项目必备的
* types：类型声明文件

说完文件目录，剩下还有几个文件（常见的 `.babelrc`、`.eslintc` 这里就不展开说明了），在业务代码中是不常见的：

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/98dd75a7f3ef32868d4feef0255d4dde_MD5.webp]]

* .travis.yml：持续集成 (CI) 的配置文件
* CHANGELOG：更新日志，这里 `Element UI` 提供了四种不同语言的，也是很贴心了
* components.json：标明了组件的文件路径，方便 `webpack` 打包时获取组件的文件路径。
* FAQ.md：`ElementUI` 开发者对常见问题的解答。
* LICENSE：开源许可证，`Element UI` 使用的是 `MIT` 协议
* Makefile：`Makefile` 是一个适用于 `C/C++` 的工具，在拥有 `make` 环境的目录下， 如果存在一个 `Makefile` 文件。 那么输入 `make` 命令将会执行 `Makefile` 文件中的某个目标命令。

深入了解构建流程前，我们先来看下 `ElementUI` 源码的几个比较主要的文件目录，这对于后面研究 `ElementUI` 的完整流程是有帮助的。

## package.json

通常我们去看一个大型项目都是从 `package.json` 文件开始看起的，这里面包含了项目的版本、入口、脚本、依赖等关键信息。

我这里拿出了几个关键字段，一一的去分析、解释他的含义。

### main

项目的入口文件

❝

`import Element from 'element-ui'` 时候引入的就是 `main` 中的文件

❞

`lib/element-ui.common.js` 是 `commonjs` 规范，而 `lib/index.js` 是 `umd` 规范，这个我在后面的打包模块会详细说明。

### files

指定 `npm publish` 发包时需要包含的文件 / 目录。

### typings

`TypeScript` 入口文件。

### home

项目的线上地址

### unpkg

当你把一个包发布到 `npm` 上时，它同时应该也可以在 `unpkg` 上获取到。也就是说，你的代码既可能在 `NodeJs` 环境也可能在 `浏览器环境` 执行。为此你需要用 `umd` 格式打包，`lib/index.js` 是 `umd` 规范，由 `webpack.conf.js` 生成。

### style

声明样式入口文件，这里是 `lib/theme-chalk/index.css`，后面也会详细说明。

### scripts

开发、测试、生产构建，打包、部署，测试用例等相关脚本。`scripts` 算是 `package.json` 中最重要的部分了，下面我会一一对其中的重要指令进行说明。

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/3872fb6d4d0c84eb137b7c3308bb8607_MD5.webp]]

#### bootstrap

```Javascript
"bootstrap": "yarn || npm i"
```

安装依赖， 官方推荐优先选用 `yarn`(吐槽一句：我刚开始没看明白，想着 `bootstrap` 不是之前用过的那个 ui 库吗 🤔，后来看了下，原来 `bootstrap` 翻译过来是 `引导程序` 的意思，这样看看也就大概理解了 🤣)

#### build:file

该指令主要用来自动化生成一些文件。

```Javascript
"build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js"
```

这条指令较长，我们拆开来看：

##### `build/bin/iconInit.js`

解析 `icon.scss`，把所有的 `icon` 的名字放在 `icon.json` 里面 最后挂在 `Vue` 原型上的 `$icon` 上。

最后通过遍历 `icon.json`，得到了官网的这种效果：

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/ae6cee26594c934b6aabc2576c5aa282_MD5.webp]]

##### `build/bin/build-entry.js`

根据 `components.json` 文件，生成 `src/index.js` 文件，核心就是 `json-templater/string` 插件的使用。

我们先来看下 `src/index.js` 文件，他对应的是项目的入口文件，最上面有这样一句：

```Javascript
/* Automatically generated by './build/bin/build-entry.js' */
```

也就是 `src/index.js` 文件是由 `build/bin/build-entry.js` 脚本自动构建的。我们来看下源码：

```Javascript
// 根据components.json生成src/index.js文件

// 引入所有组件的依赖关系
var Components = require('../../components.json');
var fs = require('fs');
// https://www.npmjs.com/package/json-templater 可以让string与变量结合 输出一些内容
var render = require('json-templater/string');
// https://github.com/SamVerschueren/uppercamelcase  转化为驼峰 foo-bar >> FooBar
var uppercamelcase = require('uppercamelcase');
var path = require('path');
// os.EOL属性是一个常量，返回当前操作系统的换行符（Windows系统是\r\n，其他系统是\n）
var endOfLine = require('os').EOL;

// 生成文件的名字和路径
var OUTPUT_PATH = path.join(__dirname, '../../src/index.js');
var IMPORT_TEMPLATE = 'import {{name}} from \'../packages/{{package}}/index.js\';';
var INSTALL_COMPONENT_TEMPLATE = '  {{name}}';
// var MAIN_TEMPLATE = `/* Automatically generated by './build/bin/build-entry.js' */

// ...

// 获取所有组件的名字，存放在数组中
var ComponentNames = Object.keys(Components);

var includeComponentTemplate = [];
var installTemplate = [];
var listTemplate = [];

ComponentNames.forEach(name => {
  var componentName = uppercamelcase(name);

  includeComponentTemplate.push(render(IMPORT_TEMPLATE, {
    name: componentName,
    package: name
  }));

  if (['Loading', 'MessageBox', 'Notification', 'Message', 'InfiniteScroll'].indexOf(componentName) === -1) {
    installTemplate.push(render(INSTALL_COMPONENT_TEMPLATE, {
      name: componentName,
      component: name
    }));
  }

  if (componentName !== 'Loading') listTemplate.push(`  ${componentName}`);
});

var template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine),
  install: installTemplate.join(',' + endOfLine),
  version: process.env.VERSION || require('../../package.json').version,
  list: listTemplate.join(',' + endOfLine)
});

// 结果输出到src/index.js中
fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build entry] DONE:', OUTPUT_PATH);
```

其实就是上面说的，根据 `components.json`，生成 `src/index.js` 文件。

##### `build/bin/i18n.js`

根据 `examples/i18n/page.json` 和模版，生成不同语言的 `demo`，也就是官网 demo 展示国际化的处理。

`ElementUI` 官网的国际化依据的模版是 `examples/pages/template`，根据不同的语言，分别生成不同的文件：

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/2f069907997e831eeaf59f989ac78575_MD5.webp]]

这里面都是 `.tpl` 文件，每个文件对应一个模版，而且每个 `tpl` 文件又都是符合 `SFC` 规范的 `Vue` 文件。

我们随便打开一个文件：

```Javascript
export default {
    data() {
      return {
        lang: this.$route.meta.lang,
        navsData: [
          {
            path: '/design',
            name: '<%= 1 >'
          },
          {
            path: '/nav',
            name: '<%= 2 >'
          }
        ]
      };
    }
};
```

里面都有数字标示了需要国际化处理的地方。

首页所有国际化相关的字段对应关系存储在 `examples/i18n/page.json` 中：

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/d4a72d24f182a486908ce5d65b386d3b_MD5.webp]]

最终官网展示出来的就是经过上面国际化处理后的页面：

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/425f8413bede515e155707881c692b5a_MD5.webp]]

支持切换不同语言。

绕了一圈，回到主题：`build/bin/i18n.js` 帮我们做了什么呢？

我们思考一个问题：首页的展示是如何做到根据不同语言，生成不同的 `vue` 文件呢？

这就是 `build/bin/i18n.js` 帮我们做的事情。

来看下对应的源码：

```Javascript
'use strict';

var fs = require('fs');
var path = require('path');
var langConfig = require('../../examples/i18n/page.json');

langConfig.forEach(lang => {
  try {
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  } catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  }

  Object.keys(lang.pages).forEach(page => {
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`);
    var outputPath = path.resolve(__dirname, `../../examples/pages/${ lang.lang }/${ page }.vue`);
    var content = fs.readFileSync(templatePath, 'utf8');
    var pairs = lang.pages[page];

    Object.keys(pairs).forEach(key => {
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]);
    });

    fs.writeFileSync(outputPath, content);
  });
});
```

处理流程也很简单：遍历 `examples/i18n/page.json`，根据不同的数据结构把 `tpl` 文件的标志位，通过正则匹配出来，并替换成自己预先设定好的字段。

这样官网首页的国际化就完成了。

##### `build/bin/version.js`

根据 `package.json` 中的 `version`, 生成 `examples/versions.json`，对应就是完整的版本列表

#### build:theme

处理样式相关。

```Javascript
代码解读复制代码"build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
```

同样这一条也关联了多个操作，我们拆开来看。

##### build/bin/gen-cssfile

这一步是根据 `components.json`，生成 `package/theme-chalk/index.scss` 文件，把所有组件的样式都导入到 `index.scss`。

其实是做了一个自动化导入操作，后面每次新增组件，就不用手动去引入新增组件的样式了。

##### gulp build --gulpfile packages/theme-chalk/gulpfile.js

我们都知道 `ElementUI` 在使用时有两种引入方式：

* 全局引入

```Javascript
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

* 按需引入

```Javascript
import Vue from 'vue';
import { Pagination, Dropdown } from 'element-ui';

import App from './App.vue';

Vue.use(Pagination)
Vue.use(Dropdown)

new Vue({
  el: '#app',
  render: h => h(App)
});
```

对应两种引入方式，`Element` 在打包时对应的也有两种方案。

具体如下：将 `packages/theme-chalk` 下的所有 `scss` 文件编译为 `css`，当你需要全局引入时，就去引入 `index.scss` 文件；当你按需引入时，引入对应的组件 `scss` 文件即可。

这其中有一点，我们需要思考下：如何把 `packages/theme-chalk` 下的所有 `scss` 文件编译为 `css`？

在平时的开发中，我们打包、压缩之类的工作往往都会交给 `webpack` 去处理，但是，针对上面这个问题，我们如果采用 `gulp` 基于工作流去处理会更加方便。

`gulp` 相关的处理就在 `packages/theme-chalk/gulpfile.js` 中：

```Javascript
'use strict';

const { series, src, dest } = require('gulp');
const sass = require('gulp-sass');  // 编译gulp工具
const autoprefixer = require('gulp-autoprefixer');  // 添加厂商前缀
const cssmin = require('gulp-cssmin');  // 压缩css

function compile() {
  return src('./src/*.scss')  // src下的所有scss文件
    .pipe(sass.sync())  // 把scss文件编译成css
    .pipe(autoprefixer({  // 基于目标浏览器版本，添加厂商前缀
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())  // 压缩css
    .pipe(dest('./lib')); // 输出到lib下
}

function copyfont() {
  return src('./src/fonts/**')  // 读取src/fonts下的所有文件
    .pipe(cssmin())
    .pipe(dest('./lib/fonts')); // 输出到lib/fonts下
}

exports.build = series(compile, copyfont);
```

经过处理，最终就会打包出对应的样式文件

##### cp-cli packages/theme-chalk/lib lib/theme-chalk

❝

`cp-cli` 是一个跨平台的 `copy` 工具，和 `CopyWebpackPlugin` 类似

❞

这里就是复制文件到 `lib/theme-chalk` 下。

上面提到过多次 `components.json`，下面就来了解下。

## components.json

这个文件其实就是记录了组件的路径，在自动化生成文件以及入口时会用到：

```Javascript
{
  "pagination": "./packages/pagination/index.js",
  "dialog": "./packages/dialog/index.js",
  "autocomplete": "./packages/autocomplete/index.js",
  // ...
  "avatar": "./packages/avatar/index.js",
  "drawer": "./packages/drawer/index.js",
  "popconfirm": "./packages/popconfirm/index.js"
}
```

## packages

存放着组件库的源码和组件样式文件。

这里以 `Alert` 组件为例做下说明：

### Alert 文件夹

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/926ffc922ab78c1720576680afdddde5_MD5.webp]]

这里 `main.vue` 对应就是组件源码，而 `index.js` 就是入口文件：

```Javascript
import Alert from './src/main';

/* istanbul ignore next */
Alert.install = function(Vue) {
  Vue.component(Alert.name, Alert);
};

export default Alert;
```

引入组件，然后为组件提供 `install` 方法，让 `Vue` 可以通过 `Vue.use(Alert)` 去使用。

❝

关于 `install` 可以看 [官方文档](https://link.juejin.cn?target=https%3A%2F%2Fcn.vuejs.org%2Fv2%2Fguide%2Fplugins.html%23%25E5%25BC%2580%25E5%258F%2591%25E6%258F%2592%25E4%25BB%25B6 "https://cn.vuejs.org/v2/guide/plugins.html#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6")

❞

### packages/theme-chalk

这里面存放的就是所有组件相关的样式，上面也已经做过说明了，里面有 `index.scss`（用于全局引入时导出所有组件样式）和其他每个组件对应的 `scss` 文件（用于按需引入时导出对应的组件样式）

## src

说了半天，终于绕到了 `src` 文件夹。

上面的 `packages` 文件夹是分开去处理每个组件，而 `src` 的作用就是把所有的组件做一个统一处理，同时包含自定义指令、项目整体入口、组件国际化、组件 mixins、动画的封装和公共方法。

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/5f3e15d79bd1a3135a336eb9c7a00a6c_MD5.webp]]

我们主要来看下入口文件，也就是 `src/index.js`：

```Javascript
/* Automatically generated by './build/bin/build-entry.js' */
// 导入了packages下的所有组件
import Pagination from '../packages/pagination/index.js';
import Dialog from '../packages/dialog/index.js';
import Autocomplete from '../packages/autocomplete/index.js';
// ...

const components = [
  Pagination,
  Dialog,
  Autocomplete,
  // ...
];

// 提供了install方法，帮我们挂载了一些组件与变量
const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);
  // 把所有的组件注册到Vue上面
  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(InfiniteScroll);
  Vue.use(Loading.directive);

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
// 导出版本号、install方法（插件）、以及一些功能比如国际化功能
export default {
  version: '2.13.2',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  Pagination,
  Dialog,
  Autocomplete,
  // ...
};
```

文件开头的：

```Javascript
/* Automatically generated by './build/bin/build-entry.js' */
```

其实在上面的 `scripts` 的 `build/bin/build-entry.js` 中我们已经提到过：`src/index.js` 是由 `build-entry` 脚本自动生成的。

这个文件主要做下以下事情：

* 导入了 `packages` 下的所有组件
* 对外暴露了 `install` 方法，把所有的组件注册到 `Vue` 上面，并在 `Vue` 原型上挂载了一些全局变量和方法
* 最终将 `install` 方法、变量、方法导出

## examples

存放了 `ElementUI` 的组件示例。

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/4de2c735c055dfc7a16a489dd52721f6_MD5.webp]]

其实从目录结构，我们不难看出这是一个完整独立的 `Vue` 项目。主要用于官方文档的展示：

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/fb34638758af34108695dc26de38fbac_MD5.webp]]

这里我们主要关注下 `docs` 文件夹：

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/7c84d98dafd411c4e1e879735e07883d_MD5.webp]]

`Element` 官网支持 4 种语言，`docs` 一共有 4 个文件夹，每个文件夹里面的内容基本是一样的。

我们可以看到里面全部都是 `md` 文档，而每一个 `md` 文档，分别对应着官网组件的展示页面。

❝

其实现在各大主流组件库文档都是用采用 `md` 编写。

❞

我们上面大致了解了源码的几个主要文件目录，但是都比较分散。下面我们从构建指令到新建组件、打包流程、发布组件完整的看一下构建流程。

## 构建流程梳理

### 构建指令（Makefile）

平时我们都习惯将项目常用的脚本放在 `package.json` 中的 `scripts` 中。但 `ElementUI` 还使用了 `Makefile` 文件（由于文件内容较多，这里就选取了几个做下说明）：

```Javascript
代码解读复制代码.PHONY: dist test
default: help
build-theme:
npm run build:theme
install:
npm install
install-cn:
npm install --registry=http://registry.npm.taobao.org
dev:
npm run dev
play:
npm run dev:play
new:
node build/bin/new.js @,$(MAKECMDGOALS))
dist: install
npm run dist
deploy:
@npm run deploy
pub:
npm run pub
test:
npm run test:watch
// Tip:
// make new <component-name> [中文]
// 1、将新建组件添加到components.json
// 2、添加到index.scss
// 3、添加到element-ui.d.ts
// 4、创建package
// 5、添加到nav.config.json
```

我是第一次见，所以就去 `Google` 下，网上对 `Makefile` 对定义大概是这样：

❝

`Makefile` 是一个适用于 `C/C++` 的工具，较早作为工程化工具出现在 `UNIX` 系统中， 通过 `make` 命令来执行一系列的编译和连接操作。在拥有 `make` 环境的目录下， 如果存在一个 `Makefile` 文件。 那么输入 `make` 命令将会执行 `Makefile` 文件中的某个目标命令。

❞

这里我以 `make install` 为例简要说明下执行流程：

* 执行 `make` 命令， 在该目录下找到 `Makefile` 文件。
* 找到 `Makefile` 文件中对应命令行参数的 `install` 目标。这里的目标就是 `npm install`

### 构建入口文件

我们看下 `scripts` 中的 `dev` 指令：

```Javascript
代码解读复制代码"dev":
"npm run bootstrap &&
npm run build:file &&
cross-env NODE_ENV=development
webpack-dev-server --config build/webpack.demo.js &
node build/bin/template.js",
```

首先 `npm run bootstrap` 是用来安装依赖的。

`npm run build:file` 在前面也有提到，主要用来自动化生成一些文件。主要是 `node build/bin/build-entry.js`，用于生成 `Element` 的入口 `js`：先是读取根目录的 `components.json`，这个 `json` 文件维护着 `Element` 所有的组件路径映射关系，键为组件名，值为组件源码的入口文件；然后遍历键值，将所有组件进行 `import`，对外暴露 `install` 方法，把所有 `import` 的组件通过 `Vue.component(name, component)` 方式注册为全局组件，并且把一些弹窗类的组件挂载到 `Vue` 的原型链上（这个在上面介绍 `scripts` 相关脚本时有详细说明）。

在生成了入口文件的 `src/index.js` 之后就会运行 `webpack-dev-server`。

```Javascript
webpack-dev-server --config build/webpack.demo.js
```

这个前面也提过，用于跑 `Element` 官网的基础配置。

### 新建组件

上面我们提到了，`Element` 中还用了 `makefile` 为我们编写了一些额外的脚本。

这里重点说一下 `make new <component-name> [中文]` 这个命令。

当运行这个命令的时候，其实运行的是 `node build/bin/new.js`。

`build/bin/new.js` 比较简单，备注也很清晰，它帮我们做了下面几件事：

1、新建的组件添加到 `components.json`

2、在 `packages/theme-chalk/src` 下新建对应到组件 `scss` 文件，并添加到 `packages/theme-chalk/src/index.scss` 中

3、添加到 `element-ui.d.ts`，也就是对应的类型声明文件

4、创建 `package`（我们上面有提到组件相关的源码都在 `package` 目录下存放）

5、添加到 `nav.config.json`（也就是官网 `组件` 左侧的菜单）

### 打包流程分析

`ElementUI` 打包执行的脚本是：

```Javascript
"dist":
  "npm run clean &&
   npm run build:file &&
   npm run lint &&
   webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js &&
   npm run build:utils &&
   npm run build:umd &&
   npm run build:theme",
```

下面我们一一来进行分析：

#### npm run clean（清理文件）

```Javascript
"clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage",
```

删除之前打包生成文件。

#### npm run build:file（生成入口文件）

根据 `components.json` 生成入口文件 `src/index.js`，以及 `i18n` 相关文件。这个在上面已经做过分析，这里就不再展开进行说明。

#### npm run lint（代码检查）

```Javascript
"lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet",
```

项目 `eslint` 检测，这也是现在项目必备的。

#### 文件打包相关

```Javascript
webpack --config build/webpack.conf.js &&
webpack --config build/webpack.common.js &&
webpack --config build/webpack.component.js
```

##### build/webpack.conf.js

生成 `umd` 格式的 `js` 文件（index.js）

##### build/webpack.common.js

生成 `commonjs` 格式的 `js` 文件（element-ui.common.js），`require` 时默认加载的是这个文件。

##### build/webpack.component.js

以 `components.json` 为入口，将每一个组件打包生成一个文件，用于按需加载。

#### npm run build:utils（转译工具方法）

```Javascript
"build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js",
```

把 `src` 目录下的除了 `index.js` 入口文件外的其他文件通过 `babel` 转译，然后移动到 `lib` 文件夹下。

#### npm run build:umd（语言包）

```Javascript
"build:umd": "node build/bin/build-locale.js",
```

生成 `umd` 模块的语言包。

#### npm run build:theme（生成样式文件）

```Javascript
"build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
```

根据 `components.json`，生成 `package/theme-chalk/index.scss`。用 `gulp` 构建工具，编译 `scss`、压缩、输出 `css` 到 `lib` 目录。

最后用一张图来描述上述整个打包流程：

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/89cc3a430433d0a616f4315fe195feb1_MD5.webp]]

### 发布流程

打包完成，紧跟着就是代码的发布了。`Element` 中发布主要是用 `shell` 脚本实现的。

`Element` 发布一共涉及三个部分：

1、git 发布

2、npm 发布

3、官网发布

发布对应的脚本是：

```Javascript
"pub":
  "npm run bootstrap &&
   sh build/git-release.sh &&
   sh build/release.sh &&
   node build/bin/gen-indices.js &&
   sh build/deploy-faas.sh",
```

#### sh build/git-release.sh（代码冲突检测）

运行 `git-release.sh` 进行 `git` 冲突的检测，这里主要是检测 `dev` 分支是否冲突，因为 `Element` 是在 `dev` 分支进行开发的。

```Javascript
#!/usr/bin/env sh
# 切换至dev分支
git checkout dev
# 检测本地和暂存区是否还有未提交的文件
if test -n "$(git status --porcelain)"; then
  echo 'Unclean working tree. Commit or stash changes first.' >&2;
  exit 128;
fi
# 检测本地分支是否有误
if ! git fetch --quiet 2>/dev/null; then
  echo 'There was a problem fetching your branch. Run `git fetch` to see more...' >&2;
  exit 128;
fi
# 检测本地分支是否落后远程分支
if test "0" != "$(git rev-list --count --left-only @'{u}'...HEAD)"; then
  echo 'Remote history differ. Please pull changes.' >&2;
  exit 128;
fi
# 通过以上检查，表示代码无冲突
echo 'No conflicts.' >&2;
```

#### 发布 npm && 官网更新

`dev` 分支代码检测没有冲突，接下来就会执行 `release.sh` 脚本，合并 `dev` 分支到 `master`、更新版本号、推送代码到远程仓库并发布到 `npm`（npm publish）。

官网更新大致就是：将静态资源生成到 `examples/element-ui` 目录下，然后放到 `gh-pages` 分支，这样就能通过 `github pages` 的方式访问。

到这里 `ElementUI` 的完整构建流程就分析完了。

## ui 组件库搭建指北

通过对 `ElementUI` 源码文件和构建流程的分析，下面我们可以总结一下搭建一个完备的 ui 组件库都需要做什么工作。

### 目录结构

目录结构对于大型项目是尤其重要的，合理清晰的结构对于后期的开发和扩展都是很有意义的。`ui` 组件库的目录结构，我感觉 `ElementUI` 的就很不错：

```Javascript
|-- Element
    |-- .babelrc                           // babel相关配置
    |-- .eslintignore
    |-- .eslintrc                          // eslint相关配置
    |-- .gitattributes
    |-- .gitignore
    |-- .travis.yml                        // ci配置
    |-- CHANGELOG.en-US.md
    |-- CHANGELOG.es.md
    |-- CHANGELOG.fr-FR.md
    |-- CHANGELOG.zh-CN.md                 // 版本改动说明
    |-- FAQ.md                             // 常见问题QA
    |-- LICENSE                            // 版权协议相关
    |-- Makefile                           // 脚本集合（工程化编译）
    |-- README.md                          // 项目说明文档
    |-- components.json                    // 组件配置文件
    |-- element_logo.svg
    |-- package.json
    |-- yarn.lock
    |-- .github                            // 贡献者、issue、PR模版
    |   |-- CONTRIBUTING.en-US.md
    |   |-- CONTRIBUTING.es.md
    |   |-- CONTRIBUTING.fr-FR.md
    |   |-- CONTRIBUTING.zh-CN.md
    |   |-- ISSUE_TEMPLATE.md
    |   |-- PULL_REQUEST_TEMPLATE.md
    |   |-- stale.yml
    |-- build                              // 打包
    |-- examples                           // 示例代码
    |-- packages                           // 组件源码
    |-- src                                // 入口文件以及各种辅助文件
    |-- test                               // 单元测试文件
    |-- types                              // 类型声明
```

### 组件开发

参考大多数 `UI` 组件库的做法，可以将 `examples` 下的示例代码组织起来并暴露一个入口，使用 `webpack` 配置一个 `dev-server`，后续对组件的调试、运行都在此 `dev-server` 下进行。

### 单元测试

`UI` 组件作为高度抽象的基础公共组件，编写单元测试是很有必要的。合格的单元测试也是一个成熟的开源项目必备的。

### 打包

对于打包后的文件，统一放在 `lib` 目录下，同时记得要在 `.gitignore` 中加上 `lib` 目录，避免将打包结果提交到代码库中。

同时针对引入方式的不同，要提供 `全局引入`（UMD）和 `按需加载` 两种形式的包。

### 文档

组件库的文档一般都是对外可访问的，因此需要部署到服务器上，同时也需具备本地预览的功能。

### 发布

组件库的某个版本完成开发工作后，需要将包发布到 npm 上。发布流程：

* 执行测试用例
* 打包构建
* 更新版本号
* npm 包发布
* 打 tag
* 自动化部署

### 维护

发布后需要日常维护之前老版本，一般需要注意一下几点：

* issue(bug 修复)
* pull request（代码 pr）
* CHANGELOG.md(版本改动记录)
* CONTRIBUTING.md（项目贡献者及规范）

## 参考

* https://segmentfault.com/a/1190000016419049
* https://zhuanlan.zhihu.com/p/94920464

![[SimpRead/_resources/6-从 Element UI 源码的构建流程来看前端 UI 库设计/4441c613b0bb19947da07f7886680c7a_MD5.webp]]

本文使用 [mdnice](https://link.juejin.cn?target=https%3A%2F%2Fmdnice.com "https://mdnice.com") 排版
