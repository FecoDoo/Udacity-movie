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
    },

	check: async ctx => {
		const data = ctx.request.query
		if (!data) {
			ctx.state.data = {
				error: '请提供参数'
			}
			return
		}
		const movie_id = data['movie_id']
		const user_id = data['user_id']
		const res = await DB.query('SELECT * FROM reviews WHERE user_id = ? AND movie_id = ?',[user_id,movie_id])

		if (res == undefined){
			ctx.state.data = 0
		} else {
			ctx.state.data = 1
		}
	}
}