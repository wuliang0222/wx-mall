import {
  getBaseUrl,
  requestUtil
} from "../../utils/requestUtil.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    baseUrl: '',
    ootdImageList: []
  },
  // 接口要的参数
  QueryParams: {
    page: 1, // 第几页
    pageSize: 10 // 每页记录数
  },

  // 总页数
  totalPage: 1,

  // 获取全部虚拟试衣
  async getOotdImageList() {
    const result = await requestUtil({
      url: "/my/ootd/listAll",
      data: this.QueryParams
    });
    console.log("result:",result)
    // 放到setdata不会刷新
    this.totalPage = result.totalPage;
    this.setData({
      ootdImageList: [...this.data.ootdImageList, ...result.ootdImageList],
    })
  },

  onLoad: function () {
    this.setData({
      baseUrl: getBaseUrl()
    })
    this.getOotdImageList();
  },

  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    console.log(currentPage.options);
    this.getOotdImageList();
  },

  /**
   * 下拉
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    // 重置数组
    this.setData({
      ootdImageList: []
    });
    // 重置页码
    this.QueryParams.page = 1;
    // 重新发送请求
    this.getOotdImageList();
    // 手动关闭等待效果
    wx.stopPullDownRefresh({})
  },

  /**
   * 上拉
   */
  onReachBottom: function () {
    console.log("上拉")
    // 判断有没有下一页数据
    if (this.QueryParams.page >= this.totalPage) {
      // 没有下一页数据
      wx.showToast({
        title: '没有下一页数据了'
      })
    } else {
      this.QueryParams.page++;
      this.getOotdImageList();
    }
  }

})