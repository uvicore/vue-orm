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
    this.api = axios.create({ baseURL: useApiStore().apis[this.config.connection].url })
    this.results = reactive<Results<E>>(new Results<E>())
  }

  private _queryParams = {}
  private _include = []
  private _where = []
  private _orWhere = []
  private _filter = []
  private _orFilter = []
  private _orderBy = []
  private _keyBy = []

  find(id: string): UnwrapRef<Results<E>> {
    this.results.reset()
    this.api.get(`${this.config.url}/${id}`).then(
      (response) => Object.assign(this.results.result, response.data)
    ).catch(
      (err) => this.results.error = err
    ).finally(
      () => this.results.loading = false
    )
    console.log('FIND', this.results.result)
    return this.results
  }

  get(): UnwrapRef<Results<E>> {
    this.results.reset()
    this.api.get(this.config.url).then(
      (response) => this.results.results.push(response.data)
    ).catch(
      (err) => this.results.error = err
    ).finally(
      () => this.results.loading = false
    )
    console.log('GET', this.results.results)
    return this.results
  }
}


