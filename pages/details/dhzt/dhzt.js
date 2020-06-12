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
    imgUrls: getApp().globalData.imgUrls,
    currentPage: 1,//请求数据的页码
    size: 10,//每页数据条数
    totalCount: 0,//总是数据条数
    pagecount: 0,//总的页数
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
    var that=this;
    var session = wx.getStorageSync('session')
    console.log(session)
    if(session==''){
      wx.showModal({
        title: '提示',
        content: '用户未登录',
        confirmText:'去登陆',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1  // 返回上一级页面。
            })
          }
        }
      })   
    }else{
      wx.getSetting({
        success: (res) => {
  
          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
            wx.showModal({
              title: '是否授权当前位置',
              content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
              success: function (res) {
  
                if (res.cancel) {
                  wx.showToast({
                    title: '拒绝授权',
                    icon: 'none',
                    duration: 1000
                  })
  
                } else if (res.confirm) {
  
                  wx.openSetting({
                    success: function (data) {
  
                      if (data.authSetting["scope.userLocation"] == true) {
  
                        that.locations();
  
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 5000
                        })
                        //再次授权，调用getLocationt的API
  
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'success',
                          duration: 5000
                        })
                      }
                    }
                  })
                }
              }
            })
          } else if (res.authSetting['scope.userLocation'] == undefined || res.authSetting['scope.userLocation'] == true) { //初始化进入
  
            that.locations();
  
          }
        }
      })
      that.list()//列表
      // that.query()
    }
    var headInfo = wx.getStorageSync('headInfo')
    that.setData({
      defaultztd:headInfo,
      shopName:headInfo.shopName,
      address:headInfo.province+headInfo.city+headInfo.area+headInfo.street+headInfo.address
    })
  },
// 定位授权
locations: function () {
  let that = this;
  //1、获取当前位置坐标
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      that.setData({
        latitude: res.latitude,
        longitude: res.longitude
      })

      wx.setStorage({
        key: "latitude",
        data: res.latitude
      });
      wx.setStorage({
        key: "longitude",
        data: res.longitude
      });
      that.list()
     

    }
  })
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
  var myLat = wx.getStorageSync('latitude');
  var myLng = wx.getStorageSync('longitude');
  var className=that.data.className
  var params = {
    url: '/app/head/listHeadInfo',
    method: 'POST',
    data: {
      'pageIndex':that.data.currentPage,
      'pageSize':that.data.size,
      'searchName':className,
        myLat:myLat,
        myLng:myLng,
    },
    sCallBack: function (data) {   
      var temlist = that.data.list; //原始的数据集合
      
     var currentPage = that.data.currentPage; //获取当前页码
     if (currentPage == 1) {
         temlist = data.data.result.datas; //初始化数据列表
         currentPage = 1;
     }
     else {
         temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
         
       }
       console.log(temlist)
       temlist.forEach( item =>{
         console.log(item.distance.toString().substr(-1))
         if(item.distance.toString().substr(-1)=='m'){
          if (item.distance<1){
            item.distance2 = item.distance * 1000
            item.distance = item.distance2.toFixed(2)
          }else{
            item.distance = item.distance
          }
         }else{
            if (item.distance<1){
          item.distance2 = item.distance * 1000
          item.distance = item.distance2.toFixed(0)+'m'
        }else{
          item.distance = item.distance+'km'
        }
         }
        console.log(typeof(item.distance))
       
      })
      
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
      list.forEach( item =>{
        if (item.distance<1){
          item.distance2 = item.distance * 1000
          item.distance = item.distance2.toFixed(0)+'m'
        }else{
          item.distance = item.distance+'km'
        }
       
      })
      if(list.length==0){
        that.default()
      }
      var address=list[0].province+list[0].city+list[0].area+list[0].street+list[0].address
      that.setData({
       list:list,
      //  shopName:list[0].shopName,
      //  address:address,
      //  name:list[0].headName,
      //  phone:list[0].phone
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
  console.log(e)
  var that=this;
  var dpmc=e.currentTarget.dataset.item
  wx.showModal({
    title: '提示',
    content: '确定将'+dpmc.shopName+'设为新的自提点吗?',
    success (res) {
      if (res.confirm) {
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
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 1000);
          },
          eCallBack: function () {
          }
        }
        base.request(params);
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
  
  
},
// 查询用户切换店铺
query(){
  var that=this;
  var userId = wx.getStorageSync('userId')
  var headInfo = wx.getStorageSync('headInfo')
  var params = {
    url: '/app/user/findUserHeadInfo',
    method: 'POST',
    data: {
      userInfo:{'id':userId}
    },
    sCallBack: function (data) {
      that.setData({
        defaultztd:headInfo,
        shopName:headInfo.shopName,
        address:headInfo.province+headInfo.city+headInfo.area+headInfo.street+headInfo.address
      })
      wx.setStorage({
        key: 'headInfo',
        data: data.data.result.headInfo
      })
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
})