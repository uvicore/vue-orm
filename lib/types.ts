

export type Operator = 'in' | '!in' | 'like' | '!link' | '=' | '>' | '>=' | '<' | '<=' | 'null' | '!='

export type QueryTuple = [ string, Operator | any, any | undefined]

