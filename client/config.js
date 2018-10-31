/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://0w5de2ck.qcloud.la/';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 拉取用户信息
        user: `${host}/weapp/user`,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        //获取对应电影的影评：reviews?movie_id=''
        reviewsUrl: `${host}/weapp/reviews?movie_id=`,

        //上传影评
        addReviewsUrl: `${host}/weapp/reviews/add`,

        //热门电影
        hotMoviesUrl: `${host}/weapp/movies`,

        //所有影评
        allReviewsUrl: `${host}/weapp/reviews/all`,

		//判断是否已经评价过当前电影
		addReviewCheck: `${host}/weapp/movie/check?`,
        
		//取一部电影
        movie: `${host}/weapp/movie?movie_id=`,

		//验证评论是否已经被收藏
		favourReviewCheck: `${host}/weapp/reviews/check?review_id=`,
        
		//收藏一条评论
        favourReviewUrl: `${host}/weapp/reviews/favour?review_id=`,

        //取出所有评论
        allFavourUrl: `${host}/weapp/reviews/allFavour`,

        //音频 url
        mp3Host: `https://udacity-fecodoo-1254368307.cos.ap-shanghai.myqcloud.com/voices/`,

        //取出所有我的评论
        mineReviewsUrl: `${host}/weapp/reviews/mine`
    }
};

module.exports = config;