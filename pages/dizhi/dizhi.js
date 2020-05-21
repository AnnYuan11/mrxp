// pages/dizhi/dizhi.js
import { Base } from "../../utils/request/base.js";
var base = new Base();
var app = getApp();
//距结束时间
var endSecond = []
var timeOut
var supOpenid = ''


Page({

  /**
   * 页面的初始数据
   */
  data: {
     
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      var that = this;
      var id = wx.getStorageSync('userId')
      var params = {
        url: '/app/order/listCommodityOrderInfo',
        method: 'POST',
        data: {
          'pageIndex': 1,
          'pageSize':10,
          'userInfo': {
            'id': id
          },
          'orderStatus': 4,
        },
        sCallBack: function (data) {
         
          var groupon = data.data.result.datas;
          groupon.forEach((item,i) => {
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
  
         
          that.setData({
            
            groupon: data.data.result.datas,
            totalCount: data.data.result.rowCount, //总的数据条数
            pagecount: data.data.result.totalPages //总页数
          })
          var data = that.data.groupon
              //列表获取到数据进行遍历
              for (var i = 0; i < data.length; i++) {
                var dateTime=new Date(data[i].updateOrderTime4);
                  dateTime=dateTime.setDate(dateTime.getDate()+1);
                  dateTime=new Date(dateTime)
                  data[i].updateOrderTime4=data[i].updateOrderTime4.substring(0, 10).replace(data[i].updateOrderTime4.substring(0, 10),dateTime.toLocaleDateString())+data[i].updateOrderTime4.substring(10, 20)
                  var end_time = data[i].updateOrderTime4
                  endSecond.push("2020-5-22 09:56:25","2020-5-22 10:56:25","2020-5-22 15:56:25",)
                 
              }
              that.setData({endSecond: endSecond })
              that.countdownEnd()
          console.log(endSecond)
  
  
  
        },
        eCallBack: function () {}
      }
      base.request(params);
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
          G_TYPE: o.G_TYPE
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
          state: 1,
          G_TYPE: o.G_TYPE
        }
        that.setData({
          buyState: 1
        })
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    that.setData({
      endCountDownList: countDownArr
    })
    // console.log('endCountDownList', that.data.endCountDownList)
    timeOut = setTimeout(function () {
      that.countdownEnd();
    }, 1000)
  }
})