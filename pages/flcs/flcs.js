// pages/flcs/flcs.js
import { Base } from "../../utils/request/base.js";
var app = getApp();
var base = new Base();
Page({
  data: {
    vtabs: [],
    activeTab: 0,
    imgUrl: app.globalData.imgUrl,
    imgUrls: app.globalData.imgUrls,
    currentPage: 1, //请求数据的页码
    size: 10, //每页数据条数
    totalCount: 0, //总是数据条数
    pagecount: 0, //总的页数
  },

  onLoad() {
   var that=this;
   that.classfiy()
  },

  onTabCLick(e) {
    
    var page = this;
    console.log(e)
    console.log(this.data.classfiyList[e.detail.index].id)
    const index = e.detail.index
    page.data.currentPage = 1,
    page.data.totalCount = 0, //总是数据条数
    page.data.pagecount = 0, //总的页数
    page.shopList(page.data.classfiyList[e.detail.index].id)
  
  },

  onChange(e) {
    const index = e.detail.index
    console.log('change', index)
  },
// 查询分类
classfiy(){
  var that = this;
  var params = {
    url: '/app/commodity/findAllCommodityInfoClassChildren',
    method: 'GET',
    data: {
    },
    sCallBack: function (data) {
      const titles = data.data.result
      const vtabs = titles.map(item => ({title: item.className}))
      that.setData({
        vtabs,
        classfiyList:data.data.result
      })
      that.shopList(that.data.classfiyList[0].id)

    },
    eCallBack: function () {}
  }
  base.request(params);
},
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
 shopList(cid) {
  var that = this;
  var headInfo = wx.getStorageSync('headInfo')
  that.setData({
    isloading:true
  })
  wx.showLoading({
    title: '加载中',
  })
  var params = {
    url: '/app/commodity/listCommodityInfo',
    method: 'POST',
    data: {
      'pageIndex': that.data.currentPage,
      'pageSize': that.data.size,
      'sendType':'1',
      'franchiseeId':headInfo.franchiseeInfo.id,
      'commodityInfoClassId':cid
      
    },
    sCallBack: function (data) {
     wx.hideLoading({
       complete: (res) => {},
     })
      var listToday = data.data.result.datas
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
        temlist = data.data.result.datas; //初始化数据列表
        currentPage = 1;
      } else {
        temlist = temlist.concat(data.data.result.datas); //请求的数据追加到原始数据集合里
        // currentPage = currentPage + 1;
      }
      that.setData({
        currentPage: currentPage,
        listToday: temlist,
        totalCount: data.data.result.rowCount, //总的数据条数
        pagecount: data.data.result.totalPages //总页数
      })
      // console.log(that.data.listToday)

    },
    eCallBack: function () {}
  }
  base.request(params);
},
// 今日售卖下拉加载
bindscrolltolower: function (e) {
  console.log(e)
   var that=this;
   if (this.data.currentPage < this.data.pagecount) {
     this.data.currentPage++;
       this.shopList(e.currentTarget.dataset.cid)     
   } else {
     //没有更多数据
     // app.nomore_showToast();
   }
 },
 // 加入购物车
 joinGwc(e) {
  var that = this;
  var userId = wx.getStorageSync('userId')
  var headInfo = wx.getStorageSync('headInfo')
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
        'headInfo': {
          'id': headInfo.id
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
})