import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive, UnwrapRef } from 'vue';
import { Results } from '../results';
import { useConfigStore } from '@uvicore/vue-config';


/**
 * Pinia OpenAPI.json Store
 */
export const useOpenApiStore = defineStore('openapi', {
  state: () => ({
    schemas: new Map<string, any>(),
  }),
  getters: {
    apis(state): Record<string, any> {
      const config = useConfigStore().config
      return config.app.apis
    },
  },
  actions: {
    async load(): Promise<void> {
      try {
        for await (const key of Object.keys(this.apis)) {
          const apiCall = await axios.get(this.apis[key].url + '/openapi.json')
          const response = await apiCall.data
          this.schemas.set(key, response.components.schemas)
        }
      } catch(err) {
        console.error(err)
      }
    },
    schema(connectionKey: string, modelname: string = ''): UnwrapRef<Results<any>> {
      const results = reactive<Results<any>>(new Results());

      if (!this.schemas.has(connectionKey)) {

        this.load().then(() => {
            const cxn: Record<string, any> = this.schemas.get(connectionKey)
            results.result = cxn[modelname]
            results.count = 1
            console.log("loading schemas", results)
          }).catch(e => {
            results.error = e
          }).finally(() => results.loading = false)


      } else {
        results.result = this.schemas.get(connectionKey)[modelname]
        results.loading = false

      }

      return results
    },
    props(connectionKey: string, modelname: string = ''): UnwrapRef<Results<any>> {
      const results = reactive<Results<any>>(new Results());

      if (!this.schemas.has(connectionKey)) {
        this.load().then(() => {
            const modelProps = Object.entries(this.schemas.get(connectionKey)[modelname].properties)
            modelProps.forEach(([key, prop]) => results.results.push({ key, value: (prop as any).title }))

          }).catch(e => {
            results.error = e

          }).finally(() =>
            results.loading = false
        )

      } else {
        const modelProps = Object.entries(this.schemas.get(connectionKey)[modelname].properties)
        modelProps.forEach(([key, prop]) => results.results.push({ key, value: (prop as any).title }))
        results.loading = false

      }

      return results
    }
  }
})

