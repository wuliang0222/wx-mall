// 导入request请求工具方法
import {
  getBaseUrl,
  requestUtil
} from "../../utils/requestUtil.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productObj: {productIntroImgs:""},
    baseUrl: '',
    activeIndex: 0
  },

  productInfo: {

  },

  /**
   * tab点击事件
   * @param {} e 
   */
  handleItemTap(e) {
    console.log(e)
    const {
      index
    } = e.currentTarget.dataset;
    console.log(index);
    this.setData({
      activeIndex: index
    })
  },

  // 获取产品信息
  async getProductDetail(id) {
    console.log(id)
    const result = await requestUtil({
      url: "/product/detail",
      data: {
        id
      }
    });
    this.productInfo = result.message;
    const baseUrl = getBaseUrl();
    this.setData({
      productObj: {
        ...result.message,  // 保留原有 productObj 的其他属性
        productIntroImgs: result.message.productIntroImgs.replace(/<img/gi, '<img style="width:100%;height:auto;"')
      },
      baseUrl
    });
  },

  // 加入购物车
  setCartAdd() {
    // 获取缓存中的购物车 数组格式
    let cart = wx.getStorageSync('cart') || [];
    // 判断商品对象中是否存在于购物车数组中
    let index = cart.findIndex(v => v.id === this.productInfo.id);
    if (index === -1) { // 不存在
      this.productInfo.num = 1;
      this.productInfo.checked = false;
      cart.push(this.productInfo);
    } else { // 已经存在
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart); // 把购物车添加到缓存中
  },

  // 点击 加入购物车
  handleCartAdd() {
    this.setCartAdd();
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  },

  // 点击 立即购买
  handleBuy() {
    this.setCartAdd();
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductDetail(options.id)
  }

})