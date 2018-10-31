// pages/review-mine/review-mine.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const utils = require('../../utils/util.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listname: "收藏的影评",
        favourList: [],
        userInfo: null,
        userID: '',
        loginType: app.data.loginType
    },

    onLoad: function(options) {
		
    },

    onShow: function() {
		var pages = getCurrentPages();
		var currPage = pages[pages.length - 1];   //当前页面
		var prevPage = pages[pages.length - 2];
		// 同步授权状态
		this.setData({
            loginType: app.data.loginType
        })

		app.checkSession({
			success: ({
				userInfo
			}) => {
				this.setData({
					userInfo: userInfo
				})
				prevPage.setData({
					userInfo:userInfo
				})
				this.getAllFavour()
			},
			error: () => {
				wx.showModal({
					title: '未登录',
					content: '请先登陆',
					showCancel: false
				});
			}
		})
    },

	onPullDownRefresh: function () {
		
	},

    getAllFavour: function() {
		qcloud.request({
            url: config.service.allFavourUrl,
            success: result => {
				this.setData({
                    favourList: result.data.data,
                    listname: "收藏的影评",
                })
				console.log(result)
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

    listClick: function(e) {

        const item = this.data.favourList[e.currentTarget.dataset.index]
        let pageUrl = '../review-detail/review-detail?'
        pageUrl += utils.createReviewParam(item.review)
        pageUrl += utils.createMovieParam(item.movie)

        wx.navigateTo({
            url: pageUrl
        })
    },

    switchList: function() {
        wx.showActionSheet({
            itemList: ['收藏的影评', '我发布的影评'],
            success: res => {
                if (res.tapIndex == 0) {
                    this.getAllFavour()
                } else if (res.tapIndex == 1) {
                    this.getAllMine()
                }
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
        })
    },

    getAllMine: function() {

        qcloud.request({
            url: config.service.mineReviewsUrl,
            success: result => {
                this.setData({
                    favourList: result.data.data,
                    listname: "我发表的评论"
                })
            },
            fail: result => {
                wx.showModal({
                    title: '返回错误',
                    content: '请求失败',
                    showCancel: false
                });
            }
        })
    },

    onTapLogin: function(e) {
        app.login({
            success: ({ userInfo }) => {
                this.setData({
                    userInfo
                })
            }
        })
		this.getAllFavour()
    },

    backHomeClick: function(e) {
        wx.navigateBack({
            delta: getCurrentPages()
        })
    },
})