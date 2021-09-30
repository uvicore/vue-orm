import axios, { AxiosInstance } from 'axios'
import { ModelConfig, ModelRef} from './model'

import { useApiStore } from './store'
import { Results } from "./results"
import { reactive, UnwrapRef, ref, Ref } from 'vue'

export class QueryBuilder<E extends ModelRef> {
  entity: E
  config: ModelConfig
  api: AxiosInstance
  results: UnwrapRef<Results<E>>;

  constructor(entity: E) {
    this.entity = entity
    this.config = (entity as any).config
    this.api = axios.create({
      baseURL: useApiStore().apis[this.config.connection].url
    })
    this.results = reactive<Results<E>>(new Results<E>())
  }

  async find(id: string): Promise<void> {
    try {
      this.results.reset()
      const apiCall = await this.api.get(`${this.config.url}/${id}`)
      const result = await apiCall.data
      // @ts-ignore
      Object.assign(this.results.result, new this.entity(result) as E)
    } catch (err) {
      this.results.error = err
    } finally {
      this.results.loading = false
    }

    console.log('FIND', this.results.result)
  }

  async get(): Promise<void> {
    try {
      this.results.reset()
      const apiCall = await this.api.get(this.config.url)
      for await (const result of apiCall.data) {
        // @ts-ignore
        this.results.results.push(new this.entity(result))
      }
    }
    catch (err) {
      this.results.error = err
    }
    finally {
      this.results.loading = false
    }

    console.log('GET', this.results.results)
  }
}


