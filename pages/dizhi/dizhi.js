// pages/dizhi/dizhi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(wx.getStorageSync("cityData")){
      array = wx.getStorageSync("cityData");
      that.initData();
    } else {
      wx.request({
        url: 'https://www.easy-mock.com/mock/5eb8c507a2293e5119c967c2/city/city',
        success: res => {
          array = res.data;
          wx.setStorageSync("cityData", res.data);
          that.initData();
        }
      });
    }
  },
  initData: function(){
    let cityArray = [[], [], [], []];  //选择器数据

    for (let i = 0, len = array.length; i < len; i++) {  //存入省
      cityArray[0].push({
        name: array[i].name,
        code: array[i].code
      });
    }
    for (let j = 0, len = array[0].children.length; j < len; j++) {  //存入市，默认关联第一个省
      cityArray[1].push({
        name: array[0].children[j].name,
        code: array[0].children[j].code
      });
    }
    for (let k = 0, len = array[0].children[0].children.length; k < len; k++) {  //存入区，默认关联第一个省的第一个市
      cityArray[2].push({
        name: array[0].children[0].children[k].name,
        code: array[0].children[0].children[k].code
      });
    }

    for (let s = 0, len = array[0].children[0].children[0].children.length; s < len; s++) {  //存入街道，默认关联第一个省的第一个市的第一个区
      cityArray[3].push({
        name: array[0].children[0].children[0].children[s].name,
        code: array[0].children[0].children[0].children[s].code
      });
    }
    this.setData({
      cityArray: cityArray
    });
  },
  bindMultiPickerColumnChange(e){
    let selectedIndex = e.detail.value;  //滚动到哪一项

    let cityArray = this.data.cityArray;
    let list1 = []; //存放第二列数据，即市的列
    let list2 = []; //存放第三列数据，即区的列
    let list3 = []; //存放第四例数据，即街道的列

    let citiesIndex = [];
    let provinceIndex = this.data.citiesIndex[0];  //选中的省索引
    let cityIndex = this.data.citiesIndex[1];  //选中的市索引 
    let areaIndex = this.data.citiesIndex[2];  //选中的区索引

    switch (e.detail.column) {  //判断滚动的哪一列并做相应的数据处理
      case 0: //滚动第一列，即省的那一列
        for(let i = 0,len = array[selectedIndex].children.length;i<len;i++){ //存入省下面的市
          list1.push({
            name: array[selectedIndex].children[i].name,
            code: array[selectedIndex].children[i].code
          });
        }
        for (let j = 0, len = array[selectedIndex].children[0].children.length; j < len; j++) { //存入市下面的区
          list2.push({
            name: array[selectedIndex].children[0].children[j].name,
            code: array[selectedIndex].children[0].children[j].code
          });
        }
        for (let k = 0, len = array[selectedIndex].children[0].children[0].children.length; k < len; k++) {//存入区下面的街道
          list3.push({
            name: array[selectedIndex].children[0].children[0].children[k].name,
            code: array[selectedIndex].children[0].children[0].children[k].code
          });
        }


        citiesIndex = [selectedIndex, 0, 0, 0];   //记录索引
        break;
      case 1:  //滚动第二列，即市的那一列
        list1 = cityArray[1];  //市那一列数据不需要更新

        for(let i = 0,len = array[provinceIndex].children[selectedIndex].children.length;i<len;i++){//存入市下面的区
          list2.push({
            name: array[provinceIndex].children[selectedIndex].children[i].name,
            code: array[provinceIndex].children[selectedIndex].children[i].code
          });
        }

        for (let j = 0, len = array[provinceIndex].children[selectedIndex].children[0].children.length; j < len; j++) {//存入区下面的街道
          list3.push({
            name: array[provinceIndex].children[selectedIndex].children[0].children[j].name,
            code: array[provinceIndex].children[selectedIndex].children[0].children[j].code
          });
        }
        citiesIndex = [provinceIndex, selectedIndex, 0, 0];  //记录索引
        break;
      case 2: //滚动第三列，即区的那一列
        list1 = cityArray[1]; //市和区的数据都需要更新
        list2 = cityArray[2];

        for (let i = 0, len = array[provinceIndex].children[cityIndex].children[selectedIndex].children.length; i < len; i++) { //存入区下面的街道
          list3.push({
            name: array[provinceIndex].children[cityIndex].children[selectedIndex].children[i].name,
            code: array[provinceIndex].children[cityIndex].children[selectedIndex].children[i].code
          });
        }
    
        citiesIndex = [provinceIndex, cityIndex, selectedIndex, 0];  //记录索引
        break;
      case 3: //滚动第四列，即街道那一列
        list1 = cityArray[1];
        list2 = cityArray[2];
        list3 = cityArray[3];

        citiesIndex = [provinceIndex, cityIndex, areaIndex, selectedIndex];  //记录索引
        break;
    }
    this.setData({
      [`cityArray[1]`]: list1,//重新赋值第二列数组，即联动了市
      [`cityArray[2]`]: list2,//重新赋值第三列数组，即联动了区
      [`cityArray[3]`]: list3,//重新赋值第四列数组，即联动了街道
      citiesIndex: citiesIndex,//更新索引
    });
  },
  //选择器选择事件
  bindMultiPickerChange(e){
    let cityIndex = e.detail.value;
    //选择的地址拼接
    let selectedAddress = array[cityIndex[0]].name + array[cityIndex[0]].children[cityIndex[1]].name + array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].name + array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].children[cityIndex[3]].name;
    //选择的区域编码
    let areaCode = array[cityIndex[0]].children[cityIndex[1]].children[cityIndex[2]].children[cityIndex[3]].code;
   
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