// pages/details/order_list/order_list.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
var app = getApp();

var endSecond = []//待提货
var endSecond2 = []//全部订单
var timeOut


// 时间格式化输出，每1s都会调用一次

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    scrollLeft: 0,
    imgUrl: app.globalData.imgUrl,
    imgUrls: app.globalData.imgUrls,
    currentPage: 1, //请求数据的页码
    size: 10, //每页数据条数
    totalCount: 0, //总是数据条数
    pagecount: 0, //总的页数
    djs:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      currentTab: options.currentTab
    })
   

    /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    // that.Allorder()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;
    var session = wx.getStorageSync('session')
    if (session == '') {
      wx.showModal({
        title: '提示',
        content: '用户未登录',
        confirmText: '去登陆',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1 // 返回上一级页面。
            })
          }
        }
      })
    } else {
      // debugger
      if (that.data.currentTab == '1') {
        that.data.currentPage = 1,
          that.data.totalCount = 0, //总是数据条数
          that.data.pagecount = 0, //总的页数
          that.dfkorder() //待付款
      } else if (that.data.currentTab == '2') {
        that.data.currentPage = 1,
          that.data.totalCount = 0, //总是数据条数
          that.data.pagecount = 0, //总的页数
          that.bhz() //备货中
      } else if (that.data.currentTab == '3') {
        that.data.currentPage = 1,
          that.data.totalCount = 0, //总是数据条数
          that.data.pagecount = 0, //总的页数
          that.psz() //配送中
      } else if (that.data.currentTab == '4') {
        that.data.currentPage = 1,
          that.data.totalCount = 0, //总是数据条数
          that.data.pagecount = 0, //总的页数
          that.dth() //待提货
        
      } else if (that.data.currentTab == '5') {
        that.data.currentPage = 1,
          that.data.totalCount = 0, //总是数据条数
          that.data.pagecount = 0, //总的页数
          that.yth() //已提货
      }
      else if (that.data.currentTab == '0') {
        that.data.currentPage = 1,
          that.data.totalCount = 0, //总是数据条数
          that.data.pagecount = 0, //总的页数
          that.Allorder() //全部
      }
    }
  },
  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countdownEnd: function () {
    var that = this
    let nowTime = new Date().getTime();
    console.log(nowTime)
    let timeList = that.data.endSecond;
    console.log('endSecond', timeList)
    var totaltime = 0;
    let countDownArr = [];
    timeList.forEach(o => {
      console.log(o)
      let endTime = new Date(o.replace(/-/g, '/')).getTime();
      let obj = null;
      let totalSeconds = (endTime - nowTime) / 1000;
      totaltime = totalSeconds
      console.log(totalSeconds)
      // 如果活动未结束，对时间进行处理
      if (totalSeconds > 0) {
        // 获取天、时、分、秒
        let day = parseInt(totalSeconds / (60 * 60 * 24));
        let hou = parseInt(totalSeconds % (60 * 60 * 24) / 3600);
        let min = parseInt(totalSeconds % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(totalSeconds % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: that.timeFormat(day),
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec),
          state: 0,
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
          state: 1,
        }
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    that.setData({
      endCountDownList: countDownArr
    })
    console.log(that.data.endCountDownList)
    timeOut = setTimeout(function () {
      that.countdownEnd();
    }, 1000)
  },
  countdownEnd2: function () {
    var that = this
    let nowTime = new Date().getTime();
    console.log(nowTime)
    let timeList = that.data.endSecond2;
    console.log('endSecond2', timeList)
    var totaltime = 0;
    let countDownArr = [];
    timeList.forEach(o => {
      console.log(o)
      let endTime = new Date(o.replace(/-/g, '/')).getTime();
      let obj = null;
      let totalSeconds = (endTime - nowTime) / 1000;
      totaltime = totalSeconds
      console.log(totalSeconds)
      // 如果活动未结束，对时间进行处理
      if (totalSeconds > 0) {
        // 获取天、时、分、秒
        let day = parseInt(totalSeconds / (60 * 60 * 24));
        let hou = parseInt(totalSeconds % (60 * 60 * 24) / 3600);
        let min = parseInt(totalSeconds % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(totalSeconds % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: that.timeFormat(day),
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec),
          state: 0,
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
          state: 1,
        }
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    that.setData({
      endCountDownList2: countDownArr
    })
    console.log(that.data.endCountDownList2)
    timeOut = setTimeout(function () {
      that.countdownEnd2();
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   
    clearTimeout(timeOut)
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
    clearTimeout(timeOut)
   
    
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

 
  swichNav: function (e) {
    var that = this;
    endSecond = []
    endSecond2 = []
    clearTimeout(timeOut)
    // debugger
    console.log(e)
    if (e.target.dataset.current == '0') {
      that.data.currentPage = 1,
        that.data.totalCount = 0, //总是数据条数
        that.data.pagecount = 0, //总的页数
        that.Allorder() //全部
    }
    if (e.target.dataset.current == '1') {
      that.data.currentPage = 1,
        that.data.totalCount = 0, //总是数据条数
        that.data.pagecount = 0, //总的页数
        that.dfkorder() //待付款
    } else if (e.target.dataset.current == '2') {
      that.data.currentPage = 1,
        that.data.totalCount = 0, //总是数据条数
        that.data.pagecount = 0, //总的页数
        that.bhz() //备货中
    } else if (e.target.dataset.current == '3') {
      that.data.currentPage = 1,
        that.data.totalCount = 0, //总是数据条数
        that.data.pagecount = 0, //总的页数
        that.psz() //配送中
    } else if (e.target.dataset.current == '4') {
      that.data.currentPage = 1,
        that.data.totalCount = 0, //总是数据条数
        that.data.pagecount = 0, //总的页数
        that.dth() //待提货
    } else if (e.target.dataset.current == '5') {
      that.data.currentPage = 1,
        that.data.totalCount = 0, //总是数据条数
        that.data.pagecount = 0, //总的页数
        that.yth() //已提货
    }
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },
  // 全部订单
  Allorder() {
    var that = this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/order/listCommodityOrderInfo',
      method: 'POST',
      data: {
        'pageIndex': that.data.currentPage,
        'pageSize': that.data.size,
        'userInfo': {
          'id': id
        }
      },
      sCallBack: function (data) {
        var Alllist = data.data.result.datas;
        Alllist.forEach((item,i) => {
          if (item.orderStatus == '1') {
            item.orderStatus = '待支付'
          } else if (item.orderStatus == '2') {
            item.orderStatus = '备货中'
          } else if (item.orderStatus == '3') {
            item.orderStatus = '配送中'
          } else if (item.orderStatus == '4') {
            item.orderStatus = '待提货'
          } else if (item.orderStatus == '5') {
            item.orderStatus = '已提货'
          } else if (item.orderStatus == '6') {
            item.orderStatus = '已完成'
          } 
           
    
        })

        var temlist = that.data.Alllist; //原始的数据集合
        var currentPage = that.data.currentPage; //获取当前页码
        if (currentPage == 1) {
          temlist = data.data.result.datas; //初始化数据列表
          currentPage = 1;
        } else {
          temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
          // currentPage = currentPage + 1;
        }
        that.setData({
          currentPage: currentPage,
          Alllist: temlist,
          totalCount: data.data.result.rowCount, //总的数据条数
          pagecount: data.data.result.totalPages //总页数
        })
        var data = that.data.Alllist
        for (var i = 0; i < data.length; i++) {
        
          if(data[i].orderStatus=='待提货'){
            var dateTime=new Date(data[i].updateOrderTime4);
            dateTime=dateTime.setDate(dateTime.getDate()+1);
            dateTime=new Date(dateTime)
            data[i].updateOrderTime4=data[i].updateOrderTime4.substring(0, 10).replace(data[i].updateOrderTime4.substring(0, 10),dateTime.toLocaleDateString())+data[i].updateOrderTime4.substring(10, 20)
            var end_time = data[i].updateOrderTime4
            endSecond2.push(end_time)
           
          }else{
            // console.log("没有数据")
          }
         
        }
        that.setData({endSecond2: endSecond2 })
        that.countdownEnd2()
        console.log(that.data.endSecond2)
        



      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 全部订单的加载
  Allqbdd() {
    // this.clearAllTimer()
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.Allorder();
    } else {
      //没有更多数据
      app.nomore_showToast();
    }
  },

  // 待付款
  dfkorder() {
    var that = this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/order/listCommodityOrderInfo',
      method: 'POST',
      data: {
        'pageIndex': that.data.currentPage,
        'pageSize': that.data.size,
        'orderStatus': 1,
        'userInfo': {
          'id': id
        }
      },
      sCallBack: function (data) {
        var dfklist = data.data.result.datas;
        dfklist.forEach(item => {
          if (item.orderStatus == '1') {
            item.orderStatus = '待支付'
          } else if (item.orderStatus == '2') {
            item.orderStatus = '备货中'
          } else if (item.orderStatus == '3') {
            item.orderStatus = '配送中'
          } else if (item.orderStatus == '4') {
            item.orderStatus = '待提货'
          } else if (item.orderStatus == '5') {
            item.orderStatus = '已提货'
          }
          // item.orderTime = item.orderTime.substring(0, 10)
        })

        var temlist = that.data.dfklist; //原始的数据集合
        var currentPage = that.data.currentPage; //获取当前页码
        if (currentPage == 1) {
          temlist = data.data.result.datas; //初始化数据列表
          currentPage = 1;
        } else {
          temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
          // currentPage = currentPage + 1;
        }
        that.setData({
          currentPage: currentPage,
          dfklist: temlist,
          totalCount: data.data.result.rowCount, //总的数据条数
          pagecount: data.data.result.totalPages //总页数
        })
        console.log(that.data.pagecount)



      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 待付款的加载更多
  dfkmore() {
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.dfkorder();
    } else {
      //没有更多数据
      app.nomore_showToast();
    }
  },
  // 备货中
  bhz() {
    var that = this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/order/listCommodityOrderInfo',
      method: 'POST',
      data: {
        'pageIndex': that.data.currentPage,
        'pageSize': that.data.size,
        'userInfo': {
          'id': id
        },
        'orderStatus': 2,
      },
      sCallBack: function (data) {
        var bhzlist = data.data.result.datas;
        bhzlist.forEach(item => {
          if (item.orderStatus == '1') {
            item.orderStatus = '待支付'
          } else if (item.orderStatus == '2') {
            item.orderStatus = '备货中'
          } else if (item.orderStatus == '3') {
            item.orderStatus = '配送中'
          } else if (item.orderStatus == '4') {
            item.orderStatus = '待提货'
          } else if (item.orderStatus == '5') {
            item.orderStatus = '已提货'
          }
          // item.orderTime = item.orderTime.substring(0, 10)
        })

        var temlist = that.data.bhzlist; //原始的数据集合
        var currentPage = that.data.currentPage; //获取当前页码
        if (currentPage == 1) {
          temlist = data.data.result.datas; //初始化数据列表
          currentPage = 1;
        } else {
          temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
          // currentPage = currentPage + 1;
        }
        that.setData({
          currentPage: currentPage,
          bhzlist: temlist,
          totalCount: data.data.result.rowCount, //总的数据条数
          pagecount: data.data.result.totalPages //总页数
        })
        console.log(that.data.pagecount)



      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 备货中加载更多
  bhzmore() {
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.bhz();
    } else {
      //没有更多数据
      app.nomore_showToast();
    }
  },
  // 配送中
  psz() {
    var that = this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/order/listCommodityOrderInfo',
      method: 'POST',
      data: {
        'pageIndex': that.data.currentPage,
        'pageSize': that.data.size,
        'userInfo': {
          'id': id
        },
        'orderStatus': 3,
      },
      sCallBack: function (data) {
        var phzlist = data.data.result.datas;
        phzlist.forEach(item => {
          if (item.orderStatus == '1') {
            item.orderStatus = '待支付'
          } else if (item.orderStatus == '2') {
            item.orderStatus = '备货中'
          } else if (item.orderStatus == '3') {
            item.orderStatus = '配送中'
          } else if (item.orderStatus == '4') {
            item.orderStatus = '待提货'
          } else if (item.orderStatus == '5') {
            item.orderStatus = '已提货'
          }
          // item.orderTime = item.orderTime.substring(0, 10)
        })

        var temlist = that.data.phzlist; //原始的数据集合
        var currentPage = that.data.currentPage; //获取当前页码
        if (currentPage == 1) {
          temlist = data.data.result.datas; //初始化数据列表
          currentPage = 1;
        } else {
          temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
          // currentPage = currentPage + 1;
        }
        that.setData({
          currentPage: currentPage,
          phzlist: temlist,
          totalCount: data.data.result.rowCount, //总的数据条数
          pagecount: data.data.result.totalPages //总页数
        })
        console.log(that.data.pagecount)



      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 配送中加载更多
  pszmore() {
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.psz();
    } else {
      //没有更多数据
      app.nomore_showToast();
    }
  },
  // 待提货
  dth() {
    var that = this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/order/listCommodityOrderInfo',
      method: 'POST',
      data: {
        'pageIndex': that.data.currentPage,
        'pageSize': that.data.size,
        'userInfo': {
          'id': id
        },
        'orderStatus': 4,
      },
      sCallBack: function (data) {
       
        var dthlist = data.data.result.datas;
        dthlist.forEach((item,i) => {
          if (item.orderStatus == '1') {
            item.orderStatus = '待支付'
          } else if (item.orderStatus == '2') {
            item.orderStatus = '备货中'
          } else if (item.orderStatus == '3') {
            item.orderStatus = '配送中'
          } else if (item.orderStatus == '4') {
            item.orderStatus = '待提货'
          } else if (item.orderStatus == '5') {
            item.orderStatus = '已提货'
          }      
        })

        var temlist = that.data.dthlist; //原始的数据集合
        var currentPage = that.data.currentPage; //获取当前页码
        if (currentPage == 1) {
          temlist = data.data.result.datas; //初始化数据列表
          currentPage = 1;
        } else {
          temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
          // currentPage = currentPage + 1;
        }
        that.setData({
          currentPage: currentPage,
          dthlist: temlist,
          totalCount: data.data.result.rowCount, //总的数据条数
          pagecount: data.data.result.totalPages //总页数
        })
        var data = that.data.dthlist
        for (var i = 0; i < data.length; i++) {
          var dateTime=new Date(data[i].updateOrderTime4);
            dateTime=dateTime.setDate(dateTime.getDate()+1);
            dateTime=new Date(dateTime)
            data[i].updateOrderTime4=data[i].updateOrderTime4.substring(0, 10).replace(data[i].updateOrderTime4.substring(0, 10),dateTime.toLocaleDateString())+data[i].updateOrderTime4.substring(10, 20)
            var end_time = data[i].updateOrderTime4
            endSecond.push(end_time)
           
        }
        that.setData({endSecond: endSecond })
        that.countdownEnd()
        console.log(that.data.endSecond)
      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 待提货加载更多
  dthmore() {
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.dth();
    } else {
      //没有更多数据
      app.nomore_showToast();
    }
  },
  // 已提货
  yth() {
    var that = this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/order/listCommodityOrderInfo',
      method: 'POST',
      data: {
        'pageIndex': that.data.currentPage,
        'pageSize': that.data.size,
        'userInfo': {
          'id': id
        },
        'orderStatus': 5,
      },
      sCallBack: function (data) {
        var ythlist = data.data.result.datas;
        ythlist.forEach(item => {
          if (item.orderStatus == '1') {
            item.orderStatus = '待支付'
          } else if (item.orderStatus == '2') {
            item.orderStatus = '备货中'
          } else if (item.orderStatus == '3') {
            item.orderStatus = '配送中'
          } else if (item.orderStatus == '4') {
            item.orderStatus = '待提货'
          } else if (item.orderStatus == '5') {
            item.orderStatus = '已提货'
          }
          // item.orderTime = item.orderTime.substring(0, 10)
        })

        var temlist = that.data.ythlist; //原始的数据集合
        var currentPage = that.data.currentPage; //获取当前页码
        if (currentPage == 1) {
          temlist = data.data.result.datas; //初始化数据列表
          currentPage = 1;
        } else {
          temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
          // currentPage = currentPage + 1;
        }
        that.setData({
          currentPage: currentPage,
          ythlist: temlist,
          totalCount: data.data.result.rowCount, //总的数据条数
          pagecount: data.data.result.totalPages //总页数
        })
        console.log(that.data.pagecount)



      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 已提货加载更多
  ythmore() {
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      this.yth();
    } else {
      //没有更多数据
      app.nomore_showToast();
    }
  },
  // // 售后中
  // shz(){
  //   var that=this;
  //   var id = wx.getStorageSync('userId')
  //   var params = {
  //     url: '/app/order/listCommodityOrderInfo',
  //     method: 'POST',
  //     data: {
  //       'pageIndex':that.data.currentPage,
  //       'pageSize':that.data.size,
  //       'userInfo.id':id,
  //       'isAfterOrder':1,
  //     },
  //     sCallBack: function (data) {
  //        var shzlist=data.data.result.datas;
  //        shzlist.forEach(item=>{
  //         if(item.orderStatus=='1'){
  //           item.orderStatus='待支付'
  //         }else if(item.orderStatus=='2'){
  //           item.orderStatus='备货中'
  //         }else if(item.orderStatus=='3'){
  //           item.orderStatus='配送中'
  //         }else if(item.orderStatus=='4'){
  //           item.orderStatus='待提货'
  //         }else if(item.orderStatus=='5'){
  //           item.orderStatus='已提货'
  //         }
  //         item.orderTime=item.orderTime.substring(0,10)
  //       })

  //       var temlist = that.data.shzlist; //原始的数据集合
  //       var currentPage = that.data.currentPage; //获取当前页码
  //       if (currentPage == 1) {
  //           temlist = data.data.result.datas; //初始化数据列表
  //           currentPage = 1;
  //       }
  //       else {
  //           temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
  //           // currentPage = currentPage + 1;
  //         }
  //         that.setData({
  //           currentPage: currentPage,
  //           shzlist: temlist,
  //           totalCount: data.data.result.rowCount, //总的数据条数
  //           pagecount: data.data.result.totalPages //总页数
  //         })
  //         console.log(that.data.pagecount)



  //     },
  //     eCallBack: function () {
  //     }
  //   }
  //   base.request(params);
  // },
  //  // 售后中加载更多
  // shzmore(){
  //   if (this.data.currentPage < this.data.pagecount) {
  //     this.data.currentPage++;
  //     this.shz();
  //   } else {
  //     //没有更多数据
  //     app.nomore_showToast();
  //   }
  // },
  // // 已结束
  // yjs(){
  //   var that=this;
  //   var id = wx.getStorageSync('userId')
  //   var params = {
  //     url: '/app/order/listCommodityOrderInfo',
  //     method: 'POST',
  //     data: {
  //       'pageIndex':that.data.currentPage,
  //       'pageSize':that.data.size,
  //       'userInfo.id':id,
  //       'orderStatus':6,
  //     },
  //     sCallBack: function (data) {
  //        var yjslist=data.data.result.datas;
  //        yjslist.forEach(item=>{
  //         if(item.orderStatus=='1'){
  //           item.orderStatus='待支付'
  //         }else if(item.orderStatus=='2'){
  //           item.orderStatus='备货中'
  //         }else if(item.orderStatus=='3'){
  //           item.orderStatus='配送中'
  //         }else if(item.orderStatus=='4'){
  //           item.orderStatus='待提货'
  //         }else if(item.orderStatus=='5'){
  //           item.orderStatus='已提货'
  //         }else if(item.orderStatus=='6'){
  //           item.orderStatus='已结束'
  //         }
  //         item.orderTime=item.orderTime.substring(0,10)
  //       })

  //       var temlist = that.data.yjslist; //原始的数据集合
  //       var currentPage = that.data.currentPage; //获取当前页码
  //       if (currentPage == 1) {
  //           temlist = data.data.result.datas; //初始化数据列表
  //           currentPage = 1;
  //       }
  //       else {
  //           temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
  //           // currentPage = currentPage + 1;
  //         }
  //         that.setData({
  //           currentPage: currentPage,
  //           yjslist: temlist,
  //           totalCount: data.data.result.rowCount, //总的数据条数
  //           pagecount: data.data.result.totalPages //总页数
  //         })
  //         console.log(that.data.pagecount)



  //     },
  //     eCallBack: function () {
  //     }
  //   }
  //   base.request(params);
  // },
  // // 已结束加载更多
  // yjsmore(){
  //   if (this.data.currentPage < this.data.pagecount) {
  //     this.data.currentPage++;
  //     this.yjs();
  //   } else {
  //     //没有更多数据
  //     app.nomore_showToast();
  //   }
  // },



  // 跳转到商品详情
  Todetails(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/details/orderDetailsck/ddxx?id=' + e.currentTarget.dataset.id,
    })
  },
  // 取消订单
  cancel(e) {
    var that = this;
    console.log(e)
    var params = {
      url: '/app/order/deleteCommodityOrderInfo',
      method: 'GET',
      data: {
        'id': e.currentTarget.dataset.id, //订单id
      },
      sCallBack: function (data) {
        if (data.data.errorCode == "0") {
          wx.showToast({
            title: data.data.result,

          })
          that.Allorder()
          that.dfkorder()
        }
      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 备货中取消订单e
  cancel_bh(e){
    var that = this;
    console.log(e)
    var params = {
      url: '/app/order/updateCommodityOrderInfoUserAfter',
      method: 'GET',
      data: {
        'id': e.currentTarget.dataset.id, //订单id
      },
      sCallBack: function (data) {
        if (data.data.errorCode == "0") {
          wx.showToast({
            title: data.data.result,

          })
          that.Allorder()
          that.bhz()
        }
      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 去付款
  Topay(e) {
    console.log(e)
    var that = this;
    var message = e.currentTarget.dataset.item
    that.setData({
      message: message
    })

    // const product = [];
    // for (let i = 0; i < list.length; i++) {
    //   const productItem = {};
    //   productItem['id'] = list[i].commodityInfo.id
    //   productItem['name'] = list[i].commodityInfo.productInfo.commodityName
    //   productItem['photo'] = list[i].commodityInfo.productInfo.photo
    //   productItem['price'] = list[i].commodityInfo.price
    //   productItem['number'] = list[i].commodityNumber
    //   product.push(productItem)
    // }
    // const productInfo = {};
    // productInfo['sendType'] = e.currentTarget.dataset.item.orderSendType
    // productInfo['productList'] = product
    // wx.setStorageSync('productInfo', productInfo)
    wx.navigateTo({
      url: `/pages/details/topay/topay`
    })
  },
  // 我的提货码
  thm(e) {
    console.log(e)
    var that = this;
    that.setData({
      orderId: e.currentTarget.dataset.orderid,
      pickcode: e.currentTarget.dataset.pickcode,
      showThm: true
    })
  },
  // 关闭提货码
  closeThm() {
    var that = this;
    that.setData({
      showThm: false
    })
  },
  // 积分订单
  jfList() {
    var that = this;
    var that = this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/order/listIntegralOrderInfo',
      method: 'POST',
      data: {
        'pageIndex': that.data.currentPage,
        'pageSize': that.data.size,
        'userInfo': {
          'id': id
        }
      },
      sCallBack: function (data) {
        var ythlist = data.data.result.datas;
        ythlist.forEach(item => {
          if (item.orderStatus == '1') {
            item.orderStatus = '待支付'
          } else if (item.orderStatus == '2') {
            item.orderStatus = '备货中'
          } else if (item.orderStatus == '3') {
            item.orderStatus = '配送中'
          } else if (item.orderStatus == '4') {
            item.orderStatus = '待提货'
          } else if (item.orderStatus == '5') {
            item.orderStatus = '已提货'
          }
          // item.orderTime = item.orderTime.substring(0, 10)
        })

        var temlist = that.data.ythlist; //原始的数据集合
        var currentPage = that.data.currentPage; //获取当前页码
        if (currentPage == 1) {
          temlist = data.data.result.datas; //初始化数据列表
          currentPage = 1;
        } else {
          temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
          // currentPage = currentPage + 1;
        }
        that.setData({
          currentPage: currentPage,
          ythlist: temlist,
          totalCount: data.data.result.rowCount, //总的数据条数
          pagecount: data.data.result.totalPages //总页数
        })
        console.log(that.data.pagecount)



      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 申请售后
  sqsh() {
    wx.showToast({
      title: '请联系团长',
      icon: 'none',
      dduration: 3000
    })
  },

 
 


})