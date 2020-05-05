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
    // show:true,//弹窗
    imgUrl:app.globalData.imgUrl,
    currentPage: 1,//请求数据的页码
    size: 10,//每页数据条数
    totalCount: 0,//总是数据条数
    pagecount: 0,//总的页数
    // aa:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.shopList()//今日售卖列表
    that.lunbo()//轮播图
    that.notice()//公告
    that.yhqList()//优惠券列表
    that.list()//团长地址
    // that.onPageScroll()
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
               
                wx.openSetting({
                  success: function (data) {
                    console.log(data);
                    if (data.authSetting["scope.userLocation"] == true) {
                      console.log('定位授权问问')
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
        } else if (res.authSetting['scope.userLocation'] == undefined||res.authSetting['scope.userLocation']==true) {//初始化进入
          console.log('定位授权333')
          that.locations();
         
        }
      }
    })
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
    var aa=wx.getStorageSync('aa')
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
    var that=this
    if(that.data.currentTab=='0'){
      that.bindscrolltolower()
    }else{
      that.bindscrolltolower2()
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 搜索
  search: function (e) {
    var that=this;
    var className=e.detail.value
    var that = this;
    var params = {
      url: '/app/commodity/listCommodityInfo',
      method: 'POST',
      data: {
        'name':className,
        'pageIndex':1,
        'pageSize':1000,
      },
      sCallBack: function (data) {
        var listToday=data.data.result.datas
        if(listToday!=''){
          listToday.forEach((item,index) =>{
            item.startTime=item.startTime.substring(5,7)+'月'+item.startTime.substring(8,10)+'日'
  
            if(item.sendType==1){
              item.sendType="到店自提"
            }else{
              item.sendType="快递到家"
            }
            if(item.pickDate==1){
              that.getDateStr(null,0)
              item.pickDate=that.data.tomorow
            }else if(item.pickDate==2){
              that.getDateStr(null,1)
              var tomorow=that.data.tomorow
              item.pickDate=tomorow
            }else{
              that.getDateStr(null,2)
              var ht=that.data.tomorow
              item.pickDate=ht
            }
            if(item.isBuy==2){
              item.isBuy="活动未开始"
            }else if(item.isBuy==3){
              item.isBuy="活动已结束"
            }else if(item.isBuy==4){
              item.isBuy="已售罄"
            }
            
          })
        }
          that.setData({
            listToday: listToday,
            currentPage:10000
          })
          
      },
      eCallBack: function () {
      }
    }
    base.request(params);
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
      'name':className,
      'pageIndex':that.data.currentPage,
      'pageSize':that.data.size,
    },
    sCallBack: function (data) {
      var listToday=data.data.result.datas
      if(listToday!=''){
        listToday.forEach((item,index) =>{
          item.startTime=item.startTime.substring(5,7)+'月'+item.startTime.substring(8,10)+'日'

          if(item.sendType==1){
            item.sendType="到店自提"
          }else{
            item.sendType="快递到家"
          }
          if(item.pickDate==1){
            that.getDateStr(null,0)
            item.pickDate=that.data.tomorow
          }else if(item.pickDate==2){
            that.getDateStr(null,1)
            var tomorow=that.data.tomorow
            item.pickDate=tomorow
          }else{
            that.getDateStr(null,2)
            var ht=that.data.tomorow
            item.pickDate=ht
          }
          if(item.isBuy==2){
            item.isBuy="活动未开始"
          }else if(item.isBuy==3){
            item.isBuy="活动已结束"
          }else if(item.isBuy==4){
            item.isBuy="已售罄"
          }
          
        })
      }
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
        // console.log(that.data.pagecount)         
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
      'pageIndex':that.data.currentPage,
      'pageSize':that.data.size,
    },
    sCallBack: function (data) {
      var listTomorow=data.data.result.datas
      // console.log(listTomorow)
      if(listTomorow!=''){
        listTomorow.forEach((item,index) =>{
          item.startTime = item.startTime.substring(5, 7) + '月' + item.startTime.substring(8, 10) + '日'

          if(item.sendType==1){
            item.sendType="到店自提"
          }else{
            item.sendType="快递到家"
          }
          if(item.pickDate==1){
            that.getDateStr(null,0)
            item.pickDate=that.data.tomorow
          }else if(item.pickDate==2){
            that.getDateStr(null,1)
            var tomorow=that.data.tomorow
            item.pickDate=tomorow
          }else{
            that.getDateStr(null,2)
            var ht=that.data.tomorow
            item.pickDate=ht
          }
          if(item.isBuy==2){
            item.isBuy="活动未开始"
          }else if(item.isBuy==3){
            item.isBuy="活动已结束"
          }else if(item.isBuy==4){
            item.isBuy="已售罄"
          }
        })
      }
     
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
      'pageSize':100
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
      var aa=wx.getStorageSync('aa')
      if(aa=='0'){
        that.query()//查询用户切换店铺
      }else {
        that.list()
      }
     
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
          shopName:data.data.result.headInfo.shopName,
          ztdid: data.data.result.headInfo.id
        })
        wx.setStorage({
          key: 'zdtid',
          data: data.data.result.headInfo.id
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
        myLng:myLng,
        'pageIndex':1,
        'pageSize':1,
      },
      sCallBack: function (data) {
        var list= data.data.result.datas;
        if(list.length==0){
          that.default()
        }
        that.setData({
         shopName:list[0].shopName,
          ztdid: list[0].id
        })
        wx.setStorage({
          key: 'zdtid',
          data: list[0].id
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
          ztdid: list.id,
        })
        wx.setStorage({
          key: 'zdtid',
          data: list.id,
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
    console.log(that.data.ztdid)
    var userId = wx.getStorageSync('userId')
    if(userId==''){
     wx.navigateTo({
       url: '/pages/login/login',
     })
    }else{
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
         },
          "headInfo": {
            "id": that.data.ztdid//自提点id
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
    }
   
  },
  // 今日售卖下拉加载
  bindscrolltolower: function () {
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.shopList();
    } else {
      //没有更多数据
     app.nomore_showToast();
    }
  },
  // 明日售卖下拉加载
  bindscrolltolower2: function () {
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.shopListM();
    } else {
      //没有更多数据
     app.nomore_showToast();
    }
  },
  // 优惠券列表
  yhqList(){
    var that=this;
    var userId = wx.getStorageSync('userId')
    var ids=[];
    var params = {
      url: '/app/market/listCouponInfo',
      method: 'POST',
      data: {
       'pageIndex':1,
       'pageSize':100,
       'userId':userId
      },
      sCallBack: function (data) {
        console.log(data)
        if(data.data.result.datas.length=='0'){
          that.setData({
            show:false
          })
        }else{
          that.setData({
            show:true
          })
           // tabbar的显示隐藏
          wx.hideTabBar({
            animation: true,
          })
        }
        if(data.data.errorCode=='0'){
          data.data.result.datas.forEach(item=>{
            
            ids.push(item.id)
            if(item.type=='1'){
              item.type='全场通用'
            }else{
              item.type='部分可用'
            }
          })
          that.setData({
            coupons:data.data.result.datas.slice(0,3),
            ids:ids
          })
          // console.log(that.data.ids)
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
  // 领取优惠券
  getAll(){
    var that=this;
    var userId = wx.getStorageSync('userId')
    if(userId==undefined||userId==''){
      wx.showToast({
        title:'用户未登录 请先登陆',
        duration: 2000,
        success: function () {
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }, 2000);
          }
      })
      return false
    }
    var params = {
      url: '/app/user/addUserCouponInfoIds',
      method: 'POST',
      data: {
       'ids':that.data.ids,
       'userInfo':{
         'id':userId
       }
      },
      sCallBack: function (data) {
        console.log(data)
        if(data.data.errorCode==0){
          wx.showToast({
            title:data.data.result,
            duration: 3000,
            success: function () {
              setTimeout(function () {
                that.setData({
                  show:false
                })
                wx.showTabBar({
                  animation: true,
                })
              }, 3000);

              }
          })
        }else{
          wx.showToast({
            title:data.data.errorMsg,
            icon:'none',
            success: function () {
              setTimeout(function () {
                that.setData({
                  show:false
                })
                wx.showTabBar({
                  animation: true,
                })
              }, 3000);

              }
          })
        }
        
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    console.log(e)
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
})