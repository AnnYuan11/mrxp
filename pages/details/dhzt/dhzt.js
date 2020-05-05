// pages/dhzt/dhzt.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.color,
    col:0,
    defaultztd:'',
    imgUrl:getApp().globalData.imgUrl,
    currentPage: 1,//请求数据的页码
    size: 10,//每页数据条数
    totalCount: 0,//总是数据条数
    pagecount: 0,//总的页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.list()//列表
    var aa=wx.getStorageSync('aa')
    console.log(aa)
    if(aa=='0'){
      that.query()//查询用户切换店铺
    }else {
      return
    }
    // that.query()//查询切换点
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
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.search();
    } else {
      //没有更多数据
     app.nomore_showToast();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  con(e){
    console.log(e)
    var className=e.detail.value
    this.setData({
      className:className,
     currentPage:1
    })
  },
//  搜索
search(e){
  console.log(e)
  var that=this;
  var className=that.data.className
  var params = {
    url: '/app/head/listHeadInfo',
    method: 'POST',
    data: {
      'pageIndex':that.data.currentPage,
      'pageSize':that.data.size,
      'searchName':className
    },
    sCallBack: function (data) {
      var yhqlist=data.data.result.datas;    
      var temlist = that.data.list; //原始的数据集合
     var currentPage = that.data.currentPage; //获取当前页码
     if (currentPage == 1) {
         temlist = data.data.result.datas; //初始化数据列表
         currentPage = 1;
     }
     else {
         temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
         
       }
       that.setData({
         currentPage: currentPage,
         list: temlist,
         totalCount: data.data.result.rowCount, //总的数据条数
         pagecount: data.data.result.totalPages //总页数
       })
       console.log(that.data.pagecount)         
   },
    eCallBack: function () {
    }
  }
  base.request(params);
},
  
 // 自提点列表
list(){
  var that = this;
  var myLat = wx.getStorageSync('latitude');
  var myLng = wx.getStorageSync('longitude');
  console.log(myLat)
  var params = {
    url: '/app/head/findAllHeadInfoByDistance',
    method: 'POST',
    data: {
      myLat:myLat,
      myLng:myLng,
      'pageIndex':1,
      'pageSize':10,
    },
    sCallBack: function (data) {
      var list= data.data.result.datas;
      if(list.length==0){
        that.default()
      }
      var address=list[0].province+list[0].city+list[0].area+list[0].street+list[0].address
      that.setData({
       list:list,
       shopName:list[0].shopName,
       address:address,
       name:list[0].headName,
       phone:list[0].phone
      })
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 默认自提点
default(){
  var that=this;
  var params = {
    url: '/app/head/findHeadInfoProperty',
    method: 'GET',
    data: {
     
    },
    sCallBack: function (data) {
      var list= data.data.result;
      var address=list.province+list.city+list.area+list.street+list.address
      that.setData({
        shopName:list.shopName,
        address:address,
        name:list.headName,
        phone:list.phone
      })
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 切换自提点
change(e){
  var that=this;
  var userId = wx.getStorageSync('userId')
  console.log(userId)
  wx.setStorage({
    data: 0,
    key: 'aa',
  })
  var params = {
    url: '/app/user/addUserHeadInfo',
    method: 'POST',
    data: {
      userInfo:{'id':userId},
      headInfo:{'id':e.currentTarget.dataset.item.id}
    },
    sCallBack: function (data) {
      that.query()
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 查询用户切换店铺
query(){
  var that=this;
  var userId = wx.getStorageSync('userId')
  var params = {
    url: '/app/user/findUserHeadInfo',
    method: 'POST',
    data: {
      userInfo:{'id':userId}
    },
    sCallBack: function (data) {
      that.setData({
        defaultztd:data.data.result,
        
      })
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 拨打电话
phone(e){
  console.log(e)
  var that=this;
  wx.makePhoneCall({
    phoneNumber: e.currentTarget.dataset.phone
  })
}
})