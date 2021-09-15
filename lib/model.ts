import { useOpenApiStore } from "./store"
import { UnwrapRef } from 'vue';
import { Results } from './results';


/**
 * Model configuration interface
 */
 export interface ModelConfig {
  name: string,
  connection: string,
  path: string,
}


/**
 * Uvicore ORM style API client Model base class
 * @returns Model
 */
 export abstract class Model {

  public static get_schema(connectionKey: string, modelname: string): UnwrapRef<Results<Record<string, any>>> {
    return useOpenApiStore().schema(connectionKey, modelname);
  }

  public save() {
    console.log('MODEL save() here', this)
  }

  public delete() {
    console.log('MODEL delete() here', this)
  }

}





// @ts-ignore
// export function Model<E>() {

//   abstract class Model {

//     public static query(): QueryBuilder<E> {
//       return new QueryBuilder<E>(this);
//     }

//     public static newRef(): UnwrapRef<Results<E>> {
//       return reactive<Results<E>>(new Results());
//     }

//     public save(): string {
//       console.log("MODEL SAVE() HERE");
//       return "Save() here!"
//     }
//   }
//   return Model;
// }



// export class Model2 {

//   // @ts-ignore
//   public static query(): QueryBuilder<E> {
//     // @ts-ignore
//     return new QueryBuilder<E>(this);
//   }

//   // @ts-ignore
//   public static newRef(): UnwrapRef<Results<E>> {
//     // @ts-ignore
//     return reactive<Results<E>>(new Results());
//   }

//   public save(): string {
//     console.log("MODEL SAVE() HERE");
//     return "Save() here!"
//   }
// }



// export class Model<E> {
//   // @ts-ignore
//   public static query(): QueryBuilder<E> {
//     // @ts-ignore
//     return new QueryBuilder<E>(this);
//   }

//   // @ts-ignore
//   public static newRef(): UnwrapRef<Results<E>> {
//     // @ts-ignore
//     return reactive<Results<E>>(new Results());
//   }

//   public save(): string {
//     console.log("MODEL SAVE() HERE");
//     return "Save() here!"
//   }
// }





