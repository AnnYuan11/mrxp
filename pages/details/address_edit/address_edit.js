// pages/details/address_edit/address_edit.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
var app = getApp();
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    multiIndex: [0, 0, 0, 0],
    chinaData: [],
    color: getApp().globalData.color,
    imgUrl:getApp().globalData.imgUrl,
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      addressid:options.id,
      isDefault:options.isDefault
    })
    that.getSiteData();
    console.log(options)
    that.showAddress()
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
  bindMultiPickerChange: function(e) {
    console.log(e)
    var that=this;
    that.setData({
      address_dz:true
    })
    var province= e.detail.value[0]
    var city= e.detail.value[1]
    var county= e.detail.value[2]
    var village= e.detail.value[3]
    that.setData({
      province:that.data.multiArray[0][province],
      city:that.data.multiArray[1][city],
      area:that.data.multiArray[2][county],
      street:that.data.multiArray[3][village]
    })
    console.log(that.data.multiArray[0][province])
    console.log(that.data.multiArray[1][city])
    console.log(that.data.multiArray[2][county])
    console.log(that.data.multiArray[3][village])
    
  },
  bindMultiPickerColumnChange: function(e) {
    console.log(e)
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
        var qxz={'name':"请选择",'children':[{'name':'','children':[{'name':'','children':[{'name':''}]}]}]}
        chinaData.unshift(qxz)
        console.log(chinaData)
        this.data.chinaData = chinaData;
        var sheng = []; //  设置省数组
        for(var i = 0; i < chinaData.length; i++) {
          sheng.push(chinaData[i].name);
        }
        this.setData({
          "multiArray[0]": sheng
        })
        console.log(that.data.multiArray[0][0])
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
  // 提交接口
  sub(e){
    console.log(e)
    console.log(e)
    var id = wx.getStorageSync('userId')
    var that=this;
    if(that.data.address_dz==false){
      that.setData({
        province:that.data.lists.province,
        city:that.data.lists.city,
        area:that.data.lists.area,
        street:that.data.lists.street
      })
    }
    if(e.detail.value.address==''){
      wx.showToast({
        title: '请填写详细地址',
        icon:'none',
        duration:3000
      })
      return;
    }
    if(e.detail.value.name==""){
      wx.showToast({
        title: '请填写姓名',
        icon:'none',
        duration:3000
      })
      return;
    }
    if(e.detail.value.phone==""){
      wx.showToast({
        title: '请填写手机号',
        icon:'none',
        duration:3000
      })
      return;
    }
    var params = {
      url: '/app/user/addUserAddressInfo',
      method: 'POST',
      data: {
        'province':that.data.province,
        'city':that.data.city,
        'area':that.data.area,
        'street':that.data.street,
        'address':e.detail.value.address,
        'name':e.detail.value.name,
        'phone':e.detail.value.phone,
        'id':that.data.addressid,
        'isDefault':that.data.isDefault,
        userInfo:{'id':id}
      },
      sCallBack: function (data) {
        wx.showToast({
          title: data.data.result
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },2000)
         
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 回显
  showAddress(){
    var that=this;
    var params = {
      url: '//app/user/findUserAddressInfo',
      method: 'GET',
      data: {
        'id':that.data.addressid
      },
      sCallBack: function (data) {
       that.setData({
        lists: data.data.result,
        address_dz:false
       })
          
        
         
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  }
})