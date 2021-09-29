import axios, { AxiosInstance } from 'axios';
import { UnwrapRef, reactive } from 'vue';
import { Model, ModelConfig } from './model';
import { Results } from './results';
import { useOpenApiStore } from './store';


type Field<E extends Model = any> = keyof E

type Operator = 'in' | '!in' | 'like' | '!link' | '=' | '>' | '>=' | '<' | '<=' | 'null' | '!='

type Where<E extends Model> = [ Field<E>, Operator | any, any | undefined]

export class QueryBuilder<E extends Model> {
  private entity: E
  private config: ModelConfig
  private api: AxiosInstance

  // Query builder properties
  private _extraPath: string = ''
  private _state: any | null = null
  private _includes: Field[] | null = null
  private _orderBy: Record<Field, 'ASC' | 'DESC'> | null = null
  private _ref: UnwrapRef<Results<E>> | null = null
  private _filter: Record<Field, [ Operator, any ]> | null = null
  private _where: [ Field, Operator, any ][] | null = null
  private _orWhere: [ Field, Operator, any ][] | null = null
  private _orFilter: [ Field, Operator, any][] | null = null

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

  public include(includes: Field | Field[]): this {
    if (includes instanceof Array) {
      this._includes = [];
      includes.forEach(field => this._includes!.push(field))
    } else {
      this._includes = [includes]
    }
    return this;
  }

  public orderBy(field: Field, order: 'ASC' | 'DESC' = 'ASC'): this {
    if (typeof this._orderBy === 'undefined') {
      this._orderBy = Object.create({ [field]: order })
    } else {
      Object.assign(this._orderBy, { [field]: order} )
    }

    return this
  }

  public filter(field: Field, operator: Operator, value: any): this
  public filter(field: Field, value: any, operator?: Operator): this
  public filter(filter: Where<E>[], o: undefined, v: undefined): this
  public filter(filter: Where<E>[] | Field, operator: Operator | undefined, value: any | undefined): this {
    if (this._filter === null) {
      this._filter = Object.create({})
    }
    if (filter instanceof Array) {
      Object.values(filter).forEach(w => {
        const field = w[0] as keyof E
        const operator: Operator = typeof w[2] === 'undefined' ? '=' : w[1]
        const value = typeof w[2] === 'undefined' ? w[1] : w[2]
        Object.assign(this._filter, { [field ]: [ operator || '=', value ] })
      })
    } else {
      const o = typeof value === 'undefined' ? '=' : operator
      const v = typeof value === 'undefined' ? operator : value

      Object.assign(this._filter,{ [ filter ]: [ o, v ] })
    }

    return this;
  }


  public orFilter(filters: Where<E>[]): this {
    if (this._orFilter === null) {
      this._orFilter = []
    }
    Object.values(filters).forEach(w => {
      const field = w[0] as string
      const operator: Operator = typeof w[2] === 'undefined' ? '=' : w[1]
      const value = typeof w[2] === 'undefined' ? w[1] : w[2]

      this._orFilter!.push([field, operator, value ])
    })

    return this;
  }

  public where(field: Field, operator: Operator, value: any): this
  public where(field: Field, value: any, operator?: Operator): this
  public where(where: Where<E>[], o: undefined, v: undefined): this
  public where(where: Where<E>[] | Field, operator: Operator | undefined, value: any | undefined): this {
    if (this._where === null) {
      this._where = []
    }
    if (where instanceof Array) {
      where.forEach(w => {
        const field = w[0] as keyof E
        const operator: Operator = typeof w[2] === 'undefined' ? '=' : w[1]
        const value = typeof w[2] === 'undefined' ? w[1] : w[2]
        this._where!.push([ field , operator, value ])
      })
    } else {
      const o = typeof value === 'undefined' ? '=' : operator
      const v = typeof value === 'undefined' ? operator : value

      this._where.push([ where, o!, v ])
    }

    return this;
  }




  public orWhere(wheres: Where<E>[]): this {
    if (this._orWhere === null) {
      this._orWhere = []
    }

    Object.values(wheres).forEach(w => {
      const field = w[0] as string
      const operator: Operator = typeof w[2] === 'undefined' ? '=' : w[1]
      const value = typeof w[2] === 'undefined' ? w[1] : w[2]

      this._orWhere!.push([field, operator, value ])

    })

    return this;
  }

  public find(field: string, value?: any): UnwrapRef<Results<E>> {
    if (field && value) {
      this.where(field, '=', value)
      return this.get(`/`, true)
    }
    return this.get(`/${field}`, true)

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
    if (params) {
      // Includes
      url += this.config.path + this._extraPath + params;

      if (this._includes) {
        url += '&include=' + this._includes.join(',')
      }

      // Wheres AND
      if (this._where) {
        console.log(this._where)
        url += '&where=' + JSON.stringify(this._where)
      }

      // Set first char to ?
      url = url.replace(url.charAt(this.config.path.length + this._extraPath.length + params.length), '?');

      return url
    } else {

      // Includes
      if (this._includes) {
        url += '&include=' + this._includes.join(',')
      }

      // Wheres AND
      if (this._where) {
        url += '&where=' + JSON.stringify(this._where)
      }
      if (this._orderBy) {
        url += '&order_by=' + JSON.stringify(this._orderBy)
      }

      // Set first char to ?
      url = url.replace(url.charAt(0), '?');

      // Prefix with proper paths
      url = this.config.path + this._extraPath + url;

      return url;
    }

  }

}


