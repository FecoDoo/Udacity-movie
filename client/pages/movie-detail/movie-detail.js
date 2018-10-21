const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const movie = options;
    this.setData({
      movie
    })
  },

  viewBtnClick: function(e) {
    const _this = this
    let pageUrl = `../review-list/review-list?`
    pageUrl += utils.createMovieParam(_this.data.movie)

    wx.navigateTo({
      url: pageUrl
    })
  }, 

  addBtnClick: function(e) {
    const _this = this
    let pageUrl = `../review-edit/review-edit?`
    pageUrl += utils.createMovieParam(_this.data.movie)

    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: function(res) {
        if(res.tapIndex == 0) {
          wx.navigateTo({
            url: pageUrl + 'editType=文字'
          })
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: pageUrl + 'editType=语音'
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }

})