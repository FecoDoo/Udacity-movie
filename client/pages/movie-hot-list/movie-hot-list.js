//index.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const utils = require('../../utils/util')


Page({
  data: {
    isLoading: false,
    moviesList: [],
    errorMsg: '',
  },

  onLoad: function(options) {
    qcloud.request({
      url: config.service.hotMoviesUrl,
      success: result => {
        this.setData({
          moviesList: result.data.data
        })
      },
      fail: result => {
        wx.showModal({ title: '返回错误', content: '请求失败', showCancel: false });
      }
    })
  },

  listClick: function(e) {
    const _this = this
    const movie = _this.data.moviesList[e.currentTarget.dataset.index]
    let pageUrl = '../movie-detail/movie-detail?'
    pageUrl += utils.createMovieParam(movie)

    wx.navigateTo({
      url: pageUrl
    })
  }
})
