import { ComponentManagerFactory } from "../component-manager/BaseComponentManager"
import { GraphComponentManager } from "../component-manager/GraphComponentManager"

const graphManager = new GraphComponentManager({
  name: "graph",
  debug: true,
})
ComponentManagerFactory.register("graph", graphManager)
ComponentManagerFactory.initialize("graph").catch((error) => {
  console.error("Graph component initialization failed:", error)
})

// TODO: Move graph rendering logic from graph.bak.txt to here and other modular files.
