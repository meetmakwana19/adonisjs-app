import Database from '@ioc:Adonis/Lucid/Database'
import CreateArticleValidator from 'App/Validators/CreateArticleValidator'

export default class ArticlesController {

    public async index({ view }) {
        const articles = await Database.from('articles').select("*"); 

        // return articles
        return view.render('news/view', { articles }); //passing 2nd arguement of state as the database table name in {} 
    }

    public create({ view }){
        return view.render("news/create")
    }

    public async store({ response, request}){
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
            slug: payload.title.replace(" ", "_") + +new Date()
        })
        return response.redirect().back()
    }

    public async edit({ view, params }){
        const { slug } = params;
        const article = await Database.from("articles").where("slug", slug).first();
        // return article;
        return view.render("news/edit", { article })
    }

    public async update ({request, response, params}){
        const payload = await request.validate(CreateArticleValidator );
        await Database.from("articles").where("slug", params.slug).update(payload)
        return response.redirect().back();
        // return "ddfef"
    }
    
    public async destroy({ params, response }) {
        await Database.from("articles").where("slug", params.slug).delete();
        return response.redirect().back();
      }
}
