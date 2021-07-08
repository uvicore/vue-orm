/**
 * ORM style API Client Results class.
 * Results from API are not returned directly but wrapped in this Result
 * class which provides additional metadata including loading, error and reset.
 */
export class Results<E> {
  public loading: boolean = true
  public error: any = null
  public count: number = 0
  public result: E = {} as E
  public results: E[] = []

  public get ready(): boolean {
    return !this.loading;
  }

  public reset(): void {
    // Clear result while keeping the same ref for reactive consistency
    this.loading = true
    this.error = null
    this.count = 0
    this.result = {} as E
    this.results = []
  }
}
