---
title: gallery-demo
date-created: 2025-05-03
date-modified: 2025-05-05
---

## 相册插件使用示例

### 基本用法

### 示例相册

下面是一个相册示例，这些图片会被自动组织成一个相册：

![示例图片1](https://picsum.photos/800/600?random=1)

![示例图片2](https://picsum.photos/800/600?random=2)

![示例图片3](https://picsum.photos/800/600?random=3)

![示例图片4](https://picsum.photos/800/600?random=4)

![示例图片5](https://picsum.photos/800/600?random=5)

![示例图片6](https://picsum.photos/800/600?random=6)

### 功能特点

- **自动布局**：图片自动排列成网格布局
- **响应式设计**：在不同屏幕尺寸下自动调整布局
- **懒加载**：图片只在滚动到可视区域时才加载，提高页面性能
- **灯箱效果**：点击图片可以全屏查看，支持左右切换和键盘导航
- **悬停效果**：鼠标悬停在图片上时显示图片说明

### 使用说明

1. 确保在 Quartz 配置中启用了 Gallery 插件
2. 在 Markdown 文档中连续放置图片
3. 图片之间不要插入其他内容（如文字段落），否则会被分成多个相册
4. 每张图片可以添加 alt 文本作为图片说明

### 另一个相册示例

这是另一组图片，会形成第二个相册：

![风景照1](https://picsum.photos/800/600?random=7)

![风景照2](https://picsum.photos/800/600?random=8)

![风景照3](https://picsum.photos/800/600?random=9)

### 配置选项

相册插件支持以下配置选项：

```typescript
{
  lazyLoad: true,         // 是否启用懒加载
  imagesPerRow: 3,         // 每行显示的图片数量
  enableLightbox: true,    // 是否启用点击放大功能
  containerClass: "quartz-gallery" // 相册容器的CSS类名
}
```

可以在 Quartz 配置文件中自定义这些选项。
