# Vue Uvicore API Frontent ORM

## Intro

This is a vue API client for Uvicore specific "autoapi" REST endpoints.

In nearly every way this is actually a frontend ORM (Object Relational Mapping).  All uvicore API's are deeply relational.  Vue models represent the relational data from the backend API.


## Uvicore

Uvicore is an async Python Web, API and CLI full-stack framework.  These uvicore/vue-* libraries help uvicore developers build vue applications.


# Where

## Notes
Valid operators are `in, !in, like, !like, =, >, >=, <, <=, null` 

## Vue example


``` ts

type Operator = 'in' | '!in' | 'like' | '!link' | '=' | '>' | '>=' | '<' | '<=' | 'null' | '!null' 

type Whereable = Record<string, Operator = '=', value>

class QueryBuilder<E extends Model> {
  this._where: Record<string, Whereable> = {}
...
  public where(where: Whereable | Whereable[]): this {
    if (typeof where === 'object') {
      this._where = {}
    }
    
    return this;
  }
}

users = User.query().where('eye_color', '=', 'red').get() 

users = User.query().where('eye_color', 'red').get() 

```

# Order by

## Uvicore Example

``` python
Post.query().order_by('id').get()  # One col, default ASC
Post.query().order_by('id', 'DESC').get()  # One col, DESC
Post.query().order_by(['id', 'title']).get() # Two col, default ASC on each
Post.query().order_by([('id', 'DESC'), 'title']).get() # Two col, first DESC, second ASC
Post.query().order_by([('id', 'DESC'), ('title', 'DESC')]).get() # Two col, first DESC, second ASC 

```

## Vue Example
``` ts
type Orderable = Record<string, 'ASC' | 'DESC' = 'ASC'>


public orderBy(orderBy: Orderable | Orderable[]):this {

  if (typeof orderBy === 'object') {
    
  } else if ()

  this._orderBy = orderBy
  return this
}

Post.query().orderBy([fieldname]).get()

Post.query().orderBy([fieldone, fieldtwo]).get()

Post.query().orderBy([fieldone, fieldtwo, ]).get()


```




``` ts
//    uvicore url =   /users?where={"eye_color": "red"} 
//                    /users?where={"eye_color": ["!=", "red"]} 

Post.query().find()




```
