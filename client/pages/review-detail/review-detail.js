// pages/review-detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const utils = require('../../utils/util.js')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        movie: [],
        review: [],
        userInfo: null,
        ifExist: null
    },

    onLoad: function(options) {
        //创建 ctx for 播放器
        this.innerAudioCTX = wx.createInnerAudioContext()

        const movie = utils.getMovieOpt(options)
        const review = utils.getReviewOpt(options)

        this.setData({
            movie,
            review
        })

    },

    onShow: function() {
		var _this = this
		app.checkSession({
			success: ({
				userInfo
			}) => {
				_this.setData({
					userInfo: userInfo
				})
			},
			error: () => { }
		})
		this.checkIfExists()
    },
	
    checkIfExists: function() {
        var _this = this
		qcloud.request({
            url: config.service.favourReviewCheck + this.data.review.review_id + '&user_id=' + this.data.userInfo.openId,
            success: result => {
				var temp = 0
				if (result.data.data.length == 0){
					temp = 0
				} else {
					temp = 1
				}
				_this.setData({
					ifExist: temp
				})
            },
            fail: result => {
                wx.showModal({
                    title: '返回错误',
                    content: '请求失败',
                    showCancel: false
                });
                console.log(result)
            }
        })
    },

    favourReview: function(e) {
		var _this = this
		console.log(this.data.ifExist)
		if (this.data.ifExist === 0 ){
			const id = _this.data.review.review_id
			qcloud.request({
				url: config.service.favourReviewUrl + id,
				success: result => {
					wx.showToast({
						title: '收藏成功'
					})
					_this.onShow()
				},
				fail: result => {
					wx.showModal({
						title: '返回错误',
						content: '',
						showCancel: false
					});
					console.log(result)
				}
			})
		} else {
			wx.showModal({
				title: '错误',
				content: '你已经收藏过该影评',
			})
		}
    },

    // writeReview: function(e) {
    //     let pageUrl = `../review-edit/review-edit?`
    //     pageUrl += utils.createMovieParam(this.data.movie)

    //     wx.showActionSheet({
    //         itemList: ['文字', '音频'],
    //         success: function(res) {
    //             if (res.tapIndex == 0) {
    //                 wx.navigateTo({
    //                     url: pageUrl + 'editType=0'
    //                 })
    //             } else if (res.tapIndex == 1) {
    //                 wx.navigateTo({
    //                     url: pageUrl + 'editType=1'
    //                 })
    //             }
    //         },
    //         fail: function(res) {
    //             console.log(res.errMsg)
    //         }
    //     })
    // },

    onTapVoice: function() {
        const url = config.service.mp3Host + this.data.review.voiceUrl
        console.log('url:' + url)

        //播放音乐
        this.innerAudioCTX.src = url
        this.innerAudioCTX.play()
    },

    navigateToMine: function(e) {
        let pageUrl = '../review-mine/review-mine?'

        wx.navigateTo({
            url: pageUrl
        })
    }

})