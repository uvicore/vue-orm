
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
}


export function UvicoreModel(config: ModelConfig) {
  return function<T extends { new (...args: any[]): any }>(target: T) {
    const query = () => new QueryBuilder<typeof target>(target);

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



  //   const className = config.modelName + 'Model'
  //   return class extends target {
  //     config = config
  //     static query(): QueryBuilder {
  //       return new QueryBuilder<any>(target);
  //     }
  //     static schema() {
  //       const apiStore = useApiStore()
  //       return apiStore.schema(config.connection, config.modelName)
  //     }
  //   }
  }
}







