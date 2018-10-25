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
        userInfo: null,
        userID: ''
    },

    onLoad: function(options) {
        //检查之前是否授权登陆过
        getApp().checkSession({
            success: ({
                userInfo
            }) => {
                this.setData({
                    userInfo: userInfo
                })

                //this.getAllFavour()
            },
            error: () => {}
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
                wx.showModal({
                    title: '返回错误',
                    content: '请求失败',
                    showCancel: false
                });
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
            success: function(res) {
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

        console.log(e.detail.userInfo)
        wx.login({
            success: res => {
                console.log(res)
                this.setData({
                    userID: res.code
                })
            },
            fail: res => {
                wx.showModal({
                    title: '返回错误',
                    content: res,
                    showCancel: false
                });
            }
        })
    },

    backHomeClick: function(e) {
        wx.navigateBack({
            delta: getCurrentPages()
        })
    }

})