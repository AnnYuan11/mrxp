// pages/sjrz/sjrz.js
import WxValidate from '../../../utils/WxValidate'
import { Base } from "../../../utils/request/base.js";
var app = getApp();
var base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: getApp().globalData.color,
    imgUrl:getApp().globalData.imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
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
      var params = {
        url: '/app/head/addSupplierInfo',
        method: 'POST',
        data: Deparams,
        sCallBack: function (data) {
          if (data.data.errorCode == 0) {
            wx.showToast({
              title: data.data.result
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
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
      supplieName:{
        required: true,
      },
      contactName: {
        required: true,
      },
      phone: {
        required: true,
        tel: true,
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      supplieName:{
        required: '请填写供应商名称',
      },
      contactName: {
        required: '请填写申请人姓名'
      },
      phone: {
        required: '请填写申请人手机号',
        tel: '请输入正确的手机号',
      }
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

  },
})