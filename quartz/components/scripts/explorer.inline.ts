import { ComponentManagerFactory } from "./component-manager/BaseComponentManager"
import { ExplorerComponentManager } from "./component-manager/ExplorerComponentManager"

// Register and initialize ExplorerComponentManager
const explorerManager = new ExplorerComponentManager({
  name: "explorer",
  enablePerformanceMonitoring: true,
})
ComponentManagerFactory.register("explorer", explorerManager)
ComponentManagerFactory.initialize("explorer")
