//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var cacheUserInfo

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },

    checkSession({ success, error }) {
      //已经有缓存，直接返回
      if (cacheUserInfo) {
        success && success({
           userInfo: cacheUserInfo
        }) 
        return
      }

      wx.checkSession({
        success: () => {
          this.getUserInfo({ success, error })
        },
        fail: () => {
          error && error()
        }
      })
    },

    doQcloudLogin({ success, error }) {
      qcloud.login({
        success: result => {
          if (result) {
            let userInfo= result
            cacheUserInfo = userInfo //缓存
            success && success({
              userInfo
            })
          }
        },
        fail: result => {
          //如果不是首次登陆，是不会返回用户数据，所以要进行请求
          this.getUserInfo({success, error})
        }
      })
    },

    getUserInfo({ success, error }) {

      //已经有缓存，直接返回
      if (cacheUserInfo) {
        success && success({
           userInfo: cacheUserInfo
        }) 
        return
      }

      qcloud.request({
        url: config.service.requestUrl,
        login:true,
        success: result => {
          let data = result.data

          if (!data.code) {
            let userInfo= data.data

            cacheUserInfo = userInfo //缓存
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
    }
})