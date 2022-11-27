// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ArticlesController {
    public async view({ view }) {
        const articles = await Database.from('articles') // 👈 gives an instance of select query builder
        .select('*')
        // return articles
      
        return view.render('news.view', {articles}) //passing 2nd arguement of state as the database table name in {} 
      
    }
}
