// 导入request请求工具方法
import {
  getBaseUrl,
  requestUtil,
  getLogin,
  getUserProfile,
  requestPay
} from "../../utils/requestUtil.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  data: {
    userInfo: {}
  },
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    });
  },

  onLoad: function () {
    this.login();
  },

  login(){
    // 判断缓存中是否有token
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '友情提示',
        content: '微信授权登录后，才可进入个人中心',
        success: (res) => {
          Promise.all([getLogin(), getUserProfile()]).then((res) => {
            console.log(res)
            let loginParam = {
              code: res[0].code,
              nickName: res[1].userInfo.nickName,
              avatarUrl: res[1].userInfo.avatarUrl
            }
            console.log("loginParam:", loginParam);
            // 把用户信息放到缓存中
            wx.setStorageSync('loginParam', loginParam);
            wx.setStorageSync('userInfo', res[1].userInfo);
            this.wxlogin(loginParam);
            this.setData({
              userInfo: res[1].userInfo
            });
          })
        }
      })
    } else {
      console.log("token:" + token);
    }
  },

  // 点击 编辑收货地址
  handleEditAddress() {
    console.log("编辑收货地址")
    wx.chooseAddress({});
  },

  /**
   * 请求后端获取用户token
   * @param {} loginParam 
   */
  async wxlogin(loginParam) {
    // 发送请求 获取用户的token
    const result = await requestUtil({
      url: "/user/wxlogin",
      data: loginParam,
      method: "post"
    });
    let token = result.token;
    if (result.code == 0) {
      // 存储token到缓存
      wx.setStorageSync('token', token);
    }
  }

})