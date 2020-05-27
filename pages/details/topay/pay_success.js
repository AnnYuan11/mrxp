// pages/details/topay/pay_success.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: app.globalData.imgUrl,
        orderId: '',
        orderDetail: {},
        shopShareTitle: '',
        shopSharePhoto: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        var that = this; 
        wx.showShareMenu({ withShareTicket: true });
        var orderId = options.orderId;
        that.setData({
            orderId: orderId
        })
        that.getPic();
        that.getOrderDetail(orderId);

    },

    getOrderDetail: function(id) {
        var that = this;
        var params = {
            url: '/app/order/findCommodityOrderInfo',
            method: 'GET',
            data: {
                'id': id
            },
            sCallBack: function(data) {
                var orderDetail = data.data.result;

                that.setData({
                    orderDetail: orderDetail
                })


            },
            eCallBack: function() {}
        }
        base.request(params);
    },

    jumpIndex: function() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },

    // 获取分享图片
    getPic() {
        var that = this;
        var params = {
            url: '/app/findHeadInfoProperty',
            method: 'GET',
            data: {

            },
            sCallBack: function(data) {
                that.setData({
                    shopShareTitle: data.data.result.shopShareTitle,
                    shopSharePhoto: data.data.result.shopSharePhoto
                })

            },
            eCallBack: function() {}
        }
        base.request(params);
    },

    onShareAppMessage: function(res) {
        var that = this;
        if(res.from==='button'){
            return {
                title: '老板，我是' + that.data.orderDetail.userInfo.nickName + ',刚在店里买的商品请接单！',
                imageUrl: that.data.imgUrl + '/' + that.data.shopSharePhoto,
                // desc: '分享页面的内容',
                path: '/pages/details/orderDetailsck/ddxx?id=' + that.data.orderId // 路径，传递参数到指定页面。
            }
          }
       
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

   
})