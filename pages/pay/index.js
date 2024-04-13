import {
  getBaseUrl,
  requestUtil,
  getLogin,
  getUserProfile,
} from "../../utils/requestUtil.js";
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    status: 1
  },

  //初始化
  onShow: function () {
    const baseUrl = getBaseUrl();
    // 1，获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 获取缓冲中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);

    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.price;
      totalNum += v.num;
    })

    // 2 给data赋值
    this.setData({
      baseUrl,
      cart,
      totalPrice,
      totalNum,
      address
    })
  },

  //点击支付
  async handleOrderPay() {
    // 1. 是否有token
    const token = wx.getStorageSync('token');
    if (!token) { // 没有token
      await this.updateUserInfo();
      // await this.wxlogin();
    } else { //token存在 验证是否有效
      console.log("token已存在")
      this.validate(token);
    }
  },

  async updateUserInfo() {
    await Promise.all([getLogin(), getUserProfile()]).then((res) => {
      let loginParam = {
        code: res[0].code,
        nickName: res[1].userInfo.nickName,
        avatarUrl: res[1].userInfo.avatarUrl
      }
      wx.setStorageSync('userInfo', res[1].userInfo);
      wx.setStorageSync('loginParam', loginParam);
    });
    await this.wxlogin();
  },

  /**
   * 登录，获取用户token
   */
  async wxlogin() {
    const result = await requestUtil({
      url: "/user/wxlogin",
      data: wx.getStorageSync('loginParam'),
      method: "post",
    });
    const token = result.token;
    if (result.code === 0) {
      //存储token到缓存
      wx.setStorageSync('token', token);
      console.log("已登录，创建订单：" + token);
      this.sureOrder(token);
    }
  },

  /**
   * 验证token是否有效
   */
  async validate(token) {
    //发送请求
    const result = await requestUtil({
      url: "/user/validate",
      method: "post",
      header: {
        "token": token
      }
    });

    //判断token是否有效
    if (result.code != 0) { // token失效
      console.log("token失效")
      wx.showModal({
        title: '提示',
        content: '用户信息已过期，请重新登录',
        success: (res) => { // 确认重新登录
          if (res.confirm) {
            this.updateUserInfo();
            this.wxlogin();
          } else { // 取消登录
            wx.switchTab({
              url: '/pages/cart/index'
            })
          }
        }
      })
    } else { // token有效
      this.sureOrder();
    }
  },


  /**
   * 确认支付弹窗
   */
  sureOrder() {
    wx.showModal({
      title: '提示',
      content: '确认支付吗？',
      success: (res) => {
        res.confirm ? this.data.status = 2 : this.data.status = 1;
        this.createOrder();
      }
    })
  },

  /**
   * 创建订单
   */
  async createOrder() {
    // 设置参数
    const totalPrice = this.data.totalPrice; // 请求体 总价
    const address = this.data.address.provinceName + this.data.address.cityName + this.data.address.countyName + this.data.address.detailInfo; // 请求体 收货地址
    const consignee = this.data.address.userName; // 请求体 收货人
    const telNumber = this.data.address.telNumber; // 请求体 联系电话
    const status = this.data.status; // 请求体 支付状态

    //订单内所有商品详情
    let goods = [];
    this.data.cart.forEach(v => goods.push({
      goodsId: v.id,
      goodsNumber: v.num,
      goodsPrice: v.price,
      goodsName: v.name,
      goodsPic: v.proPic
    }))

    //请求体
    const orderParams = {
      totalPrice,
      address,
      consignee,
      telNumber,
      status,
      goods
    }

    // 发送请求 创建订单
    const res = await requestUtil({
      url: "/my/order/create",
      method: "POST",
      data: orderParams
    });
    console.log("res", res)

    if (res.code === 0) { // 订单成功
      // 删除缓冲中已经支付的商品
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart);
      // 确认支付
      if (this.data.status == 2) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          mask: true
        });
      }
    } else if (res.code == 500) { // 订单失败
      wx.showToast({
        title: res.msg,
        icon: 'error',
        mask: true
      })
    }

    //模拟网络延迟
    var start = new Date().getTime();
    while (true) {
      if (new Date().getTime() - start > 1000 * 1) break;
    }
    // 跳转到购物车
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },
})