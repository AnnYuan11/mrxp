// pages/test/test.js
Page({

  /**
  * 页面的初始数据
  */
  data: {
  startX: 0, //开始坐标
  startY: 0,
  page: 1,
  list:[
  {
  id:0,
  title:'标题1',
  create_time:'2019-09-06'
  }
  ]
  },
  touchE: function (e) {
  // console.log(e);
  var that = this
  if (e.changedTouches.length == 1) {
  //手指移动结束后触摸点位置的X坐标
  var endX = e.changedTouches[0].clientX;
  //触摸开始与结束，手指移动的距离
  var disX = that.data.startX - endX;
  var delBtnWidth = that.data.delBtnWidth;
  //如果距离小于删除按钮的1/2，不显示删除按钮
  var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
  
  //获取手指触摸的是哪一项
  var index = e.currentTarget.dataset.index;
  var list = that.data.list;
  list[index].txtStyle = txtStyle;
  //更新列表的状态
  that.setData({
  list: list
  });
  }
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
  //开始触摸时 重置所有删除
  this.data.list.forEach(function (v, i) {
  if (v.isTouchMove) //只操作为true的
  v.isTouchMove = false;
  })
  this.setData({
  startX: e.changedTouches[0].clientX,
  startY: e.changedTouches[0].clientY,
  list: this.data.list
  })
  },
  //滑动事件处理
  touchmove: function (e) {
  var that = this,
  index = e.currentTarget.dataset.index, //当前索引
  startX = that.data.startX, //开始X坐标
  startY = that.data.startY, //开始Y坐标
  touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
  touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
  //获取滑动角度
  angle = that.angle({
  X: startX,
  Y: startY
  }, {
  X: touchMoveX,
  Y: touchMoveY
  });
  that.data.list.forEach(function (v, i) {
  v.isTouchMove = false
  //滑动超过30度角 return
  if (Math.abs(angle) > 30) return;
  if (i == index) {
  if (touchMoveX > startX) //右滑
  v.isTouchMove = false
  else //左滑
  v.isTouchMove = true
  }
  })
  //更新数据
  that.setData({
  list: that.data.list
  })
  },
  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
  var _X = end.X - start.X,
  _Y = end.Y - start.Y
  //返回角度 /Math.atan()返回数字的反正切值
  return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
  
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
  
  }
  })