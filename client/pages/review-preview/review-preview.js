// pages/review-preview/review-preview.js
//index.js
var COS = require('../../lib/cos-wx-sdk-v5')
const qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
const appConfig = require('../../config')
const utils = require('../../utils/util')

var cos = new COS({
  getAuthorization: function (params, callback) {//获取签名 必填参数
    // 方法二（适用于前端调试）
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    review: {}
  },


  onLoad: function (options) {
    const movie = utils.getMovieOpt(options)
    const review = utils.getReviewOpt(options)

    this.setData({
      movie,
      review
    })

    var filePath = this.data.review.voiceUrl
    console.log(filePath)

    //创建 ctx for 播放器
    this.innerAudioCTX = wx.createInnerAudioContext()
  },

  reEditBtnClick: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

  requestCallback: function (err, data) {
    console.log(err || data);
    if (err && err.error) {
      wx.showModal({ title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
    } else if (err) {
      wx.showModal({ title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
    } else {
      this.uploadReview(this.data.review)
    }
  },

  sendReviewBtnClick: function () {;

    if(this.data.review.dataType == '语音') {
      this.uploadVoice()
    } else {
      this.uploadReview(this.data.review)
    }
  },

  uploadVoice: function() {;

    var filePath = this.data.review.voiceUrl
    var Key = utils.getFileName(filePath) // 这里指定上传的文件名

    cos.postObject({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: Key,
      FilePath: filePath,
      onProgress: function (info) {
        console.log(JSON.stringify(info));
      }
    }, this.requestCallback);
  },

  uploadReview: function(review) {

    const uReview = review;
    uReview.voiceUrl = utils.getFileName(review.voiceUrl)

    qcloud.request({
      url: appConfig.service.addReviewsUrl,
      method: 'POST',
      data: review,
      success: result => {
        wx.showToast({ title: '上传评论成功', icon: 'success', duration: 3000 });

        let pageUrl = `../review-list/review-list?`
        pageUrl += utils.createMovieParam(this.data.movie)

        wx.navigateTo({
          url: pageUrl
        })
      },
      fail: result => {
        console.log(result)
      }
    })
  },

  onTapVoice: function (e) {
    //播放音乐
    this.innerAudioCTX.src = this.data.review.voiceUrl
    this.innerAudioCTX.play()
  }

  // sendReviewBtnClick: function (e) {
  // }
})