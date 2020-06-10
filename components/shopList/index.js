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
    hasList: false,
    // 商品列表数据
    list: [],
    temlist: [],
    show_edit: "block",
    edit_name: "编辑",
    edit_show: "none",
    ischoose:true,
    nums: '0',
    // 金额
    totalPrice: 0, // 总价，初始为0
    // 全选状态
    selectAllStatus: false, // 全选状态，默认全选
    submitBtn: '提交订单',
    isBool: true,
    currentPage: 1,//请求数据的页码
    size: 1000,//每页数据条数
    totalCount: 0,//总是数据条数
    pagecount: 0,//总的页数
    // shoppingCarType: 1,
    imgUrl: app.globalData.imgUrl,
    imgUrls: app.globalData.imgUrls,
    ids: [],
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached: function () {
      this.getShopList(this.data.shoppingType)
      // this.AllShopList(this.data.shoppingType)
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            height: res.windowHeight
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
      this.setData({
        selectAllStatus: false,
        totalPrice: '0'
      })
    },
    hide() {
      var that = this;
      that.data.currentPage = 1
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
  * 当前商品选中事件
  */
    selectList(e) {
      console.log(e)
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
    btn_edit() {
      var that = this;
      if (bool) {
        if(that.data.ischoose==true){
          that.setData({
            edit_show: "block",
            edit_name: "取消",
            show_edit: "none",
            submitBtn: '删除订单',
            isBool: false,
            ischoose:false
          })
        }else{
          console.log("222")
        }
        
        bool = false;
      } else {
        that.setData({
          edit_show: "none",
          edit_name: "编辑",
          show_edit: "block",
          submitBtn: '提交订单',
          isBool: true,
          ischoose:true
        })
        bool = true;
      }
      that.count_price();
    },
    // 删除
    deletes(e) {
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
            // console.log(that.data.selectAllStatus)
          } else {
            // console.log(res);
          }
        },
        fail: function (res) {
          // console.log(res);
        }
      })
    },
    delItem(id) {
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
           
            that.setData({
              totalPrice: '0'
            })
            // that.count_price()
            app.getShopNum()
            that.data.currentPage=1
            that.getShopList(that.data.shoppingType)
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
    deletrsTip() {
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
        if(this.data.ischoose==true){
          if(list[i].isBuy!='2'){
            list[i].selected = selectAllStatus;
          }
        }else{
          list[i].selected = selectAllStatus;
        }
         
        
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
      var headInfo = wx.getStorageSync('headInfo')
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
          },
          "headInfo": {
            "id": headInfo.id //自提点id
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
      // console.log(list)
      // 循环列表得到每个数据
      for (let i = 0; i < list.length; i++) {
        // 判断选中计算价格
        if(that.data.ischoose==false){
          if (list[i].selected) {
            // 所有价格加起来 count_money
            total += list[i].commodityNumber * list[i].commodityInfo.price;
            nums += list[i].commodityNumber
          } 
        }else{
          if(list[i].isBuy=='1'){
            if (list[i].selected) {
            total += list[i].commodityNumber * list[i].commodityInfo.price;
            nums += list[i].commodityNumber
            }
          }
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
      wx.showLoading({
        title: '加载中',
      })
      var id = wx.getStorageSync('userId')
      var headInfo = wx.getStorageSync('headInfo')
     
      console.log(id)
      var params = {
        url: '/app/commodity/listShoppingCartInfo',
        method: 'POST',
        data: {
          'pageIndex': that.data.currentPage,
          'pageSize': that.data.size,
          'userInfo': {
            'id': id
          },
          'shoppingCarType': shoppingType,
          'headInfo': {
            'id': headInfo.id
          }
        },
        sCallBack: function (data) {
          if (data.data.errorCode == 0) {
            wx.hideLoading({
              complete: (res) => {},
            })
            if (data.data.result.datas.length == 0) {
              that.setData({
                hasList: false
              })
              return false;
            } else {
              that.setData({
                hasList: true,
                // list: data.data.result.datas, //初始化数据列表
                totalCount: data.data.result.rowCount, //总的数据条数
                pagecount: data.data.result.totalPages //总页数
              })
              if (that.data.selectAllStatus) {
                let list = data.data.result.datas;
                // 循环遍历判断列表中的数据是否选中
                for (let i = 0; i < list.length; i++) {
                  list[i].selected = true;
                }
                // 页面重新渲染
                that.setData({
                  list: list
                });
                // 计算金额方法
                that.count_price();
              } else {
                // that.count_price();
                that.setData({
                  list: data.data.result.datas, //初始化数据列表
                })
                console.log(that.data.list)
              }
            }
          } else {
            wx.showToast({
              title: data.data.errorMsg
            })
            wx.hideLoading({
              complete: (res) => {},
            })
          }
        },
        eCallBack: function () {
        }
      }
      base.request(params);
    },
    /**
    **提交订单
    */
    btn_submit_order() {

      var that = this;
      // 获取商品数据
      console.log(that.data.list)
      // let price = Number(that.data.totalPrice.slice('.')[0])
      let price = that.data.totalPrice
      if (price == 0) {
        wx.showToast({
          title: '请选择要提交的订单',
          icon: 'none',
          duration: 2000
        })
      } else {
        let list = that.data.list;
        console.log(that.data.list)
        // 循环遍历判断列表中的数据是否选中
        const product = [];

        for (let i = 0; i < list.length; i++) {
          // debugger
          if (list[i].selected&&list[i].isBuy!='4'){
            const productItem = {};
            productItem['id'] = list[i].commodityInfo.id
            productItem['name'] = list[i].commodityInfo.productInfo.commodityName
            productItem['photo'] = list[i].commodityInfo.productInfo.photo
            productItem['price'] = list[i].commodityInfo.price
            productItem['number'] = list[i].commodityNumber
            productItem['ids'] = list[i].id
            product.push(productItem)
          }
        }
        const productInfo = {};
        productInfo['totalPrice'] = that.data.totalPrice.split('.')[0]
        productInfo['sendType'] = that.data.shoppingType
        productInfo['productList'] = product
        wx.setStorageSync('productInfo', productInfo)
        wx.navigateTo({
          url: `/pages/addOrder/add_order`
        })
      }
    },
    /**
    * 分页滚动加载
    */
    scrollLower() {
      // if (this.data.currentPage < this.data.pagecount) {
      //   this.data.currentPage++;
      //   this.getShopList(this.data.shoppingType);
      // } else {
      //   //没有更多数据
      //   app.nomore_showToast();
      // }
      var that = this
      wx.showLoading({
        title: '数据加载中',
        icon: 'loading',
      });
      that.setData({
        currentPage: that.data.currentPage + 1,
      });
      // console.log(that.data.total)
      // console.log(that.data.tabListData.length)
      if (that.data.list.length >= that.data.totalCount) {
        wx.showToast({
          title: '暂无更多数据了',
          icon: 'none',
          duration: 1000
        });
        return false;
      } else {
        wx.showLoading({
          title: '加载中',
          icon: 'loading',
        });
        var id = wx.getStorageSync('userId')
        console.log(id)
        var params = {
          url: '/app/commodity/listShoppingCartInfo',
          method: 'POST',
          data: {
            'pageIndex': that.data.currentPage,
            'pageSize': that.data.size,
            'userInfo': {
              'id': id
            },
            'shoppingCarType': shoppingType,
            'headInfo': {
              'id': ztdid
            }
          },
          sCallBack: function (data) {
            if (data.data.errorCode == 0) {
              var cont = []
              cont = [...that.data.list, ...data.data.result.datas]
              that.setData({
                list: cont
              })
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
    /**
     * 带参数跳转列表详情
     */
    Details(e) {
      console.log(e)
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../../pages/details/Goodsdetails/details?id=${id}`
      })
    },

  },
  

})
