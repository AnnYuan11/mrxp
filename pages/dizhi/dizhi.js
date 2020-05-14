// pages/dizhi/dizhi.js
import { Base } from "../../utils/request/base.js";
var base = new Base();
var app = getApp();

function grouponcountdown(that, end_time, param) {
  var EndTime = new Date(end_time).getTime();
  var NowTime = new Date().getTime();

  var total_micro_second = EndTime - NowTime;

  var groupons = that.data.groupon;
  groupons[param].updateOrderTime4 = dateformat(total_micro_second);
  if (total_micro_second <= 0) {
      groupons[param].updateOrderTime4 = "已结束"
  }
  that.setData({
      groupon: groupons
  })
  setTimeout(function () {
      grouponcountdown(that, end_time, param);
  }, 1000)
}

// 时间格式化输出，每1s都会调用一次
function dateformat(micro_second) {
  // 总秒数
  var second = Math.floor(micro_second / 1000);
  // 天数
  var day = Math.floor(second / 3600 / 24);
  // 小时
  var hr = Math.floor(second / 3600 % 24);
  var hrStr = hr.toString();
  if (hrStr.length == 1) hrStr = '0' + hrStr;

  // 分钟
  var min = Math.floor(second / 60 % 60);
  var minStr = min.toString();
  if (minStr.length == 1) minStr = '0' + minStr;

  // 秒
  var sec = Math.floor(second % 60);
  var secStr = sec.toString();
  if (secStr.length == 1) secStr = '0' + secStr;

  if (day <= 1) {
      return "剩 " + hrStr + ":" + minStr + ":" + secStr;
  } else {
      return "剩 " + day + " 天 " + hrStr + ":" + minStr + ":" + secStr;
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
      groupon:[]
  },
  //拼团详情
  toSpellingDetail:function(e){
    wx.navigateTo({
        url: '/pages/spelling/spellingDetail?id='+e.currentTarget.id,
    })
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
                  var end_time = data[i].updateOrderTime4.replace(/-/g, '/')
                  grouponcountdown(that,end_time, i)
              }
          console.log(that.data.groupon)
  
  
  
        },
        eCallBack: function () {}
      }
      base.request(params);
  },
})