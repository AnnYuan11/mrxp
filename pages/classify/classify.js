// pages/classify/classify.js
var app = getApp();
Page({
  data: {
    active:0,
    currentTab:0,
    imgUrl:app.globalData.imgUrl,
  },
  switchNav: function (e) {
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({
        currentTab: id
      });
    }
    page.setData({
      active: id
    });
    
  },
  search: function (value) {
    console.log(111)
   },
 })