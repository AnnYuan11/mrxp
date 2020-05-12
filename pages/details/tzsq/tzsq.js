// pages/details/tzsq/tzsq.js
import WxValidate from '../../../utils/WxValidate'
import { Base } from "../../../utils/request/base.js";
var url='https://www.zgmrxp.com'
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.color,
    imgUrl:getApp().globalData.imgUrl,
    multiArray: [],
    multiIndex: [0, 0, 0, 0],
    chinaData: [],
    address: '请选择详细地址',
    supervisorInfo: {
      phone: ''
    },
    imgArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getSiteData()
    that.initValidate()
    // console.log(that.WxValidate)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onShareAppMessage: function () {

  },
  bindMultiPickerChange: function (e) {
    console.log(e);
    var that = this;
    var province = e.detail.value[0]
    var city = e.detail.value[1]
    var county = e.detail.value[2]
    var village = e.detail.value[3]
    that.setData({
      province: that.data.multiArray[0][province],
      city: that.data.multiArray[1][city],
      area: that.data.multiArray[2][county],
      street: that.data.multiArray[3][village]
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var move = e.detail;
    var index = move.column;
    var value = move.value;
    if (index == 0) {
      this.setData({
        multiIndex: [value, 0, 0, 0]
      })
      this.getCity();
    }
    if (index == 1) {
      this.setData({
        "multiIndex[1]": value,
        "multiIndex[2]": 0,
        "multiIndex[3]": 0
      })
      this.getXian();
    }
    if (index == 2) {
      this.setData({
        "multiIndex[2]": value,
        "multiIndex[3]": 0,

      })
      this.getZhen();
    }
    if (index == 3) {
      this.setData({
        "multiIndex[3]": value
      })
      this.getZhen();
    }
  },
  getSiteData: function() {
    var that = this;
    if(wx.getStorageSync("chinaData")){
      var chinaData = wx.getStorageSync("chinaData");
      that.initData(chinaData);
    }else{
      wx.request({
        url: 'https://www.zgmrxp.com/city.json',
        success: res=> {
          console.log(res);
          var chinaData = res.data;
          wx.setStorage({
            key: "chinaData",
            data: res.data
          });
          that.initData(chinaData);
        }
      })
    }
  
  },
  initData: function(chinaData){
    var that=this;
    var qxz={'name':"请选择",'children':[{'name':'','children':[{'name':'','children':[{'name':''}]}]}]}
          chinaData.unshift(qxz)
          console.log(chinaData)
          this.data.chinaData = chinaData;
          var sheng = []; //  设置省数组
          for(var i = 0; i < chinaData.length; i++) {
            sheng.push(chinaData[i].name);
          }
          this.setData({
            "multiArray[0]": sheng
          })
          console.log(that.data.multiArray[0][0])
          that.getCity(); // 得到市
  },
  getCity: function () { //  得到市
    var shengNum = this.data.multiIndex[0];
    var chinaData = this.data.chinaData;
    var cityData = chinaData[shengNum].children;
    var city = [];
    for (var i = 0; i < cityData.length; i++) {
      city.push(cityData[i].name)
    }
    this.setData({
      "multiArray[1]": city,
      // city: city
    })
    this.getXian();
  },
  getXian: function (e) { //  得到县
    var shengNum = this.data.multiIndex[0];
    var cityNum = this.data.multiIndex[1];
    var chinaData = this.data.chinaData;
    var xianData = chinaData[shengNum].children[cityNum].children;
    var xian = [];
    for (var i = 0; i < xianData.length; i++) {
      xian.push(xianData[i].name)
    }
    this.setData({
      "multiArray[2]": xian,
      // area: xian
    })
    this.getZhen();
  },
  getZhen: function () { //  得到镇
    var shengNum = this.data.multiIndex[0];
    var cityNum = this.data.multiIndex[1];
    var xianNum = this.data.multiIndex[2];
    var chinaData = this.data.chinaData;
    var zhenData = chinaData[shengNum].children[cityNum].children[xianNum].children;
    var zhen = [];
    for (var i = 0; i < zhenData.length; i++) {
      zhen.push(zhenData[i].name)
    }
    this.setData({
      "multiArray[3]": zhen,
      // street: zhen
    })
  },
  getCenterLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          'address': res.address,
          'latitude':res.latitude,
          'longitude':res.longitude
        })

      }
    })
  },
  // 信息提示
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  // 提交
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const Deparams = e.detail.value;
    if (!this.WxValidate.checkForm(Deparams)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      var that = this;
      that.upload();
      var params = {
        url: '/app/head/addHeadInfo',
        method: 'POST',
        data: {
          'province': that.data.province,
          'city': that.data.city,
          'area': that.data.area,
          'street': that.data.street,
          'address': e.detail.value.address,
          'headName': e.detail.value.headName,
          'phone': e.detail.value.phone,
          'shopName': e.detail.value.shopName,
          'lat':that.data.latitude,
          'lng':that.data.longitude,
          'personNumber':e.detail.value.wxnum,
          'supervisorInfo': {
            'phone': e.detail.value.supervisorInfo
          }
        },
        sCallBack: function (data) {
          if(data.data.errorCode == 0) {
            wx.showToast({
              title: data.data.result
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },2000)
          } else {
            wx.showToast({
              title: data.data.errorMsg
            })
          }
        },
        eCallBack: function () {
        }
      }
      base.request(params);
    }
  },
  // 必填校验
  initValidate() {
    // 验证字段的规则
    const rules = {
      headName: {
        required: true,
      },
      phone: {
        required: true,
        tel: true,
      },
      address: {
        required: true,
      },
      shopName: {
        required: true,
      },
      wxnum:{
        required: true,
      },
      supervisorInfo: {
        required: true,
        tel: true,
      },
      street: {
        required: true,
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      headName: {
        required: '请填写申请人姓名'
      },
      phone: {
        required: '请填写申请人手机号',
        tel: '请输入正确的手机号',
      },
      address: {
        required: '请选择团长详细地址',
      },
      wxnum: {
        required: '请填写数字'
      },
      shopName: {
        required: '请填写店铺名称',
      },
      supervisorInfo: {
        required: '请填写推荐人的电话',
        tel: '请输入正确的手机号',
      },
      street: {
        required: '请选择团长地址',
      }
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

  },
  // 上传图片
  addImg: function () {
    var that = this;
    var imgArr = that.data.imgArr;
    wx.chooseImage({
        count: 1, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'],
        success: function (res) {
          console.log(res)
            var tempFilePaths = res.tempFilePaths
            var imgsrc = res.tempFilePaths;
            imgArr = imgArr.concat(imgsrc);
            that.setData({
                imgArr: imgArr
            });

            console.log(tempFilePaths);
            console.log(that.data.imgArr)
        }
    })
},
  upload: function () {
    var that = this;
    for (var i = 0; i < that.data.imgArr.length; i++) {
        var filePath = that.data.imgArr[i];
        wx.uploadFile({
            url: url + '/app/fileUploadLocal',
            filePath: filePath,
            name: 'file',
            formData: {},
            header: { Cookie: that.data.loginData },
            success: function (res) {
                console.log(res);
                var data = res.data
                var datas = JSON.parse(data)
               
            }
        })
    }
},
 //预览照片
 previewImg: function (e) {
  var that = this;
  var index = e.currentTarget.dataset.index;

  wx.previewImage({
      current: that.data.imgArr[index], // 当前显示图片的http链接
      urls: that.data.imgArr // 需要预览的图片http链接列表
  })
  console.log(e.currentTarget.dataset)
},

deleteImg: function (e) {
  console.log(e)
  var that = this;
  console.log(that.data.imgArr)
  var imgs = this.data.imgArr;
  var index = e.currentTarget.dataset.index;
  imgs.splice(index, 1);

  this.setData({
      imgArr: imgs
  });
},
})