import { defineStore } from 'pinia'
import { useConfigStore } from '@uvicore/vue-config'

export const useApiStore = defineStore('openApi', {
  state: () => ({
    connections: [] as string[],
  }),
  getters: {
    apis(state): Record<string, any> {
      const { config } = useConfigStore()
      return config.app.apis
    }
  }
})

