// pages/review-edit/review-edit.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const utils = require('../../utils/util.js')

//录音设置
const recorderManager = wx.getRecorderManager()
const recordeOptions = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEditText: false,
    isFinished: false,
    recording: false,
    userInfo: null,
    tempFilePath: '',
    inputText: '',
    duration: '',
    movie: {}
  },

  onLoad: function (options) {
    const movie = utils.getMovieOpt(options)

    this.setData({
      isEditText: options.editType=='文字',
      movie
    })

    //检查之前是否授权登陆过
    getApp().checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo
        })
      },
      error: () => { }
    })

    recorderManager.onStart(() => {
      console.log('recorder start')
      this.setData({
        recording: true
      })
    })

    recorderManager.onStop((res) => {
      console.log('recorder finished')
      const { tempFilePath } = res
      let duration = Math.round(res.duration/1000)

      this.setData({
        isFinished: true,
        recording: false,
        tempFilePath,
        duration
      })
    })
  },

  onInput: function(e) {
    this.setData({
      inputText: e.detail.value.trim()
    })
  },

  onTapRecord: function (e) {
    recorderManager.start(recordeOptions)
  },

  onTapStop: function(e) {
    recorderManager.stop()
  },

  onTapLogin: function (e) {
    qcloud.setLoginUrl(config.service.loginUrl)

    getApp().doQcloudLogin({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },

  createReviewData: function() {
    const _this = this
    const review = {
      movieId: _this.data.movie.id,
      imageUrl: _this.data.userInfo.avatarUrl,
      name: _this.data.userInfo.nickName,
      dataType: _this.data.isEditText? '文字' : '语音',
      text: _this.data.inputText,
      voiceUrl: _this.data.tempFilePath,
      userId: _this.data.userInfo.openId,
      duration: _this.data.duration
    }
    return review
  },

  isDataEmpty() {
    const _this = this;
    if(!_this.data.isEditText && _this.data.tempFilePath!='') {
      return false
    } else if (_this.data.isEditText && _this.data.inputText!='') {
      return false
    } else {
      return true
    }
  },

  finBtnClick: function (e) {
    const _this = this

    if (_this.isDataEmpty()) {
      wx.showToast({ title: '请先记录评论', icon: 'none',  duration: 2000 });
      return
    }

    let pageUrl = '../review-preview/review-preview?'
    pageUrl += utils.createReviewParam(_this.createReviewData())
    pageUrl += utils.createMovieParam(_this.data.movie)
    console.log(pageUrl)

    wx.navigateTo({
      url: pageUrl
    })
  }
})