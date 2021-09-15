import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive, UnwrapRef } from 'vue';
import { Results } from '../results';


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

  getters: {
  },

  actions: {
    schema(connectionKey: string, model: string = ''): UnwrapRef<Results<Record<string, any>>> {
      // Instead of passing 2 params, you can also pass connection.model dotnotation format
      if (connectionKey.includes('.')) {
        // Model is in the connection.model dotnotation format
        var [connectionKey, modelname] = model.split('.');
      }

      console.log(`----: Getting schema for ${connectionKey}`);

      //let results = reactive<any>({});
      let results = reactive<Results<Record<string, any>>>(new Results());

      if (this.spec[connectionKey]) {
        console.log(`----: Schema already downloaded`);
        //console.log(this.spec[connectionKey].schema[modelname]);

        //results = reactive() this.spec[connectionKey].schema[modelname];
        results.loading = false;
        results.count = 1;
        results.result = this.spec[connectionKey].schema[modelname]
        //return this.spec[connectionKey].schema[modelname];
        //return this.spec;
      } else {
        console.log(`----: Schema NOT loaded, downloading now`);
        axios.get('https://dev.tgb.services/api/openapi.json').then((res) => {
          this.spec[connectionKey] = {};
          this.spec[connectionKey].schema = res.data.components.schemas;
          //console.log(this.spec[connectionKey].schema[modelname]);

          results.loading = false;
          results.count = 1;
          results.result = this.spec[connectionKey].schema[modelname]

          //results = this.spec[connectionKey].schema[modelname];
          //return this.spec[connectionKey].schema[modelname];
          //return this.spec;
        });
        //return this.spec[connectionKey].schema[modelname];
        //return this.spec;
      }
      //return {schema: 'here'};

      return results;
    }


    // getConnection(connectionKey: string) {
    //   return this.spec[connectionKey]
    // },
    // async load(connectionKey: string, url: string): Promise<void> {
    //   try {

    //     this.spec[connectionKey] = {};
    //     const schemas = await axios.get(url).then(
    //       ({data}) => data.components
    //     )
    //     this.spec[connectionKey] = schemas;

    //   } catch(err) {
    //     console.error(err)
    //   } finally {
    //     this.schemaLoaded = true
    //   }
    // }
  }
})

        // console.log(`Loading OpenAPI Schema ${connectionKey} from ${url}`);

        // return axios.get(url)
        //   .then((res) => {
        //     //console.log(res.data);
        //     this.spec[connectionKey] = {};
        //     this.spec[connectionKey].schema = res.data.components.schemas;
        //     console.log('ASYNC LOAD', this.spec[connectionKey])
        //     //console.log(res.data.components.schemas);
        //   })

        // {
        //   'foundation': {
        //     schema: {

        //     }
        //   },
        //   'iam': {
        //     schema: {

        //     }
        //   }
        // }
    //}



