// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import View from '@ioc:Adonis/Core/View'
import Database from '@ioc:Adonis/Lucid/Database'
// import { schema } from '@ioc:Adonis/Core/Validator'
import CreateArticleValidator from 'App/Validators/CreateArticleValidator'

export default class ArticlesController {
    public async view({ view }) {
        const articles = await Database.from('articles') // 👈 gives an instance of select query builder
        .select('*')
        // return articles
      
        return view.render('news/view', {articles}) //passing 2nd arguement of state as the database table name in {} 
      
    }

    public create({ view }){
        return view.render("news/create")
    }

    public async post({ response, request}){

        // destructuring the form contents 
        // const { title, image, content } = request.body();
        const payload = await request.validate(CreateArticleValidator );
        // return request.body();
        
        await Database.table("articles").insert({
            // title: title,
            // image: image,
            // content: content,
            // slug: "yoyo1",
            ...payload,
            slug: payload.title
        })
        
        return response.redirect().back()
    }

    public async edit({ view, params }){
        const { slug } = params;
        const article = await Database.from("articles").where("slug", slug).first();
        // return article;
        return view.render("news/edit", { article })
    }

}
