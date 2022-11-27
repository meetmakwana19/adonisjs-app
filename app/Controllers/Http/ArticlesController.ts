// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import View from '@ioc:Adonis/Core/View'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ArticlesController {
    public async view({ view }) {
        const articles = await Database.from('articles') // 👈 gives an instance of select query builder
        .select('*')
        // return articles
      
        return view.render('news.view', {articles}) //passing 2nd arguement of state as the database table name in {} 
      
    }

    public create({ view }){
        return view.render("news/create")
    }

    public async post({ request}){
        // destructuring the form contents 
        const { title, image, content } = request.body();
        // return request.body();
        
        await Database.table("articles").insert({
            title: title,
            image: image,
            content: content,
            slug: "yoyo1",
        })
        // return response.redirect().back()
    }
}
