import { Results } from './results';
import { QueryBuilder } from './builder';
import { reactive, UnwrapRef } from 'vue';


// export interface ModelInterface<E> {
//   query(): QueryBuilder<E>;
// }




/**
 * Uvicore ORM style API client Model base class
 * @returns Model
 */
 export abstract class Model {

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





/**
 * Model configuration interface
 */
export interface ModelConfig {
  connection: string,
  path: string,
}
