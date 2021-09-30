

import { ModelRef } from "./model"

export class Results<E extends ModelRef> {
  loading = true
  error: any | null = null
  result: E = {} as E
  results: E[] = []

  get data() {
    return this.result || this.results
  }

  reset() {
    this.loading = true,
    this.error = null
    this.result = Object.create({})
    this.results = []
  }
}
