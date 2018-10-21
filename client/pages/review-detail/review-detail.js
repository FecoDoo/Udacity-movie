// pages/review-detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    review: {},
    userInfo: null
  },
  onLoad: function (options) {
    //创建 ctx for 播放器
    this.innerAudioCTX = wx.createInnerAudioContext()

    const movie = utils.getMovieOpt(options)
    const review = utils.getReviewOpt(options)

    this.setData({
      movie,
      review
    })

    getApp().checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo
        })
      },
      error: () => { }
    })
  },

  favourReview: function (e) {
    const _this = this;

    //如果未登陆就跳转到登陆
    if (!_this.data.userInfo) {
      wx.navigateTo({
        url: '../review-mine/review-mine'
      })
    }

    qcloud.request({
      url: config.service.favourReviewUrl + _this.data.review.review_id,
      success: result => {
        wx.showToast({title: '收藏成功'})
      },
      fail: result => {
        wx.showModal({ title: '返回错误', content: '请求失败', showCancel: false });
      }
    })
  },

  writeReview: function (e) {
    const _this = this
    let pageUrl = `../review-edit/review-edit?`
    pageUrl += utils.createMovieParam(_this.data.movie)

    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: pageUrl + 'editType=文字'
          })
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: pageUrl + 'editType=语音'
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  onTapVoice: function() {
    const _this = this
    const url = config.service.mp3Host + _this.data.review.voiceUrl
    console.log(url)

    //播放音乐
    this.innerAudioCTX.src = url
    this.innerAudioCTX.play()
  }

})