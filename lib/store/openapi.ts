import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive, UnwrapRef } from 'vue';
import { Results } from '../results';
import { useConfigStore } from '@uvicore/vue-config';


/**
 * Pinia OpenAPI.json Store
 */
export const useOpenApiStore = defineStore({
  // unique id of the store across your application
  id: 'openapi',

  state: () => ({
    //config: {} as Record<string, any>,
    spec: {} as any,
  }),

  getters: {},
  actions: {
    schema(connectionKey: string, modelname: string = ''): UnwrapRef<Results<Record<string, any>>> {
      // Instead of passing 2 params, you can also pass connection.model dotnotation string format
      if (connectionKey.includes('.')) {
        // Model is in the connection.model dotnotation format
        var [connectionKey, modelname] = connectionKey.split('.');
      }

      console.log(`----: Getting schema for ${connectionKey}`);


      const results = reactive<Results<Record<string, any>>>(new Results());

      if (this.spec[connectionKey]) {

        console.log(`----: Schema already downloaded`);
        results.loading = false;
        results.count = 1;
        results.result = this.spec[connectionKey].schema[modelname]
      } else {
        console.log(`----: Schema NOT loaded, downloading now`);
        // Look up url from config based on connectionKey
        const url = useConfigStore().config.app.apis[connectionKey].url + '/openapi.json';

        // Query openapi.json and save to store
        axios.get(url)
          .then((res) => {
            this.spec[connectionKey] = {};
            this.spec[connectionKey].schema = res.data.components.schemas;
            results.loading = false;
            results.count = 1;
            results.result = this.spec[connectionKey].schema[modelname]
          })
          .catch(err => {
            results.error = err;
            console.error(err);
          })
      }
      return results;
    }

  }
})

