import axios, { AxiosInstance } from 'axios'
import { ModelConfig, ModelRef} from './model'
import { Operator } from "./types"
import { useApiStore } from './store'
import { Results } from "./results"
import { reactive, UnwrapRef } from 'vue'


/**
 * Uvicore ORM style API client query builder
 * Similar look and feel (but not exact) to Uvicore's backend python orm.
 * Uvicore provides an "autoapi" with compled queryability.  This API client
 * helps you query Uvicore style APIs with chainable elegance and precision!
 */
export class QueryBuilder<E extends ModelRef> {
  entity: E
  config: ModelConfig
  api: AxiosInstance
  results: UnwrapRef<Results<E>>;


  private _state: any | undefined
  // Query builder properties


  private _queryParams: Record<string, any | any[]> = {}

  private _extraPath = ''
  private _includes: string[] | undefined
  private _where: [ string, Operator | any, any | undefined ][] | undefined
  private _orWhere: [ string, Operator | any, any | undefined ][] | undefined
  private _filter: [ string, Operator | any, any | undefined ][] | undefined
  private _orFilter: [ string, Operator | any, any | undefined ][] | undefined
  private _orderBy: [ string, 'ASC' | 'DESC'][] | undefined
  private _sort: [ string, 'ASC' | 'DESC'][] | undefined
  private _page: number | undefined
  private _pageSize: number | undefined


  /**
   * Instantiate class
   * @param entity actual model class (non instance)
   */
  constructor(entity: E) {
    this.entity = entity
    this.config = (entity as any).config
    this.api = axios.create({ baseURL: useApiStore().apis[this.config.connection].url })
    this.results = reactive<Results<E>>(new Results<E>())
  }

  public sort(sortables: { field: string, order: 'ASC' | 'DESC' }[], o: undefined): this
  public sort(field: string | { field: string, order: 'ASC' | 'DESC' | undefined }[], order: 'ASC' | 'DESC' | undefined = 'ASC'): this {
    if (typeof this._sort === 'undefined') {
      this._sort = []
    }
    if (typeof field === 'string') {
      this._sort.push([ field, order ])
    } else if (field instanceof Array) {
      field.forEach(({field, order}) => this._sort!.push([field, order || 'ASC']))
    }
    return this
  }

  public page(page: number): this {
    this._page = page
    return this
  }

  public pageSize(pageSize: number): this {
    this._pageSize = pageSize
    return this
  }
  /**
   * Return results into a store.  Requires store have a .set() action like so:
    set(state: UnwrapRef<Results<Space>>) {
      this.loading = state.loading
      this.error = state.error
      this.result = state.result
      this.results = state.results
    },
   * @param store
   * @returns QueryBuilder
   */
  public state(store: any): this {
    this._state = store
    return this
  }

  /**
   * Return result into an existing vue reactive ref.  Useful if your compoment
   * needs to pre declare a ref and the query should return results back to it
   * @param ref Existing vue reactive ref
   * @returns QueryBuilder
   */
  public ref(ref: UnwrapRef<Results<E>>): this {
    this.results = ref
    return this
  }

    /**
   * Include deeply nested children relation records through array of dotnotation strings
   * @param includes array of include strings
   * @returns QueryBuilder
   */
  public include(children: string | string[]) {
    if (typeof this._includes === 'undefined') {
      this._includes = []
    }
    children instanceof Array
      ? children.forEach(child => this._includes!.push(child))
      : this._includes!.push(children)
    return this
  }

  public orderBy(orderBys: { field: string, order: 'ASC' | 'DESC' }[], o: undefined): this
  public orderBy(field: string | { field: string, order: 'ASC' | 'DESC' | undefined }[], order: 'ASC' | 'DESC' | undefined = 'ASC'): this {
    if (typeof this._orderBy === 'undefined') {
      this._orderBy = []
    }
    if (typeof field === 'string') {
      this._orderBy.push([ field, order ])
    } else if (field instanceof Array) {
      field.forEach(({field, order}) => this._orderBy!.push([field, order || 'ASC']))
    }
    return this
  }

  /**
   * Where AND query.  Chain multiple .where() for ANDs
   * @param field Model field
   * @param operator operator =, !=, >, <, >=, <=
   * @param value field value to where
   * @returns QueryBuilder
  */
  public where(field: string, operator: Operator, value: any): this
  public where(field: string, value: any, operator: undefined): this
  public where(where: [ string, Operator | any, any | undefined][], o: undefined, v: undefined): this
  public where(where: string | [ string, Operator | any, any | undefined][], operator: Operator | undefined, value: any | undefined): this {
    if (typeof this._where === 'undefined') {
      this._where = []
    }
    if (typeof where === 'string') {
      this._where.push([ where, value ? operator : '=', value || operator ])
    } else if (where instanceof Array) {
      where.forEach(([f, o, v]) => {
        const operator = typeof v !== 'undefined' ? o : '='
        const value = typeof v === 'undefined' ? o : v
        this._where!.push([f, operator, value])
      })
    }
    return this
  }

  public orWhere(field: string, operator: Operator, value: any): this
  public orWhere(field: string, value: any, operator: Operator | undefined): this
  public orWhere(orWhere: [ string, Operator | any, any | undefined][], o: undefined, v: undefined): this
  public orWhere(orWhere: string | [ string, Operator | any, any | undefined][], operator: Operator | undefined, value: any | undefined): this {
    if (typeof this._orWhere === 'undefined') {
      this._orWhere = []
    }
    if (typeof orWhere === 'string') {
      this._orWhere.push([ orWhere, value ? operator : '=', value || operator ])
    } else if (orWhere instanceof Array) {
      orWhere.forEach(([f, o, v]) => {
        const operator = typeof v !== 'undefined' ? o : '='
        const value = typeof v === 'undefined' ? o : v
        this._orWhere!.push([f, operator, value])
      })
    }
    return this
  }

  public filter(field: string, operator: Operator, value: any): this
  public filter(field: string, value: any, operator?: Operator | undefined): this
  public filter(filter: [ string, Operator | any, any | undefined][], o: undefined, v: undefined): this
  public filter(filter: string | [ string, Operator | any, any | undefined][], operator: Operator | undefined, value: any | undefined): this {
    if (typeof this._filter === 'undefined') {
      this._filter = []
    }
    console.log(filter, operator, value)
    if (typeof filter === 'string') {
      this._filter.push([ filter, value ? operator : '=', value || operator ])
    } else if (filter instanceof Array) {
      filter.forEach(([f, o, v]) => {
        const operator = typeof v !== 'undefined' ? o : '='
        const value = typeof v === 'undefined' ? o : v
        this._filter!.push([f, operator, value])
      })
    }
    return this
  }

  public orFilter(field: string, operator: Operator, value: any): this
  public orFilter(field: string, value: any, operator: Operator | undefined): this
  public orFilter(orFilter: [ string, Operator | any, any | undefined][], o: undefined, v: undefined): this
  public orFilter(orFilter: string | [ string, Operator | any, any | undefined][], operator: Operator | undefined, value: any | undefined): this {
    if (typeof this._orFilter === 'undefined') {
      this._orFilter = []
    }
    if (typeof orFilter === 'string') {
      this._orFilter.push([ orFilter, value ? operator : '=', value || operator ])
    } else if (orFilter instanceof Array) {
      orFilter.forEach(([f, o, v]) => {
        const operator = typeof v !== 'undefined' ? o : '='
        const value = typeof v === 'undefined' ? o : v
        this._orFilter!.push([f, operator, value])
      })
    }
    return this
  }

  /**
   * Execute query of a SINGLE result (non-array), stored in Result.result (singular).
   * If passing one param .find(1) field is automatically set to PK and url is /pk.
   * If passing two params .find('name', 'matthew') we convert into a where on name=matthew.
   * If passing NO params, use the query builder wheres and assume a SINGLE TOP 1 result.
   * @param field Model field to find one of
   * @param value Field value
   * @returns Vue reactive reference of model Results class
  */
  public find(key: string, value?: any): UnwrapRef<Results<E>> {
    this.results.reset()

    let params = ''

    if (key && value) {

      this.where(key, '=', value)
    } else {
      params = '/' + key
    }
    this.api.get(this.buildQueryParams(params, true)).then(

      (response) => {
        //@ts-ignore
        const record = new this.entity(response.data)
        Object.assign(this.results.result, record)
        this.results.count = 1
      }).catch(
      (err) => this.results.error = err
    ).finally(
      () => this.results.loading = false
    )

    if (this._state) {
      this._state.set(this.results)
    }
    return this.results
  }


  /**
   * Execute query of multiple results (array), stored in Result.results (plural)
   * If you have a custom endpoint that does not follow Uvicore autoapi standards then you can
   * skip the query builder chains and put your URL directly in this .get('/1?include=xyz') method.
   * If params, all query builder items passed in are IGNORED completely.
   * @param params Custom user defined params to bypass querybuilder with direct URL access
   * @param single If true, results should be a single Model instance, not an array of Model instances
   * @returns Vue reactive reference of model Results class
  */
  public get(params?: string): UnwrapRef<Results<E>> {
    this.results.reset()
    this.api.get(this.buildQueryParams(params, false)).then(
      (response) => {
        for (const data of response.data) {
          //@ts-ignore
          this.results.results.push(new this.entity(data))
          this.results.count = response.data.length
        }
      }).catch(
      (err) => this.results.error = err
    ).finally(
      () => this.results.loading = false
    )

    if (this._state) {

    }
    return this.results
  }


  /**
   * Convert class query builder into Uvicore compatible URL
   * @param params optional params passed in by user on .get() for manual URL query
   * @returns URL string
  */
  private buildQueryParams(params?: string, single = false) {
    let url: string = ''

    if (single) {
      // Includes
      url += this.config.url + this._extraPath + params;

      if (this._includes) {
        url += '&include=' + this._includes.join(',')
      }

      // Wheres AND
      if (this._where && !params) {
        url += '&where=' + JSON.stringify(this._where)
      }

      if (this._filter) {
        url += '&filter=' + JSON.stringify(this._filter)
      }

      if (this._orFilter) {
        url += '&or_filter=' + JSON.stringify(this._orFilter)
      }

      if (this._sort) {
        url += '&sort=' + JSON.stringify(this._sort)
      }

      if(this._sort || this._filter || this._where || this._sort || this._orFilter || this._includes) {
        url = url.replace(url.charAt(this.config.url.length + this._extraPath.length + (params!.length | 0)), '?');
      }
      // Set first char to ?

      return url

    } else {
      // Includes
      if (this._includes) {
        url += '&include=' + this._includes.join(',')
      }

      if (this._sort) {
        url += '&sort=' + JSON.stringify(this._sort)
      }

      if (this._page) {
        url += '&page=' + this._page
      }

      if (this._pageSize) {
        url += '&page_size=' + this._pageSize
      }
      // Wheres AND
      if (this._where) {
        url += '&where=' + JSON.stringify(this._where)
      }

      if (this._orWhere) {
        url += '&or_where=' + JSON.stringify(this._orWhere)
      }

      if (this._orderBy) {
        url += '&order_by=' + JSON.stringify(this._orderBy)
      }

      if (this._filter) {
        url += '&filter=' + JSON.stringify(this._filter)
      }

      if (this._orFilter) {
        url += '&or_filter=' + JSON.stringify(this._orFilter)
      }


      url = url.replace(url.charAt(0), '?');
      url = this.config.url + this._extraPath + url;

      return url
    }
  }
}


