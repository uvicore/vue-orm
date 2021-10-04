import { ModelRef } from "./model";


export class Results<E extends ModelRef | any> {
  loading = true
  error: any | null = null
  result: E = {} as E
  results: E[] = []
  count = 0

  get data() {
    return this.result || this.results || null
  }

  reset() {
    this.loading = true
    this.count = 0
    this.error = null
    this.result = {} as E
    this.results = []
  }
}
