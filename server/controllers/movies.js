const DB = require('../utils/db.js')

//执行数据库操作，并返回数据
module.exports = {
    list: async ctx => {
        ctx.state.data = await DB.query("SELECT * FROM movies;")
    },
	
    movie: async ctx => {
        const movie_id = ctx.request.query['movie_id']
        if (!movie_id) {
            ctx.state.data = {
                error: '请提供参数 movie_id'
            }
            return
        }

        ctx.state.data = await DB.query(`SELECT * FROM movies Where id = ${movie_id}`)
    }
}