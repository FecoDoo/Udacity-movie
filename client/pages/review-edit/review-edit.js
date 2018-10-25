// pages/review-edit/review-edit.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const utils = require('../../utils/util.js')
const app = getApp()
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

    onLoad: function(options) {
        const movie = utils.getMovieOpt(options)

        this.setData({
            isEditText: options.editType == '文字',
            movie
        })

        //检查之前是否授权登陆过
        app.checkSession({
            success: ({
                userInfo
            }) => {
                this.setData({
                    userInfo: userInfo
                })
            },
            error: () => {}
        })

        recorderManager.onStart(() => {
            console.log('recorder start')
            this.setData({
                recording: true
            })
        })

        recorderManager.onStop((res) => {
            console.log('recorder finished')
            const {
                tempFilePath
            } = res
            let duration = Math.round(res.duration / 1000)

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

    onTapRecord: function(e) {
        recorderManager.start(recordeOptions)
    },

    onTapStop: function(e) {
        recorderManager.stop()
    },

    onTapLogin: function(e) {
        this.setData({
            userInfo
        })
    },

    createReviewData: function() {
        const review = {
            movieId: this.data.movie.id,
            imageUrl: this.data.userInfo.avatarUrl,
            name: this.data.userInfo.nickName,
            dataType: this.data.isEditText ? '文字' : '语音',
            text: this.data.inputText,
            voiceUrl: this.data.tempFilePath,
            userId: this.data.userInfo.openId,
            duration: this.data.duration
        }
        return review
    },

    isDataEmpty() {;
        if (!this.data.isEditText && this.data.tempFilePath != '') {
            return false
        } else if (this.data.isEditText && this.data.inputText != '') {
            return false
        } else {
            return true
        }
    },

    finBtnClick: function(e) {

        if (this.isDataEmpty()) {
            wx.showToast({
                title: '请先记录评论',
                icon: 'none',
                duration: 2000
            });
            return
        }

        let pageUrl = '../review-preview/review-preview?'
        pageUrl += utils.createReviewParam(this.createReviewData())
        pageUrl += utils.createMovieParam(this.data.movie)
        console.log(pageUrl)

        wx.navigateTo({
            url: pageUrl
        })
    }
})