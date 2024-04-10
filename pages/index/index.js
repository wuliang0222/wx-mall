import {
  getBaseUrl,
  requestUtil
} from "../../utils/requestUtil.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    baseUrl: '',
    bigTypeList: [],
    bigTypeList_row1: [],
    bigTypeList_row2: [],
    hotProductList: []
  },
  onLoad: function () {
    this.getSwiperList();
    this.getBigTypeList();
    this.getHotProductList();

  },
  // 获取轮播图数据
  async getSwiperList() {
    const result = await requestUtil({
      url: "/product/findSwiper",
      method: 'GET'
    });
    const baseUrl = getBaseUrl();
    this.setData({
      swiperList: result.message,
      baseUrl: baseUrl
    })
  },

  // 获取商品大类数据
  async getBigTypeList() {
    const result = await requestUtil({
      url: "/bigType/findAll",
      method: "GET"
    });
    console.log(result)
    const bigTypeList_row1 = result.message.filter((item, index) => {
      return index < 5;
    })
    const bigTypeList_row2 = result.message.filter((item, index) => {
      return index >= 5;
    })
    const baseUrl = getBaseUrl();
    this.setData({
      bigTypeList: result,
      bigTypeList_row1,
      bigTypeList_row2,
      baseUrl: baseUrl
    })
  },

  // 获取热卖商品
  async getHotProductList() {
    const result = await requestUtil({
      url: "/product/findHot",
      method: "GET"
    });
    const baseUrl = getBaseUrl();
    this.setData({
      hotProductList: result.message,
      baseUrl: baseUrl
    })
  },

  // 点击跳转
  handleTypeJump(event) {
    var index = event.currentTarget.dataset.index;
    const app = getApp();
    app.globalData.index = index;
    wx.switchTab({
      url: '/pages/category/index'
    })
  }
})