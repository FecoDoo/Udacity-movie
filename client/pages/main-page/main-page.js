// pages/main-page/main-page.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const utils = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        movie: {},
        review: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //获取影评，在获取对应的热门电影
        qcloud.request({
            url: config.service.allReviewsUrl,
            success: res => {
                const reviewList = res.data.data
                const review = reviewList[Math.floor(Math.random() * reviewList.length)]
                this.getMovie(review.movie_id)

                this.setData({
                    review
                })
            },
            fail: res => {
                wx.showModal({
                    title: '返回错误',
                    content: res,
                    showCancel: false
                });
            }
        })
    },

    getMovie: function(movie_id) {
        qcloud.request({
            url: config.service.movie + movie_id,
            success: res => {
                const movie = res.data.data[0]

                this.setData({
                    movie
                })
            },
            fail: res => {
                wx.showModal({
                    title: '返回错误',
                    content: res,
                    showCancel: false
                });
            }
        })
    },

    posterClick: function(e) {
        const movie = this.data.movie
        let pageUrl = '../movie-detail/movie-detail?'
        pageUrl += utils.createMovieParam(movie)

        wx.navigateTo({
            url: pageUrl
        })
    },

    hotBtnClick: function(e) {
        wx.navigateTo({
            url: '../movie-hot-list/movie-hot-list'
        })
    },

    mineBtnClick: function(e) {
        wx.navigateTo({
            url: '../review-mine/review-mine'
        })
    },

    personClick: function(e) {
        let pageUrl = '../review-detail/review-detail?'
        pageUrl += utils.createReviewParam(this.data.review)
        pageUrl += utils.createMovieParam(this.data.movie)

        wx.navigateTo({
            url: pageUrl
        })
    }
})