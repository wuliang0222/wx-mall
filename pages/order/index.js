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
    orders: [],
    tabs: [{
        id: 0,
        value: "全部订单",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ]
  },

  // 接口要的参数
  QueryParams: {
    type: 0,
    page: 1, // 第几页
    pageSize: 10 // 每页记录数
  },

  // 总页数
  totalPage: 1,

  // 切换页面
  changeTitleByIndex(index) {
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  //换页 + 对应数据加载
  handleTabsItemChange(e) {
    const {
      index
    } = e.detail;
    this.changeTitleByIndex(index);
    this.QueryParams.type = index;
    this.QueryParams.page = 1;
    this.setData({
      orders: []
    })
    this.getOrders();
  },

  // 获取订单列表
  async getOrders() {
    const res = await requestUtil({
      url: '/my/order/list',
      data: this.QueryParams
    });
    console.log(res)
    this.totalPage = res.totalPage;
    this.setData({
      orders: [...this.data.orders, ...res.orderList] // 拼接数组
    })
  },

  onShow: function (options) {
    // 获取当前的小程序的页面栈 -数组 长度最大是10个页面
    let pages = getCurrentPages();
    console.log(pages)
    // 数组中，索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    console.log(currentPage.options);
    const {
      type
    } = currentPage.options;
    this.changeTitleByIndex(type);
    this.QueryParams.type = type;
    this.getOrders();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉")
    // 重置数组
    this.setData({
      orders: []
    });
    // 重置页码
    this.QueryParams.page = 1;
    // 重新发送请求
    this.getOrders();
    // 手动关闭等待效果
    wx.stopPullDownRefresh({})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 判断有没有下一页数据
    if (this.QueryParams.page >= this.totalPage) {
      // 没有下一页数据
      console.log("没有下页数数据");
      wx.showToast({
        title: '没有下一页数据了'
      })
    } else {
      console.log("有下页数数据");
      this.QueryParams.page++;
      this.getOrders();
    }
  }

})