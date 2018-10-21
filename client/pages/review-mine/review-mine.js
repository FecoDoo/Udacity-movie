// pages/review-mine/review-mine.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listname: "收藏的影评",
    favourList: [],
    userInfo: null
  },

  onLoad: function(options) {
    // //检查之前是否授权登陆过
    // getApp().checkSession({
    //   success: ({userInfo})=> {
    //     this.setData({
    //       userInfo: userInfo
    //     })

    //     this.getAllFavour()
    //   },
    //   error: () => {}
    // })
    qcloud.login({
      fail: res=> {
        console.log(res)
      }
    })

  },

  getAllFavour: function() {
    qcloud.request({
      url: config.service.allFavourUrl,
      success: result => {
        this.setData({
          favourList: result.data.data,
          listname: "收藏的影评"
        })
      },
      fail: result => {
        wx.showModal({ title: '返回错误', content: '请求失败', showCancel: false });
      }
    })
  },

  listClick: function(e) {
    const _this = this
    const item = _this.data.favourList[e.currentTarget.dataset.index]
    let pageUrl = '../review-detail/review-detail?'
    pageUrl += utils.createReviewParam(item.review)
    pageUrl += utils.createMovieParam(item.movie)

    wx.navigateTo({
      url: pageUrl
    })
  },

  switchList: function() {
    const _this = this

    wx.showActionSheet({
      itemList: ['收藏的影评', '我发布的影评'],
      success: function (res) {
        if (res.tapIndex == 0) {
          _this.getAllFavour()
        } else if (res.tapIndex == 1) {
          _this.getAllMine()
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  getAllMine: function() {
    const _this = this

    qcloud.request({
      url: config.service.mineReviewsUrl,
      success: result => {
        this.setData({
          favourList: result.data.data,
          listname: "我发表的评论"
        })
      },
      fail: result => {
        wx.showModal({ title: '返回错误', content: '请求失败', showCancel: false });
      }
    })
  },

  onTapLogin: function(e) {
    // qcloud.setLoginUrl(config.service.loginUrl)

    // getApp().doQcloudLogin({
    //   success: ({userInfo}) => {
    //     this.setData({
    //       userInfo
    //     })
    //     console.log(userInfo)
    //   }
    // })
    console.log(e.detail.userInfo)
  },

  backHomeClick: function(e) {
    wx.navigateBack({
      delta: 5
    })
  }

})