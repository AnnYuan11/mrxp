// pages/details/tzsq/tzsq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.color,
    multiArray: [],
    multiIndex: [0, 0, 0, 0],
    chinaData: [],
    address:'请填写地址'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getSiteData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
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
  bindMultiPickerChange: function(e) {
    console.log(e);
  },
  bindMultiPickerColumnChange: function(e) {
    var move = e.detail;
    var index = move.column;
    var value = move.value;
    if (index == 0) {
      this.setData({
        multiIndex: [value,0,0,0]
      })
      this.getCity();
    }
    if (index == 1) {
      this.setData({
        "multiIndex[1]": value,
        "multiIndex[2]": 0,
        "multiIndex[3]": 0
      })
      this.getXian();
    }
    if (index == 2) {
      this.setData({
        "multiIndex[2]": value,
        "multiIndex[3]": 0,
 
      })
      this.getZhen();
    }
    if (index == 3) {
      this.setData({
        "multiIndex[3]": value
      })
      this.getZhen();
    }
  },
  getSiteData: function() {
    var that = this;
    wx.request({
      url: 'http://139.155.113.100:8585/upload/city.json',
      success: res=> {
        console.log(res);
        var chinaData = res.data;
        this.data.chinaData = chinaData;
        var sheng = []; //  设置省数组
        for(var i = 0; i < chinaData.length; i++) {
          sheng.push(chinaData[i].name);
        }
        this.setData({
          "multiArray[0]": sheng
        })
        that.getCity(); // 得到市
      }
    })
  },
  getCity: function() { //  得到市
    var shengNum = this.data.multiIndex[0];
    var chinaData = this.data.chinaData;
    var cityData = chinaData[shengNum].children;
    var city = [];
    for (var i = 0; i < cityData.length; i++) {
      city.push(cityData[i].name)
    }
    this.setData({
      "multiArray[1]": city
    })
    this.getXian();
  },
  getXian: function(e) { //  得到县
    var shengNum = this.data.multiIndex[0];
    var cityNum = this.data.multiIndex[1];
    var chinaData = this.data.chinaData;
    var xianData = chinaData[shengNum].children[cityNum].children;
    var xian = [];
    for (var i = 0; i < xianData.length; i++) {
      xian.push(xianData[i].name)
    }
    this.setData({
      "multiArray[2]": xian
    })
    this.getZhen();
  },
  getZhen: function() { //  得到镇
    var shengNum = this.data.multiIndex[0];
    var cityNum = this.data.multiIndex[1];
    var xianNum = this.data.multiIndex[2];
    var chinaData = this.data.chinaData;
    var zhenData = chinaData[shengNum].children[cityNum].children[xianNum].children;
    var zhen = [];
    for (var i = 0; i < zhenData.length; i++) {
      zhen.push(zhenData[i].name)
    }
    this.setData({
      "multiArray[3]" : zhen
    })
  },
  getCenterLocation: function () {
    var that=this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          'address': res.address,
        })
        
      }
    })
  },

})