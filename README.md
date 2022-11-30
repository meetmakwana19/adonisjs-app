## Steps taken in the development of app 

Try to follow the docs https://docs.adonisjs.com/guides/installation


1. Creation of app 
```
npm init adonis-ts-app@latest my-app
```
Choose `web` project structure and everything else as default 
2. Run the app 
```
node ace serve --watch
```
or 
```
npm run dev
```
since package.json has the running command in dev script.
3. Seeing the app directory(extras)
   1. `AppProvider.ts` has everything for the app's lifecycle
   2. `/contracts` has definitions of other custom types(typesript)
4. Playing in `routes.ts`
   1. Will show all the info about HttpContext
   ```
   Route.get('/news', (ctx) => {
    console.log(ctx) 
    })
   ```
   2. Added news/view.edge route in /resources.
      1. Can replace the get route with `on` route in single line which is more efficient ; `Route.on("/news").render("news.view")`
   3. Created a sample post route on /news and tested it on tunderclient VS code extension.
   4. Similarly did for patch and delete but noticed the `:id` in from `params` response can be any string and not just number. So read `Params matchers` in the docs and implemented them.
      1. But still the id is in string form so doing `Params casting`
5. Named Routes using `.as`
6. To list routes beautifully :
```
node ace list:routes
```

#### Adonis Shell 

1. Enter inside 
```
node ace repl
```
2. Creating a route
```
> import Route from '@ioc:Adonis/Core/Route'
{}
> Route.makeUrl("news_view")
'/news'
> Route.makeUrl("news_patch", [15])
'/news/15
> Route.makeUrl("news_patch", [15])
'/news/15
```

#### DB part :

Remember to always have a look into the DB 

1. Need to install lucid to interact with the DB and lucid will provide ORM which will make it easier for DB interactions.
```
npm i @adonisjs/lucid
```
2. Configuring the lucid
```
node ace configure @adonisjs/lucid
```
Selected postgresql 
3. The output of above command will be 
```
Open the env.ts file and paste the following code inside the Env.rules object.

    DB_CONNECTION: Env.schema.string(),

    ## Variables for the PostgreSQL driver

    PG_HOST: Env.schema.string({ format: 'host' }),
    PG_PORT: Env.schema.number(),
    PG_USER: Env.schema.string(),
    PG_PASSWORD: Env.schema.string.optional(),
    PG_DB_NAME: Env.schema.string(),
```
So adding `DB_CONNECTION: Env.schema.string(),` and variables in the [env.ts](env.ts)
4. Creating a postgresql db from command line 
```
createdb adonisjs_course
```
5. To chck if it got created run 
```
psql adonisjs_course
```
If you enter in the shell means it was created.
6. If want to drop the db then 
```
dropdb adonisjs_course
```
7. Now need to run **Migration**. Migration is a skeleton of how our table has to be. 
8. To create a schema for DB in adnoisjs
```
node ace make:migration articles
```
9. Run it 
```
node ace migration:run

```
10. Try to use the DB using TablePlus app and added one dummy entry directly inside DB from there.

#### Using DB 

1. Refer https://docs.adonisjs.com/guides/database/query-builder to use DB inside our app.
2. Used the `.from` method in get news route to show DB data in JSON form on the web 
3. Read https://docs.adonisjs.com/guides/views/data-flow to understand how to parse DB items in view and parse it in [view](resources/views/news/view.edge)
   1. Also passing 2nd arguement of state as the database table name in {} in the routes file

#### Controllers

1. Create a controller 
```
node ace make:controller Articles
```
2. Connecting controller with route so passed all the DB logic into the controller from routes.ts

#### Form handling for POST action 

1. Create a view template first
```
node ace make:view news/create
```
2. Wrote `create` method for it in the controller.
3. Made a get route ton render post form. 
4. Install `shield` package for csrf to work
```
npm i @adonisjs/shield
```
Configure it 
```
node ace configure @adonisjs/shield
```
Pasted the following in `Server.middleware.register`
```
  () => import('@ioc:Adonis/Addons/Shield')
```
5. Validating the form with [CSRF Token](https://docs.adonisjs.com/guides/security/web-security#csrf-protection) 

#### Store data in DB via POST form

1. Creating post method in the ArticlesController.
2. Making POST route one liner in the routes.ts
3. Wrote insert query in the method reading (this)[https://docs.adonisjs.com/reference/database/insert-query-builder]

#### Request validation 

1. Added vallidator for form POST reading [this](https://docs.adonisjs.com/guides/validator/introduction)
2. For Server rendered app docs showed to use flash msgs in the view template
3. Riight now controller is messed up with all the works of validations of schema, inserting in DB, etc
4. So create a validator for this purpose
```
node ace make:validator CreateArticle
```
5. Putting schema structure in this validator

#### View templates 

1. Creating a partial for [navbar](resources/views/partials/navbar.edge) and also footer.
2. Creating a layouts dir.
3. Removed all html from news dir and created one main.edge layout 

#### Edit form 

1. Created get route for edit form in the routes.ts
2. Added a button for it by also passing slug as id in the view.edge
3. Wrote edit method in the ArticlesController
4. Created a view for edit 
```
node ace make:view news/edit
```
5. Copied code from create view into edit view and changed few things like heading ad form action url 

#### Method spoofing 

1. Standard HTML forms cannot make use of all the HTTP verbs beyond GET and POST. It means you cannot create a form with the method PUT.
2. However, AdonisJS allows you to spoof the HTTP method using the _method query string. In the following example, the request will be routed to the route listening for the PUT request..... [docs](https://docs.adonisjs.com/cookbooks/validating-server-rendered-forms#form-method-spoofing)
3. So made a hidden field for this in the edit form.
```
<input type="hidden" name="_method" value ="PATCH">
```
4. Form method spoofing only works:
   1. When the value of http.allowMethodSpoofing is set to true inside the config/app.ts file
   2. And the original request method is POST.

#### Resourceful routes 

1. Added one for news in the routes.ts
2. Whenever we need help for some command use something like `-h` flag
Example :
```
node ace make:controller Test -h
```
O/P:
```
Make a new HTTP controller

Usage: make:controller <name>

Arguments
  name                    Name of the controller class

Flags
  -r, --resource boolean  Add resourceful methods to the controller class
  -e, --exact boolean     Create the controller with the exact name as provided
```
So can use `-r` flag too.
3. API routes wont give us view routes 
```
Route.resource("news", "ArticlesController").apiOnly();
```
4. To change default params id 
```
Route.resource("news", "ArticlesController").paramFor("news", "slug").as("news");
```
 
#### Create slug 

1. Created slug in the store method in ArticlesController.

#### Models

1. Keep the name of the model exactly same as the name of the table but in singular form.
```
node ace make:model Article
```
2. Article extends `BaseModel` which gives model the power of Lucid ORM.