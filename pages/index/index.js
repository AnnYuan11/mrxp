// pages/index/index.js
import { Base } from "../../utils/request/base.js";
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'GTMBZ-PJLCW-2QDRH-RMAHZ-DRPT2-VMFS6' // 必填
});
var app = getApp();
var base = new Base();
//整点报时器方法

Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    duration: 500,
    currentTab: 0,
    // show:true,//弹窗
    imgUrl: app.globalData.imgUrl,
    imgUrls: app.globalData.imgUrls,
    currentPage: 1, //请求数据的页码
    size: 10, //每页数据条数
    totalCount: 0, //总是数据条数
    pagecount: 0, //总的页数
    triggered: false,//下拉刷新
    dpShow:false,//店铺显示
    isloading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    
    that.lunbo() //轮播图
    that.notice() //公告
   
    that.getPic()//获取分享店铺
    // that.fans() //头部粉丝数
    that.hourReport();//定时刷新
    var date = new Date();
    var today = date.getMonth() + 1 + '月' + date.getDate() + '日'
    // that.shopList()
    that.city(); //获取所在城市名
    // that.query()
    that.setData({
      today: today,
      qhdzid: options.zdtid,
      sharephone:options.sharephone,
      options:options
    })
    // var zdtid = wx.getStorageSync('zdtid')
    // if(that.data.qhdzid!=undefined){
    //   if(zdtid!=that.data.qhdzid){
    //     that.setData({
    //       dpShow:true
    //     })
    //   }
    // }
   
   
    // 获取设备高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    // 分享
    wx.showShareMenu({
      withShareTicket: true
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  onPulling(e) {
    var that=this;
    that.data.listToday=[]
    console.log(that.data.listToday)
  },
  onRefresh() {
    var that=this;
    var that=this;
    that.data.currentPage = 1,
    that.data.totalCount = 0, //总是数据条数
    that.data.pagecount = 0, //总的页数
    that.shopList() //已使用
    
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 1500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
   
    try {
      //使用更新对象之前判断是否可用
      if (wx.canIUse('getUpdateManager')) {
          const updateManager = wx.getUpdateManager()
          updateManager.onCheckForUpdate(function(res) {
              // 请求完新版本信息的回调
              if (res.hasUpdate) {
                  updateManager.onUpdateReady(function() {
                      wx.showModal({
                          title: '更新提示',
                          content: '新版本已经准备好，是否重启当前应用？',
                          success(res) {
                              if (res.confirm) {
                                  // 新的版本已经下载好，调用applyUpdate应用新版本并重启
                                  updateManager.applyUpdate()
                              }else if (res.cancel) {
                                  updateManager.applyUpdate()
                              }
                          },
                          fail(res) {
                              console.log(res)
                          }
                      })
                  })
                  // 新版本下载失败时执行
                  updateManager.onUpdateFailed(function() {
                      wx.showModal({
                          title: '发现新版本',
                          content: '请删除当前小程序，重新搜索打开...',
                      })
                  })
              }
          })
      } else {

          //如果小程序需要在最新的微信版本体验，如下提示
          wx.showModal({
              title: '更新提示',
              content: '当前微信版本过低，请升级到最新微信版本后重试。'
          })
      }
  } catch (e) {
      console.log(e)
  }
    
    
    var userId = wx.getStorageSync('userId')
    var headInfo = wx.getStorageSync('headInfo')
    console.log(that.data.qhdzid)
    if(that.data.qhdzid==undefined||that.data.qhdzid=='111'){
      if(headInfo){
        that.setData({
          shopName: headInfo.shopName,
          sharephone: headInfo.phone,
          ztdid:headInfo.id,
        })
        wx.setStorage({
          key: 'zdtid',
          data: headInfo.id,
        })
      }else{
        that.query() 
      }
      
    }else{  
      that.spxx()
    }    
    app.getShopNum()
    that.order()
    that.fans()
    that.shopList() //今日售卖列表
    that.yhqList() //优惠券列表
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
 
  hourReport() {
    var that=this;
    //当前时间
    var time = new Date();
    //小时
    var hours = time.getHours();
    //分钟
    var mins = time.getMinutes();
    //秒钟
    var secs = time.getSeconds();
    //下一次报时间隔
    var next = ((60 - mins) * 60 - secs) * 1000;
    //设置下次启动时间
    setTimeout(function () {
      that.hourReport();
    }, next)
    //整点报时，因为第一次进来mins可能不为0所以要判断
    if (mins == 0) {
        that.shopList()
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
   
    clearInterval(interval);
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
    var that = this
    // if (that.data.currentTab == '0') {
    //   that.bindscrolltolower()
    // } else {
    //   that.bindscrolltolower2()
    // }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that=this;
    var zdtid = wx.getStorageSync('zdtid')
    var sharephone = wx.getStorageSync('sharephone')
    console.log(that.data.sharephone)
    return {
      title: that.data.shopShareTitle,
      imageUrl: that.data.imgUrl+'/'+that.data.shopSharePhoto,  
      // desc: '分享页面的内容',
      path: '/pages/index/index?zdtid=' + zdtid+'&sharephone='+that.data.sharephone // 路径，传递参数到指定页面。
    }
  },
  // 获取分享图片
getPic(){
  var that = this;
  var params = {
    url: '/app/findHeadInfoProperty',
    method: 'GET',
    data: {
      
    },
    sCallBack: function (data) {
      that.setData({
        shopShareTitle:data.data.result.shopShareTitle,
        shopSharePhoto:data.data.result.shopSharePhoto
      })

    },
    eCallBack: function () {}
  }
  base.request(params);
},
  
  // 商品切换
  swichNav: function (e) {
    var that = this;
    if (e.target.dataset.current == '0') {
      that.data.currentPage = 1,
        that.data.totalCount = 0, //总是数据条数
        that.data.pagecount = 0, //总的页数
        that.shopList() //已使用
    } else if (e.target.dataset.current == '1') {
      that.data.currentPage = 1,
        that.data.totalCount = 0, //总是数据条数
        that.data.pagecount = 0, //总的页数
        that.shopListM() 
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
  sure() {
    var that = this;
    that.setData({
      show: false
    })
    wx.showTabBar({
      animation: true,
    })
  },
  // 获取日期
  getDateStr: function (today, addDayCount) {
    var date;
    var that = this;
    if (today) {
      date = new Date(today);
    } else {
      date = new Date();
    }
    date.setDate(date.getDate() + addDayCount); //获取AddDayCount天后的日期 
    var y = date.getFullYear();
    var m = date.getMonth() + 1; //获取当前月份的日期 
    var d = date.getDate();
    

    if (m < 10) {
      m = '0' + m;
    };
    if (d < 10) {
      d = '0' + d;
    };
    var tomorow = m + "月" + d + "日";
    that.setData({
      tomorow: tomorow,
    })
  },
  // 今日售卖列表
  shopList(className) {
    var that = this;
    var headInfo = wx.getStorageSync('headInfo')
    that.setData({
      isloading:true
    })
    // wx.showLoading({
    //   title: '加载中',
    // })
    var params = {
      url: '/app/commodity/listCommodityInfoForNative',
      method: 'POST',
      data: {
        'name': className,
        'pageIndex': that.data.currentPage,
        'pageSize': that.data.size,
        'sendType':'1',
        'franchiseeId':headInfo.franchiseeInfo.id
      },
      sCallBack: function (data) {
       
        var listToday = data.data.result
        console.log(that.data.currentPage)
        console.log(that.data.pagecount)
        console.log(listToday.length)
        // if(listToday.length=='0'){
        //   that.shopList()
        // }
        if(listToday){
          // that.setData({
          //   isloading:false
          // })
        }
        
        if (listToday != '') {
          listToday.forEach((item, index) => {
            item.startTime2 = item.startTime.substring(5, 7) + '月' +  item.startTime.substring(8, 10) + '日'+ item.startTime.substring(10, 19)
            item.startTime = item.startTime.substring(5, 7) + '月' + item.startTime.substring(8, 10) + '日'
            
            if (item.sendType == 1) {
              item.sendType = "到店自提"
            } else {
              item.sendType = "快递到家"
            }
            if (item.pickDate == 1) {
              that.getDateStr(null, 0)
              item.pickDate = that.data.tomorow
            } else if (item.pickDate == 2) {
              that.getDateStr(null, 1)
              var tomorows = that.data.tomorow
              item.pickDate = tomorows
            } else {
              that.getDateStr(null, 2)
              var ht = that.data.tomorow
              item.pickDate = ht
            }
            if (item.isBuy == 2) {
              item.isBuy = "提前加入购物车"

            }else if(item.isBuy == 1) {
              item.isBuy = "加入购物车"
            }
            else if (item.isBuy == 3) {
              item.isBuy = "活动已结束"
            } else if (item.isBuy == 4) {
              item.isBuy = "已售罄"
            }

          })
        }
        var temlist = that.data.listToday; //原始的数据集合
        var currentPage = that.data.currentPage; //获取当前页码
        if (currentPage == 1) {
          temlist = data.data.result; //初始化数据列表
          currentPage = 1;
        } else {
          temlist = temlist.concat(data.data.result); //请求的数据追加到原始数据集合里
          // currentPage = currentPage + 1;
        }
        that.setData({
          currentPage: currentPage,
          listToday: temlist,
          totalCount: data.data.result[0].rowCount, //总的数据条数
          pagecount: data.data.result[0].totalPages //总页数
        })
       

      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 快递到家
  shopListM(className) {
    var that = this;
    var params = {
      url: '/app/commodity/listCommodityInfo',
      method: 'POST',
      data: {
        'name': className,
        'pageIndex': that.data.currentPage,
        'pageSize': that.data.size,
        'sendType':'2'
      },
      sCallBack: function (data) {
        var listTomorow = data.data.result.datas

        if (listTomorow != '') {
          listTomorow.forEach((item, index) => {
            item.startTime = item.startTime.substring(5, 7) + '月' + item.startTime.substring(8, 10) + '日'
           
            if (item.sendType == 1) {
              item.sendType = "到店自提"
            } else {
              item.sendType = "快递到家"
            }
            if (item.pickDate == 1) {
              that.getDateStr(null, 0)
              item.pickDate = that.data.tomorow
            } else if (item.pickDate == 2) {
              that.getDateStr(null, 1)
              var tomorow = that.data.tomorow
              item.pickDate = tomorow
            } else {
              that.getDateStr(null, 2)
              var ht = that.data.tomorow
              item.pickDate = ht
            }
            if (item.isBuy == 2) {
              item.isBuy = "活动未开始"
            } else if (item.isBuy == 3) {
              item.isBuy = "活动已结束"
            } else if (item.isBuy == 4) {
              item.isBuy = "已售罄"
            }
          })
        }

        var temlist = that.data.listTomorow; //原始的数据集合
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
          listTomorow: temlist,
          totalCount: data.data.result.rowCount, //总的数据条数
          pagecount: data.data.result.totalPages //总页数
        })

      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 首页轮播图
  lunbo() {
    var that = this;
    var params = {
      url: '/app/findAllBanner',
      method: 'GET',
      data: {

      },
      sCallBack: function (data) {
        that.setData({
          background: data.data.result
        })

      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 首页公告
  notice() {
    var that = this;
    var params = {
      url: '/app/information/listInformationInfo',
      method: 'POST',
      data: {
        'pageIndex': 1,
        'pageSize': 100
      },
      sCallBack: function (data) {
        that.setData({
          content: data.data.result.datas
        })

      },
      eCallBack: function () {}
    }
    base.request(params);
  },

  // 选择团长
  selectTZ() {
    wx.navigateTo({
      url: '/pages/details/dhzt/dhzt',
    })
  },
  // 查询用户切换店铺

  query() {
    var that = this;
    var userId = wx.getStorageSync('userId')
    var params = {
      url: '/app/user/findUserHeadInfo',
      method: 'POST',
      data: {
        userInfo: {
          'id': userId
        }
      },
      sCallBack: function (data) {
        if(data.data.errorCode=='-1'){
          that.default()
        }
        that.setData({
          defaultztd: data.data.result,
          shopName: data.data.result.headInfo.shopName,
          ztdid: data.data.result.headInfo.id,
          sharephone:data.data.result.headInfo.phone
        })
        wx.setStorage({
          key: 'zdtid',
          data: data.data.result.headInfo.id
        })
        wx.setStorage({
          key: 'sharephone',
          data: data.data.result.headInfo.phone
        })
        wx.setStorage({
          key: 'headInfo',
          data: data.data.result.headInfo
        })

      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 团长地址
  // list() {

  //   var that = this;
  //   var myLat = wx.getStorageSync('latitude');
  //   var myLng = wx.getStorageSync('longitude');
  //   var params = {
  //     url: '/app/head/findAllHeadInfoByDistance',
  //     method: 'POST',
  //     data: {
  //       myLat: myLat,
  //       myLng: myLng,
  //       'pageIndex': 1,
  //       'pageSize': 1,
  //     },
  //     sCallBack: function (data) {
  //       var list = data.data.result.datas;
  //       if (list.length == 0) {
  //         that.default()
  //       }
  //       that.setData({
  //         shopName: list[0].shopName,
  //         ztdid: list[0].id
  //       })
  //       wx.setStorage({
  //         key: 'zdtid',
  //         data: list[0].id
  //       })

  //     },
  //     eCallBack: function () {}
  //   }
  //   base.request(params);
  // },
  // 默认自提点
  default () {
    var that = this;
    var params = {
      url: '/app/head/findHeadInfoProperty',
      method: 'GET',
      data: {

      },
      sCallBack: function (data) {
        var list = data.data.result;
        wx.setStorage({
          key: 'headInfo',
          data: data.data.result
        })

        // that.setData({
        //   shopName: list.shopName,
        //   ztdid: list.id,
        // })
        // wx.setStorage({
        //   key: 'zdtid',
        //   data: list.id,
        // })

      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 加入购物车
  joinGwc(e) {
    var that = this;
    var session = wx.getStorageSync('session')
    var userId = wx.getStorageSync('userId')
    // if (session == '') {
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   })
    // } else {
      var spid = e.currentTarget.dataset.spid;
      var sendtype = e.currentTarget.dataset.sendtype
      if (sendtype == "到店自提") {
        sendtype = 1
      } else {
        sendtype = 2
      }
      var params = {
        url: '/app/commodity/addShoppingCartInfo',
        method: 'POST',
        data: {
          'commodityInfo': {
            'id': spid
          },
          'commodityNumber': '1',
          'shoppingCarType': sendtype,
          'userInfo': {
            'id': userId
          },
          "headInfo": {
            "id": that.data.ztdid //自提点id
          }

        },
        sCallBack: function (data) {
          if (data.data.errorCode == '0') {
            wx.showToast({
              title: data.data.result,
            })
            app.getShopNum()
          } else if (data.data.errorCode == '-200') {
            wx.showToast({
              title: data.data.errorMsg,
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }, 2000);
              }
            })
          } else {
            wx.showToast({
              title: data.data.result,
            })
          }

        },
        eCallBack: function () {}
      }
      base.request(params);
    // }

  },
  // 今日售卖下拉加载
  bindscrolltolower: function () {
    // debugger
    var that=this
    console.log(that.data.currentTab)
    if (this.data.currentPage < this.data.pagecount) {
      this.data.currentPage++;
      if (that.data.currentTab == '0') {
        this.shopList();
      } else {
        // this.shopListM();
      }
     
    } else {
      //没有更多数据
      // app.nomore_showToast();
    }
  },
  // 明日售卖下拉加载
  // bindscrolltolower2: function () {
  //   if (this.data.currentPage < this.data.pagecount) {
  //     this.data.currentPage++;
  //     this.shopListM();
  //   } else {
  //     //没有更多数据
  //     app.nomore_showToast();
  //   }
  // },
  // 优惠券列表
  yhqList() {
    var that = this;
    var userId = wx.getStorageSync('userId')
    var ids = [];
    var params = {
      url: '/app/market/listCouponInfo',
      method: 'POST',
      data: {
        'pageIndex': 1,
        'pageSize': 100,
        'userId': userId
      },
      sCallBack: function (data) {

        if (data.data.result.datas.length == '0') {
          that.setData({
            show: false
          })
        } else {
          that.setData({
            show: true
          })
          // tabbar的显示隐藏
          wx.hideTabBar({
            animation: true,
          })
        }
        if (data.data.errorCode == '0') {
          data.data.result.datas.forEach(item => {

            ids.push(item.id)
            if (item.type == '1') {
              item.type = '全场通用'
            } else {
              item.type = '部分可用'
            }
          })
          that.setData({
            coupons: data.data.result.datas.slice(0, 3),
            ids: ids
          })

        } else {
          wx.showToast({
            title: data.data.result,
          })
        }

      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 领取优惠券
  getAll() {
    var that = this;
    var userId = wx.getStorageSync('userId')
    if (userId == undefined || userId == '') {
      wx.showToast({
        title: '用户未登录 请先登陆',
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
        'ids': that.data.ids,
        'userInfo': {
          'id': userId
        }
      },
      sCallBack: function (data) {

        if (data.data.errorCode == 0) {
          wx.showToast({
            title: data.data.result,
            duration: 3000,
            success: function () {
              setTimeout(function () {
                that.setData({
                  show: false
                })
                wx.showTabBar({
                  animation: true,
                })
              }, 3000);

            }
          })
        } else {
          wx.showToast({
            title: data.data.errorMsg,
            icon: 'none',
            success: function () {
              setTimeout(function () {
                that.setData({
                  show: false
                })
                wx.showTabBar({
                  animation: true,
                })
              }, 3000);

            }
          })
        }


      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 获取滚动条当前位置
  scoll: function (e) {
    if (e.detail.scrollTop > 100) {
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
  goTop: function (e) { // 一键回到顶部
    this.setData({
      topNum: this.data.topNum = 0
    });
  },

  // 定时器
  djs() {
    var that = this;
    var times = 4;
    var interval = setInterval(function () {
      that.order()
      // times--;
      // if (times < 0) {



      // }
    }, 30000)
  },
  // 查询天气情况
  weather(city) {
    var that = this;
    var params = {
      url: '/app/getEmojiWeather',
      method: 'GET',
      data: {
        'city': city
      },
      sCallBack: function (data) {
        that.setData({
          weather: data.data.result
        })
      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  city() {
    var that = this;
   
    var latitude = wx.getStorageSync('latitude')
    var longitude = wx.getStorageSync('longitude')
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (addressRes) {
        console.log(addressRes)
        that.weather(addressRes.result.ad_info.city)
      },
      fail: function (error) {
        console.log(error)
      },
      complete: function (res) {

      }
    })
  },
  // 头部粉丝数
  fans() {
    var that = this;
    var headInfo = wx.getStorageSync('headInfo')
    var params = {
      url: '/app/head/listHeadUserNumbers',
      method: 'POST',
      data: {
        'headInfo': {
          'id': headInfo.id
        }
      },
      sCallBack: function (data) {
        that.setData({
          fans: data.data.result
        })
      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  // 最新下单
  order() {
    var that = this;
    var params = {
      url: '/app/order/findAllCommodityOrderInfo30ByPay',
      method: 'GET',
      data: {

      },
      sCallBack: function (data) {
        that.setData({
          contents: data.data.result
        })
        if (that.data.contents.length == 1) {
          setTimeout(function () {
            that.setData({
              contents: []
            })
          }, 3000);
        }
      },
      eCallBack: function () {}
    }
    base.request(params);
  },
  bindchange(e) {
    var that = this;
    console.log(that.data.contents.length)
    var current = e.detail.current + 1
    console.log(current)
    if (current == that.data.contents.length) {
      setTimeout(function () {
        that.setData({
          contents: []
        })
      }, 3000);

    }
  },
  // 切换自提点
  change(e) {
    console.log(e)
    var that = this;
    var userId = wx.getStorageSync('userId')
    console.log(userId)
    var params = {
      url: '/app/user/addUserHeadInfo',
      method: 'POST',
      data: {
        userInfo: {
          'id': userId
        },
        headInfo: {
          'id': that.data.qhdzid
        }
      },
      sCallBack: function (data) {
        wx.removeStorageSync('shop')
        that.query()
        that.setData({
          qhdzid:'111'
        })
        // that.options.qhdzid='111'
        console.log('wangbo'+that.options.qhdzid)
      },
      eCallBack: function () {}
    }
    base.request(params);
  },

  radioChange(e) {
    console.log(e)    
  },
  spxx() {
    var that = this;
    var userId = wx.getStorageSync('userId')
    var params = {
      url: '/app/head/findHeadInfoByPhone',
      method: 'GET',
      data: {
         'phone':that.data.sharephone 
      },
      sCallBack: function (data) {
        that.setData({
          shopName: data.data.result.shopName,
          qhdzid: data.data.result.id,
          sharephone: data.data.result.phone,
          ztdid:data.data.result.id,
          qhdzid:'111'
        })
        wx.setStorage({
          key: 'headInfo',
          data: data.data.result
        })
        wx.setStorage({
          key: 'zdtid',
          data: data.data.result.id
        })
        // wx.setStorage({
        //   key: 'sharephone',
        //   data: data.data.result.phone
        // })
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
})