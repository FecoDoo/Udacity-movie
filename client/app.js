//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
let userInfo
let openId
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

App({
	onLaunch: function() {
		qcloud.setLoginUrl(config.service.loginUrl)
	},
	data: {
		loginType: UNPROMPTED,
	},

	checkSession({ success, error }) {
		if (userInfo) {
			return success && success({
				userInfo,openId
			})
		}
		wx.checkSession({
			success: () => {
				this.getUserInfo({
					success: res => {
						userInfo = res.userInfo

						success && success({
							userInfo
						})
					},
					fail: () => {
						error && error()
					}
				})
			},
			fail: () => {
				error && error()
			}
		})
	},

	getUserInfo({ success, error }) {
		if (userInfo) return userInfo
		qcloud.request({
			url: config.service.user,
			login: true,
			success: result => {
				let data = result.data
				if (!data.code) {
					userInfo = data.data
					
					success && success({
						userInfo
					})
				} else {
					error && error()
				}
			},
			fail: () => {
				error && error()
			}
		})
	},

	login({ success, error }) {
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo'] === false) {
					this.loginType=UNAUTHORIZED
					// 已拒绝授权
					wx.showModal({
						title: '提示',
						content: '请授权我们获取您的用户信息',
						showCancel: false,
						success: () => {
							wx.openSetting({
								success: res => {
									if (res.authSetting['scope.userInfo'] === true){
										this.doQcloudLogin({ success, error })
									}
								}
							})
						}
					})
					error && error()
				} else {
					this.loginType=AUTHORIZED
					this.doQcloudLogin({ success, error })
				}
			}
		})
	},

	doQcloudLogin({ success, error }) {
		// 调用 qcloud 登陆接口
		qcloud.login({
			success: result => {
				if (result) {
					userInfo = result
					success && success({
						userInfo
					})
          console.log("First time login")
				} else {
					// 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
					this.getUserInfo({ success, error })
				}
				console.log(userInfo)
			},
			fail: () => {
				error && error()
			}
		})
	},
})