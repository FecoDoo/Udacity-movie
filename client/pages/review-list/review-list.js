// pages/review-list.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const utils = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        reviewList: [],
        movie: {}
    },

    onLoad: function(options) {
        var _this = this
		const movie = utils.getMovieOpt(options)

		_this.setData({
            movie
        })
        qcloud.request({
			
            url: config.service.reviewsUrl + movie.id,
            success: result => {
				this.setData({
					reviewList: result.data.data
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

    backHomeClick: function(e) {
        wx.navigateBack({
            delta: 5
        })
    },

    listClick: function(e) {
        var _this = this
		const review = this.data.reviewList[e.currentTarget.dataset.index]
		let pageUrl = '../review-detail/review-detail?'
        pageUrl += utils.createReviewParam(review)
        pageUrl += utils.createMovieParam(_this.data.movie)
        wx.navigateTo({
            url: pageUrl
        })
    }
})