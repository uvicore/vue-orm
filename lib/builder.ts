import axios, { AxiosInstance } from 'axios';
import { UnwrapRef, reactive } from 'vue';
import { Model, ModelConfig } from './model';
import { Results } from './results';
import { useOpenApiStore } from './store';


type Field<E extends Model = any> = keyof E

type Operator = 'in' | '!in' | 'like' | '!link' | '=' | '>' | '>=' | '<' | '<=' | 'null' | '!='



interface Where<E extends Model> {
  field: Field<E>,
  operator: Operator,
  value: any
}


export class QueryBuilder<E extends Model> {
  private entity: E
  private config: ModelConfig
  private api: AxiosInstance

  // Query builder properties
  private _extraPath: string = ''
  private _state: any | null = null

  private _includes: Field[] = []
  private _where: Record<Field, [ Operator, any ]> = {}
  private _orderBy: Record<Field, 'ASC' | 'DESC'> = {}
  private _ref: UnwrapRef<Results<E>> | null = null


  public constructor(entity: E | any) {
    this.entity = entity;
    this.config = entity._config;

    this.api = axios.create({
      baseURL: useOpenApiStore().apis[this.config.connection].url,
    });
  }

  public state(store: any) {
    this._state = store
    return this
  }

  public ref(ref: UnwrapRef<Results<E>>): this {
    this._ref = ref
    return this;
  }

  public include(includes: string[]): this {
    this._includes = includes
    return this;
  }

  public orderBy(orderable: any | any[]): this {
    if (typeof this._orderBy === 'undefined') {
      this._orderBy = {}
    }

    if (orderable instanceof Array) {
      orderable.forEach(o => {
        console.log(o)
        const { field, order } = o
        this._orderBy![field] = order || 'ASC'
      })
    } else {
      this._orderBy[orderable.field] = orderable.order || 'ASC'
      console.log(this._orderBy)

    }
    return this
  }

  public where(where: Where<E>[]): this
  public where(where: Where<E>): this
  public where(where: Where<E> | Where<E>[])
  : this {


    if (where instanceof Array) {
      where.forEach(wh => {
        const { field, operator, value } = wh
        Object.assign(this._where, { [field as keyof E]: [ operator || "=", value ] })
      })
    } else {
      const { field, operator, value } = where
      Object.assign(this._where,{ [field as keyof E]: [ operator || '=', value ] })
    }

    console.log(this._where)
    return this;
  }


  public find(field: Field<E>, value?: any): UnwrapRef<Results<E>> | void {
    if (field && value) {
      this.where({ field, operator: '=', value })
      return this.get(`/${field}`, true)
    } else if (field) {
      return this.get(`/${field}`, true)
    }
  }

  public get(params?: string, single: boolean = false): UnwrapRef<Results<E>> {
    const results = this._ref || reactive<Results<E>>(new Results())
    if (this._ref) {
      results.reset();
    }

    const builderPath = this.buildUrlQuery(params);

    this.api.get(builderPath).then(({ data }) => {
        if (!Array.isArray(data)) {
          data = [data]
        }
        results.count = data.length
        results.loading = false
        if (data.length > 0) {
          for (let d of data) {
            // @ts-ignore
            const record = new this.entity(d);
            single ? results.result = record : results.results.push(record)

          }
        }
      // If .store() save to store state
      if ( this._state ) {
        this._state.set(results);
      }
    })
    .catch((error) => results.error = error)
    .finally(() => results.loading = false)
    // Return empty Ref immediately, ref will update with api results are returned
    return results;
  }

  private buildUrlQuery(params?: string): string {
    let url: string = ''

    // If we passed in custom params from .query(params) use those instead.
    if (params) return this.config.path + this._extraPath + params;

    // Includes
    if (this._includes) {
      url += '&include=' + this._includes.join(',')
    }

    // Wheres AND
    if (this._where) {
      url += '&where=' + JSON.stringify(this._where)
    }

    if (this._orderBy) {
      console.log('order by', this._orderBy)
      url += '&order_by=' + JSON.stringify(this._orderBy)
    }

    // Set first char to ?
    url = url.replace(url.charAt(0), '?');

    // Prefix with proper paths
    url = this.config.path + this._extraPath + url;
    console.log(url)
    // Return url
    return url;
  }

}


