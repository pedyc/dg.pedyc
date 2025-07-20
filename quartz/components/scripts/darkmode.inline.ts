import { DarkmodeComponentManager } from "./component-manager/DarkmodeComponentManager"
import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"

// 注册并初始化主题管理器
const darkmodeManager = new DarkmodeComponentManager({
  name: "darkmode",
  followSystemTheme: true,
})
ComponentManagerFactory.register("darkmode", darkmodeManager)

// 初始化组件
ComponentManagerFactory.initialize("darkmode")
