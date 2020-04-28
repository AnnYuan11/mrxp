// pages/details/Goodsdetails/details.js
import { Base } from "../../../utils/request/base.js";
var WxParse = require('../../../utils/wxParse/wxParse.js');
var util = require('../../../utils/util.js');
const { $Message } = require('../../../dist/base/index');
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    currentTab: 0,
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    duration: 500,
    ishow:false,
    maskHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      id:options.id,
      isBuy:options.isBuy
    })
    that.shop();//商品内容
    that.buyRecord()//购买记录
    that.fanNum()//修改粉丝数
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#fff")
    context.fillRect(0, 0, 375, 667)
    var path = "/img/pic/11.jpg";
    context.drawImage(path, 56, 56, 262, 349);
    var path5 = "/img/pic/1.png";
    var path2 = "/img/pic/2.png";
    var name = that.data.name;
    context.drawImage(path2, 56, 400, 263, 121);
  
    //绘制左下角文字
    context.setFontSize(14);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("长按识别小程序", 70, 560);
    context.stroke();
    context.setFontSize(14);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("跟我一起来学习吧~~", 70, 580);
    context.stroke();
   
    //绘制右下角小程序二维码
    context.drawImage(path5, 230, 530,80,80);

    context.draw();
    //将生成好的图片保存到本地
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          console.log(res)
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
      if (!res.authSetting['scope.writePhotosAlbum']) {
      wx.authorize({
        scope:'scope.writePhotosAlbum',
        success() {
        console.log('授权成功')
      }
      })
      }
      }
      })
      
    
    console.log(that.data.imagePath)
    wx.downloadFile({
      url:that.data.imagePath,
      success:function(res){
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
           console.log(res)
            wx.showModal({
              content: '海报已保存到相册',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  /* 该隐藏的隐藏 */
                  that.setData({
                    maskHidden: false
                  })
                }
              },
               fail: function (res) {
                console.log(11111)
              }
            })
          },
          fail:function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
            wx.openSetting({
            success(settingdata) {
            console.log(settingdata)
            if (settingdata.authSetting['scope.writePhotosAlbum']) {
            console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
            }else {
            console.log('获取权限失败，给出不给权限就无法正常使用的提示')
            }
            }
            })
            
            }
          
          }









        })
      }
    })
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      ishow:false
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

  },
  // 详情切换
  swichNav: function (e) {
    var that = this;
    console.log(e)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 商品内容
  shop(){
    var that = this;
    var params = {
      url: '/app/commodity/findCommodityInfo',
      method: 'GET',
      data: {
        'id':that.data.id, 
      },
      sCallBack: function (data) {
        if(data.data.result.sendType==1){
          data.data.result.sendType="到店自提"
        }else{
          data.data.result.sendType="快递到家"
        }
        if(data.data.result.pickDate==1){
          that.getDateStr(null,0)
          var date=that.data.tomorow
          data.data.result.pickDate=date
        }else if(data.data.result.pickDate==2){
          that.getDateStr(null,1)
          var tomorow=that.data.tomorow
          data.data.result.pickDate=tomorow
        }else{
          that.getDateStr(null,2)
          var ht=that.data.tomorow
          data.data.result.pickDate=ht
        }
        var artice = data.data.result.productInfo.content;
        WxParse.wxParse('artice', 'html', artice, that, 5);
        that.setData({
          list:data.data.result,
          background:JSON.parse(data.data.result.bannerPhotoView)
        })
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 立即购买
  buyNow(){
    var session=wx.getStorageSync("session")
    console.log(session)
    var that=this;
    if(session==''){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
      var ddid = that.data.list.id;
      var ddpic = that.data.list.productInfo.photo;
      var ddname = that.data.list.productInfo.commodityName;
      var ddjg = that.data.list.price;
      var sendType =that.data.list.sendType;
      wx.navigateTo({
        url: '/pages/details/order_details/order_details?ddid='+ddid+'&ddname='+ddname+'&ddpic='+ddpic+'&ddjg='+ddjg+'&sendType='+sendType+'&commodityNumber=1',
      })
    }
   
    
  },
  // 首页
  toIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
// 跳转到购物车
toGwc(){
  wx.switchTab({
    url: '/pages/gwc/gwc',
  })
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
// 购买记录
buyRecord(e){
  var that=this;
  var params = {
    url: '/app/commodity/findCommodityInfoOrderRecord',
    method: 'GET',
    data: {
     id:that.data.id
    },
    sCallBack: function (data) {
      if(data.data.errorCode=='0'){
        that.setData({
          RecordList:data.data.result
        })
      } 
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 修改粉丝数
fanNum(){
  var that=this;
  var userId = wx.getStorageSync('userId')
  var params = {
    url: '/app/commodity/addCommodityInfoFan',
    method: 'POST',
    data: {
      'commodityInfo':{
        'id':that.data.id
      },
      'userInfo':{
        'id':userId
      }
    },
    sCallBack: function (data) {
      
      
    },
    eCallBack: function () {
    }
  }
  base.request(params);
},
// 分享
handleOpen1 () {
  this.setData({
      ishow: true
  });
},
// 取消
handleCancel () {
  this.setData({
      ishow: false
  });
},
// 生成海报
handleClickItem1 () {
  var that = this;
  this.setData({
    maskHidden: false
  });
  wx.showToast({
    title: '海报生成中...',
    icon: 'loading',
    duration: 1000
  });
  setTimeout(function () {
    wx.hideToast()
    that.createNewImg();
    that.setData({
      maskHidden: true,
      ishow:false
    });
  }, 1000)
},
})