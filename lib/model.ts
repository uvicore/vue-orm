import { Results } from './results';
import { QueryBuilder } from './builder';
import { reactive, UnwrapRef } from 'vue';


/**
 * Uvicore ORM style API client Model base class
 * @returns Model
 */
export function Model<E>(): any {

  abstract class Model {

    public static query(): QueryBuilder<E> {
      return new QueryBuilder<E>(this);
    }

    public static newRef(): UnwrapRef<Results<E>> {
      return reactive<Results<E>>(new Results());
    }

    public save(): string {
      console.log("MODEL SAVE() HERE");
      return "Save() here!"
    }
  }

  return Model;
}


/**
 * Model configuration interface
 */
export interface ModelConfig {
  connection: string,
  path: string,
}
