//app.js
App({
  globalData: {
    imgUrl: "http://139.155.113.100:8686/",
    color: '#E10004',
  },
  onLaunch (options) {
    this.getOpenId()
  },
     //获取openID
getOpenId: function () {
  var that = this;
  wx.login({
      success: function (res) {
          console.log(res)
          if (res.code) {
              // 发起网络请求
              wx.request({
                  url: 'http://139.155.113.100:8085/app/getOpenId?code=' + res.code,
                  success: function (data) {
                      console.log(data);
                      wx.setStorage({
                          key:"sessionId",
                          data:data.data.result.sessionKey
                        });
                      wx.setStorage({
                          key:"openId",
                          data:data.data.result.openId
                      });
                  },
                  fail: function (data) {
                      console.log(data);
                  }
              })
          }
      }
  })
},
})