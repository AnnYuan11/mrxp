// pages/dizhi/dizhi.js
import { Base } from "../../utils/request/base.js";
var base = new Base();
var app = getApp();
Page({
  data: {
    countDownList: [],
    actEndTimeList: []
  },
  
  onLoad(){
   this.dth()
    // let endTimeList = [];
    // // 将活动的结束时间参数提成一个单独的数组，方便操作
    // goodsList.forEach(o => {endTimeList.push(o.actEndTime)})
    // this.setData({ actEndTimeList: endTimeList});
    // // 执行倒计时函数
    // this.countDown();

  },
  timeFormat(param){//小于10的格式化函数
    return param < 10 ? '0' + param : param; 
  },
  countDown(){//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = new Date(o).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0){
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      }else{//活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr})
    setTimeout(this.countDown,1000);
  },
 
  dth() {
    var that = this;
    var id = wx.getStorageSync('userId')
    var params = {
      url: '/app/order/listCommodityOrderInfo',
      method: 'POST',
      data: {
        'pageIndex': 1,
        'pageSize': 10,
        'userInfo': {
          'id': id
        },
        'orderStatus': 4,
      },
      sCallBack: function (data) {
        let endTimeList = [];

      
        
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
         
       
       
        var dateTime=new Date(item.updateOrderTime4);
        console.log(dateTime)
        dateTime=dateTime.setDate(dateTime.getDate()+1);
        dateTime=new Date(dateTime)
        item.updateOrderTime4=item.updateOrderTime4.substring(0, 10).replace(item.updateOrderTime4.substring(0, 10),dateTime.toLocaleDateString())+item.updateOrderTime4.substring(10, 20)
          // item.difftime = item.updateOrderTime4
          // endTimeList.push(item.updateOrderTime4)
          that.setData({ actEndTimeList: dthlist});
          // 执行倒计时函数
          that.countDown();
        })

        var temlist = that.data.dthlist; //原始的数据集合
        
        
        that.setData({
         
          dthlist: data.data.result.datas,
          totalCount: data.data.result.rowCount, //总的数据条数
          pagecount: data.data.result.totalPages //总页数
        })
        console.log(that.data.dthlist)



      },
      eCallBack: function () {}
    }
    base.request(params);
  },
})