import Route from '@ioc:Adonis/Core/Route'

// ----------------root route
Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

// Route.group(() => {
//   Route.resource("news", "ArticlesController").paramFor("news", "slug").as("news");
// }).middleware('auth')

Route.resource("news", "ArticlesController").paramFor("news", "slug").middleware({
  create: ['auth'],
  store: ['auth'],
  edit: ['auth'],
  destroy: ['auth'],
}).as("news");

Route.on("/login").render("auth/login").as("auth.login")
Route.post("/login", async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')

  await auth.use('web').attempt(email, password)
  return response.redirect("/")
})  

Route.post('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  response.redirect('/login')
}).as("auth.logout")

// resourceful routes
// Route.resource("news", "ArticlesController").apiOnly();

// // ----------One liner routes
// Route.get("/news", "ArticlesController.view").as("news_view");
// Route.get("/news/create", "ArticlesController.create").as("news_create");
// Route.post("/news", "ArticlesController.post").as("news_post");
// Route.get("/news/:slug/edit", "ArticlesController.edit").as("news_edit");
// Route.patch("news/:slug", "ArticlesController.update").as("news_patch")
// Route.delete("/news/:slug", "ArticlesController.destroy").as("news_delete");

// Route.get('/news', async (ctx) => {
// // Route.get('/news', async ({ view }) => {
//   // return "News"
//   // return {content :"News"} //to return in JSON format
//   // console.log(ctx) 
//   // return view.render('news/view')  

//   // const articles = await Database.from('articles') // 👈 gives an instance of select query builder
//   // .select('*')
//   // // return articles

//   // return view.render('news.view', {articles}) //passing 2nd arguement of state as the database table name in {} 

//   // returning control to a controller
//   return new ArticlesController().view(ctx)
// }).as("news_view");

// -----One line way : "ControllerName.method_name'

// Route.on("/news").render("news.view").as("news_view");

// ------------------


// this going to be accessed by form
// Route.post("/news", ( {view}) => {
// Route.post("/news", ( {response}) => {
// Route.post("/news", ( {request, response}) => {
  // return "I am post route"
  // const { email, password } = request.body();
  // return { email, password }

  // return response.redirect("/news");
  // return view.render("news.create")
//   return request.body();
// }).as("news_post")

// Route.patch("/news/:id", ({ params }) => {
  //   console.log(params);
  //   // return "I am patch and params is " + {params}
  //   return {params}
// }).where('id', {
//   match: /^[0-9]+$/,
//   cast: (id) => Number(id)
// }).as("news_patch") //for id validation

// Route.delete("/news/:id", ({ params }) => {
//   console.log(params);
//   return {params}
// })
// .where('id', {
//   match: /^[0-9]+$/,
//   cast: (id) => Number(id)
// }).as("news.delete") //for id validation
