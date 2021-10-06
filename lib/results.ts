import { ModelRef } from "./model";


export class Results<E extends ModelRef | any> {
  loading: boolean
  error: any | null
  result: E
  results: E[]
  // count: number

  constructor() {
    this.loading = true
    this.error = null
    this.result = Object.create({}) as E
    this.results = Array.from<E>([])
  }

  get count(): number {
    return this.results.length || ([this.result]).length
  }

  get data() {
    return this.result || this.results || null
  }

  reset() {
    this.loading = true
    this.error = null
    this.result = Object.create({}) as E
    this.results = Array.from<E>([])
  }
}
