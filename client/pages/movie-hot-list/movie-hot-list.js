//index.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const utils = require('../../utils/util.js')

Page({
    data: {
        isLoading: false,
        moviesList: [],
        errorMsg: ''
    },

    onLoad: function(options) {
        this.getHotList()
    },
	
	getHotList(){
		qcloud.request({
			url: config.service.hotMoviesUrl,
			success: result => {
				this.setData({
					moviesList: result.data.data
				})
			},
			fail: result => {
				wx.showModal({
					title: '返回错误',
					content: '请求失败',
					showCancel: false
				});
			}
		})
	},

	onPullDownRefresh: function() {
		this.getHotList()
	},

    listClick: function(e) {
        const movie = this.data.moviesList[e.currentTarget.dataset.index]
        let pageUrl = '../movie-detail/movie-detail?'
        pageUrl += utils.createMovieParam(movie)

        wx.navigateTo({
            url: pageUrl
        })
    }
})