// pages/details/sppj/sppj.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgArr: [],
    color: getApp().globalData.color,
    imgUrl:getApp().globalData.imgUrl,
    imgUrls: getApp().globalData.imgUrls,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 上传图片
  addImg: function () {
    var that = this;
    var imgArr = that.data.imgArr;
    wx.chooseImage({
        count: 9 - imgArr.length, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'],
        success: function (res) {
            var tempFilePaths = res.tempFilePaths
            var imgsrc = res.tempFilePaths;
            imgArr = imgArr.concat(imgsrc);
            that.setData({
                imgArr: imgArr
            });
            console.log(that.data.imgArr)
        }
    })
},
// 提交时调用
upload: function () {
  var that = this;
  var arg = {
      bizId: that.data.uuid,
      bizCode: '02',
      type: '01'
  };
  for (var i = 0; i < that.data.imgArr.length; i++) {
      var filePath = that.data.imgArr[i];
      wx.uploadFile({
          url: url + '/sysFileRelation/upload',
          filePath: filePath,
          name: 'file',
          formData: arg,
          header: { Cookie: that.data.loginData },
          success: function (res) {
              console.log(res);
              var data = res.data
              var datas = JSON.parse(data)
              console.log(datas)
              that.setData({
                  relationId: datas.relationId
              })
          }
      })
  }
},
// 预览照片 
previewImg: function (e) {
  var that = this;
  var index = e.currentTarget.dataset.index;

  wx.previewImage({
      current: that.data.imgArr[index], // 当前显示图片的http链接
      urls: that.data.imgArr // 需要预览的图片http链接列表
  })
  console.log(e.currentTarget.dataset)
},
// 删除图片
deleteImg: function (e) {
  console.log(e)
  var that = this;
  console.log(that.data.imgArr)
  var imgs = this.data.imgArr;
  var index = e.currentTarget.dataset.index;
  var relationIds = this.data.relationId
  imgs.splice(index, 1);
  console.log(relationIds)

  this.setData({
      imgArr: imgs
  });
  // var params = {
  //     url: '/sysFileRelation/deleteFile',
  //     method: 'POST',
  //     data: {
  //         relationId: relationIds
  //     },
  //     sCallBack: function (data) {
  //         console.log(data)
  //         wx.showToast({
  //             title: '删除成功',
  //             icon: 'success',
  //             duration: 1500
  //         });
  //     },
  //     eCallBack: function () {
  //     }
  // }
  base.request(params);
},
})