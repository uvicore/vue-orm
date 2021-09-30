

export type JustProps<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K];
};

export type Operator = 'in' | '!in' | 'like' | '!link' | '=' | '>' | '>=' | '<' | '<=' | 'null' | '!='

export type Tupular = [ string, Operator | any, any | undefined] | null


export type ModelProp = Record<string, {
  title: string
  description?: string
  type?: string
}>

export type CxnSchema = {
  title: string
  description?: string
  properties: ModelProp
}
