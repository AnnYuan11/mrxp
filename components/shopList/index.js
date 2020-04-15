// components/navbar/index.js
import { Base } from "../../utils/request/base.js";
const app = getApp();
var base = new Base();
var bool = true;
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    shoppingType: {
      type: Number,
      value: '1'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    hasList: true,
    // 商品列表数据
    list: [],
    temlist: [],
    show_edit: "block",
    edit_name: "编辑",
    edit_show: "none",
    nums: '0',
    // 金额
    totalPrice: 0, // 总价，初始为0
    // 全选状态
    selectAllStatus: false, // 全选状态，默认全选
    submitBtn: '提交订单',
    isBool: true,
    currentPage: 1,//请求数据的页码
    size: 10,//每页数据条数
    totalCount: 0,//总是数据条数
    pagecount: 0,//总的页数
    // shoppingCarType: 1,
    imgUrl: app.globalData.imgUrl,
    ids: [],
  },
  lifetimes: {
    attached: function () {
      this.getShopList(this.data.shoppingType)
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            height: res.windowHeight + 20
          })
        }
      })
    }
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      // 价格方法
      this.count_price();
      this.getShopList(this.data.shoppingType)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
  * 当前商品选中事件
  */
    selectList(e) {
      var that = this;
      // 获取选中的radio索引
      var index = e.currentTarget.dataset.index;
      // 获取到商品列表数据
      var list = that.data.list;
      // 默认全选
      that.data.selectAllStatus = true;
      // 循环数组数据，判断----选中/未选中[selected]
      list[index].selected = !list[index].selected;
      // 如果数组数据全部为selected[true],全选
      for (var i = list.length - 1; i >= 0; i--) {
        if (!list[i].selected) {
          that.data.selectAllStatus = false;
          break;
        }
      }
      // 重新渲染数据
      that.setData({
        list: list,
        selectAllStatus: that.data.selectAllStatus
      })
      // 调用计算金额方法
      that.count_price();
    },
    // 编辑
    btn_edit  () {
      var that = this;
      if (bool) {
        that.setData({
          edit_show: "block",
          edit_name: "取消",
          show_edit: "none",
          submitBtn: '删除订单',
          isBool: false
        })
        bool = false;
      } else {
        that.setData({
          edit_show: "none",
          edit_name: "编辑",
          show_edit: "block",
          submitBtn: '提交订单',
          isBool: true
        })
        bool = true;
      }

    },
    // 删除
    deletes (e) {
      var that = this;
      const ids = [];
      const id = e.currentTarget.dataset.id;
      ids.push(id);
      wx.showModal({
        title: '提示',
        content: '确认删除吗',
        success: function (res) {
          if (res.confirm) {
            that.delItem(ids)
          } else {
            // console.log(res);
          }
        },
        fail: function (res) {
          // console.log(res);
        }
      })
    },
    delItem (id) {
      let that = this
      var params = {
        url: '/app/commodity/deleteShoppingCartInfo',
        method: 'POST',
        data: {
          'ids': id,
        },
        sCallBack: function (data) {
          if (data.data.errorCode == 0) {
            wx.showToast({
              title: data.data.result
            })
            that.getShopList(that.data.shoppingType)
            that.count_price()
            app.getShopNum()
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
    },
    deletrsTip () {
      wx.showToast({
        title: '请选择要删除的订单',
        icon: 'warn',
        duration: 2000
      })
    },
    /**
     * 购物车全选事件
     */
    selectAll(e) {
      // 全选ICON默认选中
      let selectAllStatus = this.data.selectAllStatus;
      // true  -----   false
      selectAllStatus = !selectAllStatus;
      // 获取商品数据
      let list = this.data.list;
      // 循环遍历判断列表中的数据是否选中
      for (let i = 0; i < list.length; i++) {
        list[i].selected = selectAllStatus;
      }
      // 页面重新渲染
      this.setData({
        selectAllStatus: selectAllStatus,
        list: list
      });
      // 计算金额方法
      this.count_price();
    },
    /**
     * 绑定加数量事件
     */
    btn_add(e) {
      //获取商品id  
      const id = e.currentTarget.dataset.id;
      // 获取点击的索引
      const index = e.currentTarget.dataset.index;
      // 获取商品数据
      let list = this.data.list;
      // 获取商品数量
      let num = list[index].commodityNumber;
      // 点击递增
      num = num + 1;
      list[index].commodityNumber = num;
      // 重新渲染 ---显示新的数量
      this.setData({
        list: list
      });
      // 计算金额方法
      this.count_price();
      this.setNum(id, num, this.data.shoppingType);
    },
    /**
     * 绑定减数量事件
     */
    btn_minus(e) {
      //获取商品id  
      const id = e.currentTarget.dataset.id;
      // 获取点击的索引
      const index = e.currentTarget.dataset.index;
      // 获取商品数据
      let list = this.data.list;
      // 获取商品数量
      let num = list[index].commodityNumber;
      // 判断num小于等于1  return; 点击无效
      if (num <= 1) {
        return false;
      }
      // else  num大于1  点击减按钮  数量--
      num = num - 1;
      list[index].commodityNumber = num;
      // 渲染页面
      this.setData({
        list: list
      });
      // 调用计算金额方法
      this.count_price();
      this.setNum(id, num, this.data.shoppingType);
    },
    /**
    **修改订单数量接口调用 
    */
    setNum(spid, commodityNumber, sendtype) {
      let that = this;
      var userId = wx.getStorageSync('userId')
      var params = {
        url: '/app/commodity/addShoppingCartInfo',
        method: 'POST',
        data: {
          'commodityInfo': {
            'id': spid
          },
          'commodityNumber': commodityNumber,
          'shoppingCarType': sendtype,
          'userInfo': {
            'id': userId
          }
        },
        sCallBack: function (data) {
          if (data.data.errorCode != 0) {
            wx.showToast({
              title: data.data.errorMsg
            })
          } else {
            app.getShopNum()
          }
        },
        eCallBack: function () {
        }
      }
      base.request(params);
    },
    /**
     * 计算总价
     */
    count_price() {
      let that = this
      // 获取商品列表数据
      let list = this.data.list;
      // 声明一个变量接收数组列表price
      let total = 0;
      let nums = 0;
      // 循环列表得到每个数据
      for (let i = 0; i < list.length; i++) {
        // 判断选中计算价格
        if (list[i].selected) {
          console.log(list[i])
          // 所有价格加起来 count_money
          total += list[i].commodityNumber * list[i].commodityInfo.productInfo.price;
          nums += list[i].commodityNumber
        }
      }
      // 最后赋值到data中渲染到页面
      that.setData({
        list: list,
        totalPrice: total.toFixed(2),
        nums: nums.toString()
      });

    },
    /*
    ** 全部删除
    */
    allDel() {
      var that = this;
      // 获取商品数据
      let price = Number(that.data.totalPrice.slice('.')[0])
      if (price == 0) {
        wx.showToast({
          title: '请选择要删除的订单',
          icon: 'warn',
          duration: 2000
        })
      } else {
        let list = that.data.list;
        // 循环遍历判断列表中的数据是否选中
        const ids = [];
        for (let i = 0; i < list.length; i++) {
          if (list[i].selected) {
            ids.push(list[i].id)
          }
        }
        wx.showModal({
          title: '提示',
          content: '确认删除吗',
          success: function (res) {
            if (res.confirm) {
              that.delItem(ids)
            } else {
              // console.log(res);
            }
          },
          fail: function (res) {
            // console.log(res);
          }
        })
      }
    },
    /**
    ** 购物车列表获取
    */
    getShopList(shoppingType) {
      var that = this;
      var id = wx.getStorageSync('userId')
      console.log(id)
      var params = {
        url: '/app/commodity/listShoppingCartInfo',
        method: 'POST',
        data: {
          'pageIndex': that.data.currentPage,
          'pageSize': that.data.size,
          'userInfo.id': id,
          'shoppingCarType': shoppingType
        },
        sCallBack: function (data) {
          if (data.data.errorCode == 0) {
            if (data.data.result.datas.length == 0) {
              that.setData({
                hasList: false
              })
              return false;
            } else {
              that.setData({
                hasList: true,
                list: data.data.result.datas, //初始化数据列表
              })
            }
            // if (that.data.list.length != 0) {
            //   wx.setTabBarBadge({
            //     index: 1,
            //     text: String(that.data.list.length)
            //   })
            // } else {
            //   wx.removeTabBarBadge({
            //     index: 1,
            //     text: ''
            //   })
            // }
          } else {
            wx.showToast({
              title: data.data.errorMsg
            })
          }
          console.log(data)
        },
        eCallBack: function () {
        }
      }
      base.request(params);
    },
    /**
    **提交订单
    */
    btn_submit_order () {

      var that = this;
      // 获取商品数据
      let price = Number(that.data.totalPrice.slice('.')[0])
      if (price == 0) {
        wx.showToast({
          title: '请选择要提交的订单',
          icon: 'warn',
          duration: 2000
        })
      } else {
        let list = that.data.list;
        // 循环遍历判断列表中的数据是否选中
        const ids = [];
        for (let i = 0; i < list.length; i++) {
          if (list[i].selected) {
            ids.push(list[i].id)
          }
        }
        wx.showModal({
          title: '提示',
          content: '确认删除吗',
          success: function (res) {
            if (res.confirm) {
              // that.submitItem(ids)
            } else {
              // console.log(res);
            }
          },
          fail: function (res) {
            // console.log(res);
          }
        })
      }
      // console.log(that.data.isBool)
      // console.log(that.data.totalPrice);
      // 调起支付
      // wx.requestPayment(
      //   {
      //     'timeStamp': '',
      //     'nonceStr': '',
      //     'package': '',
      //     'signType': 'MD5',
      //     'paySign': '',
      //     'success': function (res) { },
      //     'fail': function (res) { },
      //     'complete': function (res) { }
      //   })
    },
    //提交接口
    submitItem (id) {
      let that = this
      var params = {
        url: '/app/commodity/deleteShoppingCartInfo',
        method: 'GET',
        data: {
          'ids': id,
        },
        sCallBack: function (data) {
          if (data.data.errorCode == 0) {
            wx.showToast({
              title: data.data.result.datas
            })
            that.getShopList()
            that.count_price()
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
    },
    /**
    * 分页滚动加载
    */
    scrollLower () {
      var that = this
      // wx.showLoading({
      //   title: '数据加载中',
      //   icon: 'loading',
      // });
      // that.setData({
      //   pageNum: that.data.pageNum + 1,
      // });
      // if (that.data.tabListData.length >= that.data.total) {
      //   wx.showToast({
      //     title: '暂无更多数据了',
      //     icon: 'success',
      //     duration: 1000
      //   });
      //   return false;
      // } else {
      //   wx.showLoading({
      //     title: '加载中',
      //     icon: 'loading',
      //   });

      // }
    },
  }
})
