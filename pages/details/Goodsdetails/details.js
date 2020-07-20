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
    imgUrls: app.globalData.imgUrls,
    currentTab: 0,
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    duration: 500,
    ishow:false,
    maskHidden: false,
    interval:3000,
    topprice:true,
    iscanvas:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 分享
    wx.showShareMenu({
      withShareTicket: false,
      complete: function(res) {
        console.log("11111111")
      }
    })
    var that = this;
    if (options.scene) {
      var code=options.scene.substring(0,6)
      var phone=options.scene.substring(9,20)
      that.setData({
        code:code,
        phone:phone
      })
      that.shop2()
      that.spxx()
    }else{
      that.setData({
        id:options.id,
        personal:app.globalData.personal,
        qhdzid: options.zdtid,
        sharephone:options.sharephone
      })
    }
    console.log(options)
    
    
    that.shop();//商品内容
    that.buyRecord()//购买记录
    that.fanNum()//修改粉丝数
    that.gwzn()//购物指南
    
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var userId = wx.getStorageSync('userId')
    console.log(that.data.qhdzid)
    var headInfo = wx.getStorageSync('headInfo')
    console.log(that.data.qhdzid)
    if(that.data.qhdzid==undefined||that.data.qhdzid=='111'){
      if(headInfo){
        that.setData({
          shopName: headInfo.shopName,
          sharephone: headInfo.phone,
          ztdid:headInfo.id,
        })
      }else{
        that.query() 
      }
      
    }else{  
      that.spxx2()
    }

    that.setData({
      ishow:false
    })
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
    console.log(res)
    var that=this;
    var zdtid = wx.getStorageSync('zdtid')
    console.log(that.data.shopName)
    console.log(that.data.imgUrl+'/'+that.data.imgPath)
    // if(that.data.imgPath!=''||that.data.imgPath!=undefined){
      
    // }
    // if(res.from==='button'){
      return {
        imageUrl: that.data.imgUrl+'/'+that.data.imgPath,
        title: this.data.list.productInfo.commodityName,
        path: '/pages/details/Goodsdetails/details?zdtid=' + zdtid+'&sharephone='+that.data.sharephone+'&id='+that.data.id,
      }
  // }
   
  },

  // 详情切换
  swichNav: function (e) {
    var that = this;
  
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
    wx.showLoading({
      title: '加载中',
    })
    var params = {
      url: '/app/commodity/findCommodityInfo',
      method: 'GET',
      data: {
        'id':that.data.id, 
      },
      sCallBack: function (data) {
        console.log(data)
        wx.hideLoading({
          complete: (res) => {},
        })
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
        if (data.data.result.isBuy == 2) {
          data.data.result.isBuy = "提前加入购物车"
        } else if (data.data.result.isBuy == 3) {
          data.data.result.isBuy = "活动已结束"
        } else if (data.data.result.isBuy == 4) {
          data.data.result.isBuy = "已售罄"
        }
        var artice = data.data.result.productInfo.content;
        WxParse.wxParse('artice', 'html', artice, that, 5);
        that.setData({
          list:data.data.result,
          commodityCode:data.data.result.commodityCode,
          // background:JSON.parse(data.data.result.bannerPhotoView)
        })
        if(data.data.result.bannerPhotoView!=''){
          that.setData({
           
            background:JSON.parse(data.data.result.bannerPhotoView)
          })
        }
        that.eventDraw2()
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 根据返回code调用商品信息
  shop2(){
    var that = this;
    var params = {
      url: '/app/commodity/findCommodityInfoByCode',
      method: 'GET',
      data: {
        'commodityCode':that.data.code, 
      },
      sCallBack: function (data) {
        console.log(data)
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
        if (data.data.result.isBuy == 2) {
          data.data.result.isBuy = "提前加入购物车"
        } else if (data.data.result.isBuy == 3) {
          data.data.result.isBuy = "活动已结束"
        } else if (data.data.result.isBuy == 4) {
          data.data.result.isBuy = "已售罄"
        }
        var artice = data.data.result.productInfo.content;
        WxParse.wxParse('artice', 'html', artice, that, 5);
        that.setData({
          list:data.data.result,
          id:data.data.result.id,
          commodityCode:data.data.result.commodityCode,
          background:JSON.parse(data.data.result.bannerPhotoView)
        })
       that.buyRecord()
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 根据电话获取商铺信息
  spxx(){
    var that = this;
    var userId = wx.getStorageSync('userId')
    var params = {
      url: '/app/head/findHeadInfoByPhone',
      method: 'GET',
      data: {
         'phone':that.data.phone 
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
        // if (that.data.qhdzid!=undefined&&that.data.qhdzid!='111') {
        //   console.log(userId)
        //   if(userId){
        //       that.change()
        //   }else{
        //     that.search(that.data.options.shopName)
        //   }
        // }else{
        //   that.query() 
        // }
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  // 立即购买
  buyNow(){
    var session=wx.getStorageSync("session")
 
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
      var pickDate=that.data.list.pickDate
      wx.navigateTo({
        url: '/pages/details/order_details/order_details?ddid='+ddid+'&ddname='+ddname+'&ddpic='+ddpic+'&ddjg='+ddjg+'&sendType='+sendType+'&commodityNumber=1'+'&pickDate='+pickDate,
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
      var orderList=data.data.result.orderList;
      orderList.forEach(element => {
        if(element.nick_name.length>1){
          element.nick_name=element.nick_name.substr(0, 1)+'***'+element.nick_name.substr(-1)
        }
      });
      if(data.data.errorCode=='0'){
        that.setData({
          orderList:orderList,
          RecordList:data.data.result
        })

        // console.log(data.data.result.orderList[0].nick_name.length)
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
  that.setData({
    maskHidden: false,
    iscanvas:false
  });
  console.log(that.data.iscanvas)
  // wx.showToast({
  //   title: '海报生成中...',
  //   icon: 'loading',
  //   duration: 1000
  // });
    that.eventDraw();
    that.setData({
      maskHidden: true,
      ishow:false,
      // iscanvas:true
    });
  // setTimeout(function () {
    
  // }, 100)
},

eventDraw () {
  
  var that=this;
  var path = that.data.imgUrl+that.data.background[0];
  // var shopName = that.data.shopName;
  var ztdid = that.data.ztdid;
  var id=that.data.id  
  var headInfo=wx.getStorageSync('headInfo')
  console.log(headInfo.phone)
  wx.showLoading({
    title: '绘制分享图片中',
    mask: true
  })
  wx.getSystemInfo({
    success: function (res) {
      that.setData({
        width: res.windowWidth,
        height: res.windowHeight
      })
    }
  })
  this.setData({
    painting: {
      width: that.data.width,
      height: that.data.height,
      clear: true,
      views: [
        {
          type: 'rect',
          background:'#fff',
          top: 0,
          left: 0,
          width: 375,
          height: 565
        },
        {
          type: 'image',
          // url: that.data.imgUrl+'img/new/logoo.png',
          url: '/img/new/logoo.png',
          top: 27.5,
          left: 29,
          width: 300,
          height: 57
        },
        {
          type: 'image',
          url: path,
          top: 90,
          left: 38,
          width: 300,
          height: 300
        },
        {
            type: 'image',
            url: 'http://39.101.190.182:8080/app/getCommodityCodeAndHeadPhoneWxQr?commodityCode='+that.data.commodityCode+'&headPhone='+headInfo.phone,
            top: 470,
            left: 50,
            width: 70,
            height: 70
          },
        {
          type: 'text',
          content: that.data.list.productInfo.commodityName,
          fontSize: 16,
          lineHeight: 21,
          color: '#383549',
          textAlign: 'left',
          top: 400,
          left: 44,
          width: 287,
          MaxLineNumber: 2,
          breakWord: true,
          bolder: true
        },
        {
          type: 'text',
          content: '￥'+that.data.list.price,
          fontSize: 19,
          color: '#E62004',
          textAlign: 'left',
          top: 445,
          left: 44.5,
          bolder: true
        },
        {
          type: 'text',
          content: '￥'+that.data.list.crossedPrice,
          fontSize: 13,
          color: '#7E7E8B',
          textAlign: 'left',
          top: 450,
          left: 115,
          textDecoration: 'line-through'
        },
        {
          type: 'text',
          content: '预售时间：' + that.data.list.startTime.substring(5, 7) + '月' + that.data.list.startTime.substring(8, 10) + '日',
          fontSize: 13,
          color: '#7E7E8B',
          textAlign: 'left',
          top: 450,
          left: 175
        },
        {
          type: 'text',
          content: '长按识别图中二维码',
          fontSize: 14,
          color: '#383549',
          textAlign: 'left',
          top: 520,
          left: 165.5,
          lineHeight: 20,
          MaxLineNumber: 2,
          breakWord: true,
          width: 125
        },
        {
          type: 'text',
          content: that.data.shopName,
          fontSize: 16,
          color: '#232323',
          textAlign: 'left',
          top: 480,
          left: 165.5,
          lineHeight: 20,
          MaxLineNumber: 2,
          breakWord: true,
          width: 170
        }
      ]
    },
   
  })
},

eventGetImage (event) {
  wx.hideLoading()
  const { tempFilePath, errMsg } = event.detail
  if (errMsg === 'canvasdrawer:ok') {
    this.setData({
      shareImage: tempFilePath
    })
  }
},

// 保存图片
eventSave () {
  wx.saveImageToPhotosAlbum({
    filePath: this.data.shareImage,
    success (res) {
      wx.showToast({
        title: '保存图片成功',
        icon: 'success',
        duration: 2000
      })
    }
})
},
// 关闭图片
close(){
  var that=this;
  that.setData({
    maskHidden:false
  })
},

  // 购物指南
  gwzn(){
    var that=this;
    var params = {
      url: '/app/commodity/findShoppingGuide',
      method: 'GET',
      data: {

      },
      sCallBack: function (data) {
      
       that.setData({
         gwzns:data.data.result.photo
       })
       
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  spxx2() {
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
        
      },
      eCallBack: function () {
      }
    }
    base.request(params);
  },
  eventDraw2 () {
    var that=this;
    var path = that.data.imgUrl+that.data.background[0];
    this.setData({
      painting2: {
        width: 200,
        height: 150,
        clear: true,
        views: [
          {
            type: 'rect',
            background:'#fff',
            top: 0,
            left: 0,
            width: 200,
            height: 150
          },
          // {
          //   type: 'text',
          //   content: that.data.list.productInfo.commodityName,
          //   fontSize: 20,
          //   lineHeight: 30,
          //   color: '#383549',
          //   textAlign: 'left',
          //   top: 0,
          //   left: 44,
          //   width: 287,
          //   MaxLineNumber: 2,
          //   breakWord: true,
          //   bolder: true
          // },
          {
            type: 'image',
            url: path,
            top: 0,
            left: 18,
            width: 150,
            height: 100
          },
          {
            type: 'text',
            content: '价格￥'+that.data.list.price,
            fontSize: 14,
            color: '#E62004',
            textAlign: 'left',
            top: 130,
            left: 0,
            bolder: true
          },
          {
            type: 'text',
            content: '￥'+that.data.list.crossedPrice,
            fontSize: 12,
            color: '#7E7E8B',
            textAlign: 'left',
            top: 132,
            left: 80,
            textDecoration: 'line-through'
          },
          {
            type: 'text',
            content: '到货:'+that.data.list.pickDate,
            fontSize: 12,
            color: '#7E7E8B',
            textAlign: 'left',
            top: 132,
            left: 120
          },
         
        ]
      }
    })
  },
  eventGetImage2 (event) {
    console.log(event)
    
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage2: tempFilePath
      })
    }
    this.draw_uploadFile(this.data.shareImage2)
  },
  draw_uploadFile: function (tempFilePath) { //wx.uploadFile 将本地资源上传到开发者服务器
    let that = this;
    console.log(tempFilePath)
    wx.uploadFile({
      url: 'http://39.101.190.182:8080/app/fileUploadLocal', //线上接口
      filePath: tempFilePath,
      name: 'file',
      success: function (res) {
        console.log(res);
        if(res.statusCode==200){
          
          res.data = JSON.parse(res.data);
          console.log(res.data)
          let imgsrc = res.data.result.path[0];
          that.setData({
            imgPath: imgsrc
          });
        }else{
          console.log('失败')
        }
      },
    })
  },
})