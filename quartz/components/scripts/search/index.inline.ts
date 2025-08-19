import { ComponentManagerFactory } from "../component-manager/BaseComponentManager"
import { SearchComponentManager } from "../component-manager/SearchComponentManager"

const searchManager = new SearchComponentManager()

ComponentManagerFactory.register("search", searchManager)
ComponentManagerFactory.initialize("search")
