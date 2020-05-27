// pages/details/topay/topay.js
import { Base } from "../../../utils/request/base.js";
var base = new Base();
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: app.globalData.imgUrl,
        imgUrls: app.globalData.imgUrls,
        color: app.globalData.color,
        payTypes: 2, //默认微信支付
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        let pages = getCurrentPages(); //获取当前页面pages里的所有信息。
        let prevPage = pages[pages.length - 2];
        var url = prevPage.route // 获取上一个页面的路径
        console.log(prevPage)

        // debugger
        if (url == 'pages/details/order_list/order_list') {

            that.setData({
                name: prevPage.data.message.commoditySubOrderInfoList[0].commodityInfo.productInfo.commodityName,
                money: prevPage.data.message.needMoney,
                message: prevPage.data.message,
            })
        } else {

            that.setData({
                name: prevPage.options.ddname,
                message: prevPage.data.message,
                money: prevPage.data.message.paymentMoney
            })
        }

        console.log(that.data.message)
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

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    // 支付方式
    radioChange: function(e) {
        console.log(e)
        var that = this;
        that.setData({
            payTypes: e.detail.value
        })
    },

    //授权
    subTap: function() {
        let that = this;
        wx.requestSubscribeMessage({
            tmplIds: ['bGUjPW83BRA1EURp3HZSN8c6iqW2oW79gxJYde6PTtk', '8GrE3m5Osels_WYTv4LTH-GCMQayU-WqPBEmIDXA62w', '4t172N9EaSaLlbmRvUzR5OWgJusC_FZrHKzHFV_Sk-I'],
            success(res) {
                if (that.data.payTypes == '2') {
                    that.pay()
                } else {
                    that.payYe(that.data.message.orderNumber)
                }
            },
            fail(res) {
                if (that.data.payTypes == '2') {
                    that.pay()
                } else {
                    that.payYe(that.data.message.orderNumber)
                }
            }
        })
    },


    // 去付款
    Recharge() {
        var that = this;
        that.subTap()
            // if(that.data.payTypes=='2'){
            //   that.pay()
            // }else{
            //   that.payYe(that.data.message.orderNumber)
            // }
    },
    //微信支付
    pay() {
        var that = this;
        wx.showLoading({
            title: '支付中',
        })
        var openId = wx.getStorageSync('openId')
        var arg = {
            id: that.data.message.id,
            name: that.data.name,
            payType: 2,
            type: '1',
            openId: openId
        }
        console.log(JSON.stringify(arg))
        var params = {
            url: '/app/payment/getOrderStr',
            method: 'POST',
            data: arg,
            sCallBack: function(data) {
                console.log(data)

                wx.hideLoading({
                    complete: (res) => {},
                })
                if (data.data.errorCode == '0') {
                    wx.requestPayment({
                        appId: 'wx874be472f0a6147b',
                        timeStamp: data.data.result['timeStamp'],
                        nonceStr: data.data.result['nonceStr'],
                        package: data.data.result['packageValue'],
                        signType: 'MD5',
                        paySign: data.data.result['paySign'],
                        'success': function(res) {
                            console.log(res)
                            that.delItem()
                            wx.showToast({
                                title: '已支付成功！',
                                icon: 'none',
                                duration: 2000,
                                success: function() {
                                    setTimeout(function() {
                                        wx.redirectTo({
                                            url: 'pay_success?orderId=' + that.data.message.id,
                                        })
                                    }, 2000);
                                    // setTimeout(function () {
                                    //   wx.redirectTo({
                                    //     url: '/pages/details/order_list/order_list',
                                    //   })
                                    // }, 2000);

                                }
                            })
                        },
                        fail: function(e) {
                            console.log(e)
                        }
                    })
                } else {
                    wx.showToast({
                        title: data.data.errorMsg,
                        icon: 'none',
                        duration: 2000,
                        success: function() {
                            setTimeout(function() {
                                wx.navigateBack({

                                    delta: 2

                                })
                            }, 2000);

                        }
                    })
                }

            },
            eCallBack: function() {}
        }
        base.request(params);
    },
    delItem(id) {
        var idslist = wx.getStorageSync('productInfo')

        var ids = [];
        if (idslist) {
            console.log(idslist)
            idslist.productList.forEach(item => {
                ids.push(item.ids)
            });
            console.log(ids)
            let that = this
            var params = {
                url: '/app/commodity/deleteShoppingCartInfo',
                method: 'POST',
                data: {
                    'ids': ids,
                },
                sCallBack: function(data) {
                    if (data.data.errorCode == 0) {

                        app.getShopNum()
                    } else {

                    }
                },
                eCallBack: function() {}
            }
            base.request(params);
        }

    },
    // 余额支付
    payYe(orderNumber) {
        var that = this;
        wx.showLoading({
            title: '支付中',
        })
        var userId = wx.getStorageSync('userId')
        var arg = {
            'userInfo': {
                'id': userId,
            },
            'orderNumber': orderNumber
        }
        var params = {
            url: '/app/order/updateCommodityOrderInfoPaymentStatusYe',
            method: 'POST',
            data: JSON.stringify(arg),
            sCallBack: function(data) {
                wx.hideLoading({
                    complete: (res) => {},
                })
                console.log(data)
                if (data.data.errorCode == '-1') {
                    wx.showToast({
                        title: data.data.errorMsg,
                        icon: 'none'
                    })
                } else if (data.data.errorCode == '-200') {
                    wx.showToast({
                        title: data.data.errorMsg,
                        icon: 'none'
                    })
                } else {
                    that.delItem()
                    wx.showToast({
                        title: '订单支付成功',
                        icon: 'none',
                        duration: 2000,
                        success: function() {
                            setTimeout(function() {
                                wx.redirectTo({
                                    url: 'pay_success?orderId=' + that.data.message.id,
                                })
                            }, 2000);
                            // setTimeout(function() {
                            //     wx.redirectTo({
                            //         url: '/pages/details/order_list/order_list',
                            //     })
                            // }, 2000);

                        }
                    })
                }

            },
            eCallBack: function() {}
        }
        base.request(params);

    },

})