// pages/index/index.js
import { Base } from "../../utils/request/base.js";
var app = getApp();
var base = new Base();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    duration: 500,
    currentTab: 0,
    show:true,//弹窗
    imgUrl:app.globalData.imgUrl,
    currentPage: 1,//请求数据的页码
    size: 2,//每页数据条数
    totalCount: 0,//总是数据条数
    pagecount: 0,//总的页数
    // aa:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // tabbar的显示隐藏
    if(that.data.show==true){
      wx.hideTabBar({
        animation: true,
      })
    }
   
    that.shopList()//今日售卖列表
    that.lunbo()//轮播图
    that.notice()//公告
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
     var that = this;
    
    wx.getSetting({
      success: (res) => {
        console.log(res);
        console.log(res.authSetting['scope.userLocation']);
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              console.log(res)
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })

              } else if (res.confirm) {
                // debugger
                wx.openSetting({
                  success: function (data) {
                    console.log(data);
                    if (data.authSetting["scope.userLocation"] == true) {
                      
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 5000
                      })
                      //再次授权，调用getLocationt的API
                      that.locations();
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
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          that.locations();
        }
      }
    })
    that.list()//团长地址
    var aa=wx.getStorageSync('aa')
    console.log(aa)
    if(aa=='0'){
      that.query()//查询用户切换店铺
    }else {
      return
    }
    // app.getOpenId()
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
    var that=this;
    wx.removeStorage('aa')
    that.setData({
      aa:1
    })
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
    this.bindscrolltolower()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  search: function (e) {
    var that=this;
    var className=e.detail.value
    that.shopList(className)
  },
  // 商品切换
  swichNav: function (e) {
    var that = this;
    console.log(e)
    if(e.target.dataset.current=='0'){
      that.data.currentPage=1,
      that.data.totalCount= 0,//总是数据条数
      that.data.pagecount= 0,//总的页数
       that.shopList()//已使用
     }
    else if(e.target.dataset.current=='1'){
     that.data.currentPage=1,
     that.data.totalCount= 0,//总是数据条数
     that.data.pagecount= 0,//总的页数
      that.shopListM()//已使用
    }
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
//  关闭弹窗
sure(){
  var that= this;
    that.setData({
      show:false
    })
    wx.showTabBar({
      animation: true,
    })
},
 // 获取日期
 getDateStr: function(today, addDayCount) {
  var date;
  var that=this;
  if(today) {
    date = new Date(today);
  }else{
    date = new Date();
  }
  date.setDate(date.getDate() + addDayCount);//获取AddDayCount天后的日期 
    var y = date.getFullYear();
    var m = date.getMonth() + 1;//获取当前月份的日期 
    var d = date.getDate();
    if(m < 10){
      m = '0' + m;
    };
    if(d < 10) {
      d = '0' + d;
    };
    var tomorow=m + "月" + d+"日";
    that.setData({
      tomorow:tomorow
    })
},
// 今日售卖列表
shopList(className){
  var that = this;
  var params = {
    url: '/app/commodity/listCommodityInfo',
    method: 'POST',
    data: {
      'commodityName':className,
      'pageIndex':that.data.currentPage,
      'pageSize':that.data.size,
    },
    sCallBack: function (data) {
      var listToday=data.data.result.datas
      listToday.forEach((item,index) =>{
        if(item.productInfo.sendType==1){
          item.productInfo.sendType="到店自提"
        }else{
          item.productInfo.sendType="快递到家"
        }
        if(item.productInfo.pickDate==1){
          that.getDateStr(null,0)
          item.productInfo.pickDate=that.data.tomorow
        }else if(item.productInfo.pickDate==2){
          that.getDateStr(null,1)
          var tomorow=that.data.tomorow
          item.productInfo.pickDate=tomorow
        }else{
          that.getDateStr(null,2)
          var ht=that.data.tomorow
          item.productInfo.pickDate=ht
        }
      })
      var temlist = that.data.listToday; //原始的数据集合
      var currentPage = that.data.currentPage; //获取当前页码
      if (currentPage == 1) {
          temlist = data.data.result.datas; //初始化数据列表
          currentPage = 1;
      }
      else {
          temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
          // currentPage = currentPage + 1;
        }
        that.setData({
          currentPage: currentPage,
          listToday: temlist,
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
// 今日售卖列表加载
bindscrolltolower(){
  var that = this;
    console.log(that.data.pageIndex)
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    var page = ++that.data.pageIndex;
    var base = new Base();
    var params = {
      url: '/app/commodity/listCommodityInfo',
      method: 'POST',
      data: {
        "pageIndex": page,
        "pageSize": that.data.pageSize,
      },
      sCallBack: function (res) {
        console.log(res);
        // 回调函数

        var moment_list = that.data.listToday;

        for (var i = 0; i < res.data.result.datas.length; i++) {
          moment_list.push(res.data.result.datas[i]);
        }
        // 设置数据
        that.setData({
          listToday: moment_list
        })
        // 隐藏加载框
        wx.hideLoading();
      },
      eCallBack: function () {

      }
    }
    base.request(params);
},
// 明日售卖
shopListM(className){
  var that = this;
  var params = {
    url: '/app/commodity/findProductListNextDay',
    method: 'POST',
    data: {
      'commodityName':className,
      'pageIndex':that.data.currentPage,
      'pageSize':that.data.size,
    },
    sCallBack: function (data) {
      var listTomorow=data.data.result.datas
      listTomorow.forEach((item,index) =>{
        if(item.productInfo.sendType==1){
          item.productInfo.sendType="到店自提"
        }else{
          item.productInfo.sendType="快递到家"
        }
        if(item.productInfo.pickDate==1){
          that.getDateStr(null,0)
          item.productInfo.pickDate=that.data.tomorow
        }else if(item.productInfo.pickDate==2){
          that.getDateStr(null,1)
          var tomorow=that.data.tomorow
          item.productInfo.pickDate=tomorow
        }else{
          that.getDateStr(null,2)
          var ht=that.data.tomorow
          item.productInfo.pickDate=ht
        }
      })
      var temlist = that.data.listTomorow; //原始的数据集合
      var currentPage = that.data.currentPage; //获取当前页码
      if (currentPage == 1) {
          temlist = data.data.result.datas; //初始化数据列表
          currentPage = 1;
      }
      else {
          temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
          // currentPage = currentPage + 1;
        }
        that.setData({
          currentPage: currentPage,
          listTomorow: temlist,
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




// 首页轮播图
lunbo(){
  var that = this;
  var params = {
    url: '/app/findAllBanner',
    method: 'GET',
    data: {
      
    },
    sCallBack: function (data) {
      that.setData({
        background:data.data.result
      })
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 首页公告
notice(){
  var that = this;
  var params = {
    url: '/app/information/listInformationInfo',
    method: 'POST',
    data: {
      'pageIndex':1,
      'pageSize':10
    },
    sCallBack: function (data) {
      that.setData({
        content:data.data.result.datas
      })
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 定位授权
locations: function () {
  let that = this;
  //1、获取当前位置坐标
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      console.log(res);
      that.setData({
        latitude:res.latitude,
        longitude:res.longitude
      })
     
      wx.setStorage({
        key:"latitude",
        data:res.latitude
      });
      wx.setStorage({
        key:"longitude",
        data:res.longitude
      });
      that.list()
    }
  })
},
// 选择团长
selectTZ(){
  wx.navigateTo({
    url: '/pages/details/dhzt/dhzt',
  })
},
// 查询用户切换店铺

query(){
  console.log('调用了自提')
  var that=this;
  var userId = wx.getStorageSync('userId')
  var params = {
    url: '/app/user/findUserHeadInfo',
    method: 'POST',
    data: {
      userInfo:{'id':userId}
    },
    sCallBack: function (data) {
      console.log(data.data.result)
      that.setData({
        defaultztd:data.data.result,
        shopName:data.data.result.headInfo.shopName
      })
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
  // 团长地址
  list(){
    console.log('调用了团长')
    var that = this;
    var myLat = wx.getStorageSync('latitude');
    var myLng = wx.getStorageSync('longitude');
    var params = {
      url: '/app/head/findAllHeadInfoByDistance',
      method: 'POST',
      data: {
        myLat:myLat,
        myLng:myLng
      },
      sCallBack: function (data) {
        var list= data.data.result;
        if(list.length==0){
          that.default()
        }
        that.setData({
         shopName:list[0].shopName,
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
        that.setData({
          shopName:list.shopName,
        })
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 加入购物车
  joinGwc(e){
    var that=this;
    console.log(e)
    var userId = wx.getStorageSync('userId')
    var spid=e.currentTarget.dataset.spid;
    var sendtype=e.currentTarget.dataset.sendtype
    if(sendtype=="到店自提"){
      sendtype=1
    }else{
      sendtype=2
    }
    var params = {
      url: '/app/commodity/addShoppingCartInfo',
      method: 'POST',
      data: {
       'commodityInfo':{
         'id':spid
       },
       'commodityNumber':'1',
       'shoppingCarType':sendtype,
       'userInfo':{
         'id':userId
       }
      },
      sCallBack: function (data) {
        if(data.data.errorCode=='0'){
          wx.showToast({
            title: data.data.result,
          })
          app.getShopNum()
        } else {
          wx.showToast({
            title: data.data.result,
          })
        }
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 今日售卖下拉加载
  bindscrolltolower: function () {
    console.log(this.data.currentPage+"....."+this.data.pagecount)
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.shopList();
    } else {
      //没有更多数据
     app.nomore_showToast();
    }
  },

})