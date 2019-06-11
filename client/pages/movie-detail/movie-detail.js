const utils = require('../../utils/util.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		movie: {},
		isReviewed: 0,
		userInfo: null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		const movie = options;
		this.setData({
			movie
		})
	},
	onShow: function() {
		app.checkSession({
		success: ({ userInfo }) => {
			this.setData({
				userInfo
			})	
		},
		fail: res => {
			console.log(res)
		}
	  })
	},
	onReady: function() {
		if (this.data.userInfo == null) {
			wx.redirectTo({
				url: '../review-mine/review-mine?',
			})
		}
	},
	getView: function(e) {
		let pageUrl = `../review-list/review-list?`
		pageUrl += utils.createMovieParam(this.data.movie)

		wx.navigateTo({
			url: pageUrl
		})
	},

	onPullDownRefresh: function () {
	  
	},

	addView: function(e) {
	  var _this = this
	  console.log(_this.data)
	  wx.request({
		url: config.service.addReviewsUrl + _this.data.movie.id,
		success: res => {
		  let pageUrl = `../review-edit/review-edit?`
		  pageUrl += utils.createMovieParam(this.data.movie)

		  wx.showActionSheet({
			itemList: ['文字', '音频'],
			success: function (res) {
			  if (res.tapIndex == 0) {
				wx.navigateTo({
				  url: pageUrl + 'editType=0'
				})
			  } else if (res.tapIndex == 1) {
				wx.navigateTo({
				  url: pageUrl + 'editType=1'
				})
			  }
			},
			fail: function (res) {
			  console.log(res.errMsg)
			}
		  })
		},
		fail: res => {
		  wx.showModal({
			title: '错误',
			content: '服务器交互错误',
		  })
		}
	  })
	},
	navigateToMine: function (e) {
		wx.navigateTo({
			url: '../review-mine/review-mine'
		})
	}
})