

export type Operator = 'in' | '!in' | 'like' | '!link' | '=' | '>' | '>=' | '<' | '<=' | 'null' | '!='

export type QueryTuple = [ string, Operator | any, any | undefined]


export type JustProps<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K];
};
