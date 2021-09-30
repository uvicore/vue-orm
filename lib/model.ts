import { UnwrapRef } from "vue"
import { Results } from "./results"
import { QueryBuilder } from "./builder"


export interface ModelConfig {
  connection: string
  modelName: string
  url: string
}

export class ModelRef {

  static results: UnwrapRef<Results<ModelRef>>

  static config: ModelConfig

  static query(): QueryBuilder<ModelRef> {
    return new QueryBuilder<ModelRef>(ModelRef)
  }
}


export function UvicoreModel(config: any) {
  return function<
    T extends { new (...args: any[]): any }
  >(target: T) {
    const query = () => new QueryBuilder(target);

    (target as any).config = config;
    (target as any).query = query;
    target.prototype.config = config;
    target.prototype.query = query

    console.log({
      len: target.length,
      name: target.name,
      proto: target.prototype
    })



    // const entity = new class extends target {}
    // //   static query(): QueryBuilder<any> {
    // //     console.log('STATIC DECORATOR QUERY METHOD', this)
    // //     return new QueryBuilder(target)
    // //   }
    // // }

    // console.log(entity)
    // return entity
    // Object.freeze(target)
    // console.log(Object.isFrozen(target))

    // return target
    // new class extends target {

    // //   static config = config
    // }



  }
}




