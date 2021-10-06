
import { QueryBuilder } from "./builder"
import { useApiStore } from "./store"
import { JustProps } from "./types"


export interface ModelConfig {
  connection: string
  modelName: string
  url: string
}


export class ModelRef {
  static query(): QueryBuilder<ModelRef> {
    return new QueryBuilder(ModelRef)
  }

  constructor(props: Partial<JustProps<ModelRef>> = {}) {
    Object.assign(props, this)
  }

}


export function UvicoreModel<Model extends ModelRef>(config: ModelConfig) {
  return function<T extends { new (...args: any[]): Model }>(target: T) {
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
    // return target
    // console.log(target)
    // return class extends target {
    //   static query(): QueryBuilder<T> {
    //     return new QueryBuilder<T>(target)
    //   }

    //   static schema(): Record<string, any> {
    //     const apiStore = useApiStore();
    //     return apiStore.schema((target as any).config.connection, (target as any).config.modelName);
    //   }
    //   static props(): any[] {
    //     const apiStore = useApiStore();
    //     return apiStore.properties((target as any).config.connection, (target as any).config.modelName);
    //   }

    //   constructor(...args: any[]) {
    //     super(...args)
    //   }
    // }
  }
}







