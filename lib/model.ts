
import { QueryBuilder } from "./builder"
import { useApiStore } from "./store"


export interface ModelConfig {
  connection: string
  modelName: string
  url: string
}

export class ModelRef {
  static query(): QueryBuilder<ModelRef> {
    return new QueryBuilder<ModelRef>(ModelRef)
  }
  static schema(): Record<string, any> {
    return {}
  }
  static props(): any[] {
    return []
  }

  static save() {
    console.log('SAVING MODEL RECORD', this)
  }

  static delete() {
    console.log('DELETING MODEL RECORD', this)
  }
}


export function UvicoreModel(config: ModelConfig) {
  return function<T extends { new (...args: any[]): any }>(target: T) {

    const query = () => new QueryBuilder<any>(target);

    const schema = () => {
      const apiStore = useApiStore();
      return apiStore.schema(config.connection, config.modelName);
    };

    const props = () => {
      const apiStore = useApiStore();
      return apiStore.properties(config.connection, config.modelName);
    };

    target.prototype.config = config;
    target.prototype.query = query;
    target.prototype.schema = schema;
    target.prototype.props = props;
    Object.assign(target, { config, query, schema, props });

    // console.log(target)
    // return class extends target {
    //   static query(): QueryBuilder<T> {
    //     return new QueryBuilder<T>(ModelRef)
    //   }

    //   constructor(...args: any[]) {
    //     super()
    //   }
    // }
  }
}







