// pages/main-page/main-page.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
//const utils = require('../../utils/util')

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
  onLoad: function (options) {
    //获取影评，在获取对应的热门电影
    qcloud.request({
      url: config.service.allReviewsUrl,
      success: result => {
        const reviewList = result.data.data
        const review = reviewList[Math.floor(Math.random() * reviewList.length)]
        this.getMovie(review.movieId)

        this.setData({
          review
        })
      },
      fail: result => {
        wx.showModal({ title: '返回错误', content: '请求失败', showCancel: false });
      }
    })
  },

  getMovie: function (movieId) {
    qcloud.request({
      url: config.service.movie + movieId,
      success: result => {
        const movie = result.data.data[0]

        this.setData({
          movie
        })
      },
      fail: result => {
        wx.showModal({ title: '返回错误', content: '请求失败', showCancel: false });
      }
    })
  },

  posterClick: function (e) {
    const _this = this
    const movie = _this.data.movie
    let pageUrl = '../movie-detail/movie-detail?'
    pageUrl += utils.createMovieParam(movie)

    wx.navigateTo({
      url: pageUrl
    })
  },

  hotBtnClick: function (e) {
    wx.navigateTo({
      url: '../movie-hot-list/movie-hot-list'
    })
  },

  mineBtnClick: function (e) {
    wx.navigateTo({
      url: '../review-mine/review-mine'
    })
  },

  personClick: function (e) {
    const _this = this
    let pageUrl = '../review-detail/review-detail?'
    pageUrl += utils.createReviewParam(_this.data.review)
    pageUrl += utils.createMovieParam(_this.data.movie)

    wx.navigateTo({
      url: pageUrl
    })
  }
})