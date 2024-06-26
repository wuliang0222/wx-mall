// 导入request请求工具方法
import {
  getBaseUrl,
  requestUtil
} from "../../utils/requestUtil.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    productList: [],
    // 取消 按钮 是否显示
    isFocus: false,
    // 输入框的值
    inputValue: ""
  },
  TimeId: -1,

  // 输入框的值改变，就会触发事件
  handleInput(e) {
    const {
      value
    } = e.detail;
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    // 准备发送请求获取数据
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.search(value);
    }, 1000);
  },

  // 发送请求获取结果
  async search(query) {
    const res = await requestUtil({
      url: "/product/search",
      data: {
        query
      }
    });
    this.setData({
      productList: res.message
    })
  },

  // 点击 取消按钮
  handleCancel() {
    this.setData({
      inputValue: "",
      isFocus: false,
      productList: []
    })
  }

})