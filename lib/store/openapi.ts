import axios from 'axios';
import { defineStore } from 'pinia';


/**
 * Pinia OpenAPI.json Store
 */
export const useOpenApiStore = defineStore({
  // unique id of the store across your application
  id: 'openapi',

  state: () => ({
    schemaLoaded: false,
    config: {} as Record<string, any>,
  }),

  getters: {
  },

  actions: {
    getConnection(connectionKey: string) {
      return this.config[connectionKey]
    },
    async load(connectionKey: string, url: string): Promise<void> {
      try {

        this.config[connectionKey] = {};
        const schemas = await axios.get(url).then(
          ({data}) => data.components
        )
        this.config[connectionKey] = schemas;

      } catch(err) {
        console.error(err)
      } finally {
        this.schemaLoaded = true
      }
    }
  }
})

        // console.log(`Loading OpenAPI Schema ${connectionKey} from ${url}`);

        // return axios.get(url)
        //   .then((res) => {
        //     //console.log(res.data);
        //     this.config[connectionKey] = {};
        //     this.config[connectionKey].schema = res.data.components.schemas;
        //     console.log('ASYNC LOAD', this.config[connectionKey])
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



