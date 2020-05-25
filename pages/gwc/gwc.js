// pages/gwc/gwc.js
import { Base } from "../../utils/request/base.js";
var app = getApp();
var base = new Base();

Page({
    data: {
        tabList: ["到店自提", "快递到家"],
        select: 0,
        imgUrl:app.globalData.imgUrl,
        imgUrls: app.globalData.imgUrls,

    },
    onShow() {
        app.getShopNum()
    },
    selectTab(e)  {
        this.setData({
            select : e.currentTarget.dataset.index
        })
    }
})