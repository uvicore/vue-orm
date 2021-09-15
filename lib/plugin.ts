import { App, inject, Plugin } from 'vue';
import { useOpenApiStore } from './store';



/**
 * Vue plugin for Uvicore Configuration Library
 * @param config any
 * @returns
 */
export function createOrm(config: Record<string, any>): Plugin {

  return {
    install(app: App): void {
      // Add config to our globalProperties
      // Accessible from components with this.$config
      //app.config.globalProperties.$config = config

      // But in setup() we don't have access to this so we also
      // provide the config through injection.
      //app.provide('config', config)

      console.log('ORM Plugin', config);

      //const openapi = useOpenApiStore();

      // Object.entries(config).forEach(([key, value]) => {
      //   // console.log(key, value);
      //   openapi.load(key, value.url + '/openapi.json')
      // })

    }
  }
}
