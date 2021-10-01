import { defineStore } from 'pinia'
import { useConfigStore } from '@uvicore/vue-config'
import { reactive } from 'vue'
import axios from 'axios'

export const useApiStore = defineStore('openApi', {
  state: () => ({
    connections: {} as Record<string, { name: string, url: string, uvicore: boolean }>,
    schemas: new Map<string, any>()
  }),
  getters: {
    apis(state): Record<string, { name: string, url: string, uvicore: boolean }> {
      const { config } = useConfigStore()
      Object.assign(state.connections, config.app.apis)
      return state.connections
    }
  },
  actions: {
    async load(): Promise<void> {
      const schemasToLoad = Object.keys(this.apis).filter(schema => !this.schemas.has(schema))

      for await (const conn of schemasToLoad) {
        const schemaReq = await axios.get(this.connections[conn].url + '/openapi.json')
        const schema = await schemaReq.data.components.schemas
        this.schemas.set(conn, schema)
      }
    },
    schema(cxn: string, modelName: string = '') {
      const schema = reactive(Object.create({}))

      !this.schemas.has(cxn)
        ? this.load().then(() => Object.assign(schema, this.schemas.get(cxn)[modelName]))
        : Object.assign(schema, this.schemas.get(cxn)[modelName])

      return schema
    },
    properties(cxn: string, modelName: string) {
      const properties = reactive([] as any[])

      if (!this.schemas.has(cxn)) {
        this.load().then(() => {
          const schema = this.schemas.get(cxn)[modelName].properties
          Object.entries(schema as object).forEach(([name, props]) => properties.push({ name, ...props }))
        })
      } else {
        const schema: object = this.schemas.get(cxn)[modelName].properties
        Object.entries(schema).forEach(([name, props]) => properties.push({ name, ...props }))
      }

      return properties
    }
  }
})

