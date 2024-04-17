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
    ootds: [],
    baseUrl: '',
    type: 0,
    tabs: [{
        id: 0,
        value: "全部虚拟试衣",
        isActive: true
      },
      {
        id: 2,
        value: "已生成",
        isActive: false
      },
      {
        id: 1,
        value: "未生成",
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
    tabs.forEach((v, i) => {
      if (i == index) {
        v.isActive = true;
        this.setData({
          type: v.id
        })
      } else {
        v.isActive = false;
      }
    });
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
    this.QueryParams.type = this.data.type;
    this.QueryParams.page = 1;
    this.setData({
      ootds: []
    })
    this.getOotds();
  },

  // 获取订单列表
  async getOotds() {
    const res = await requestUtil({
      url: '/my/ootd/list',
      data: this.QueryParams
    });
    this.totalPage = res.totalPage;
    this.setData({
      ootds: [...this.data.ootds, ...res.ootdImageList] // 拼接数组
    })
    console.log("ootds:", this.data.ootds)
  },

  onLoad() {
    this.setData({
      baseUrl: getBaseUrl()
    })
  },

  onShow() {
    this.validate();
    // 获取当前的小程序的页面栈 -数组 长度最大是10个页面
    let pages = getCurrentPages();
    // 数组中，索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    console.log(currentPage.options);
    const {
      type
    } = currentPage.options;
    this.changeTitleByIndex(type);
    this.QueryParams.type = type;
    this.getOotds();
  },

  /**
   * 鉴权
   */
  async validate() {
    const token = wx.getStorageSync('token');
    if (!token) { // 没有token
      wx.showModal({
        title: '提示',
        content: '用户信息已过期，请重新登录',
      })
    } else { //token存在 验证是否有效
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
        wx.showModal({
          title: '提示',
          content: '用户信息已过期，请重新登录',
        })
      }
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log("下拉")
    // 重置数组
    this.setData({
      ootds: []
    });
    // 重置页码
    this.QueryParams.page = 1;
    // 重新发送请求
    this.getOotds();
    // 手动关闭等待效果
    wx.stopPullDownRefresh({})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
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
      this.getOotds();
    }
  },

  /**
   * 关闭
   */
  async onClose(e) {
    let id = e.currentTarget.dataset.id;
    // console.log(id)
    let that = this;

    wx.showModal({
      content: '确定要删除吗？',
      success: async function (res) {
        if (res.confirm) {
          console.log("删除")
          console.log(id)
          let result = await requestUtil({
            url: '/my/ootd/delete',
            data: {
              id
            }
          });
          that.onPullDownRefresh();
          console.log("that.ootds:", that.ootds);
          if (result.code === 0) {
            wx.showToast({
              title: '成功删除'
            })
          }
        }
      },
    })
  },

  async updateShow(e){
    let showOotd = e.currentTarget.dataset.showootd === "true";//要改变成这个状态
    let id = e.currentTarget.dataset.id;
    console.log("showOotd",showOotd)
    console.log("id",id)
    let that = this;
    let content = showOotd ? "展示" : "隐藏";
    console.log("content",content)
    wx.showModal({
      content: "确定要" + content + "吗？",
      success: async function (res) {
        if (res.confirm) {
          let result = await requestUtil({
            url: '/my/ootd/updateShowOotd',
            data: {
              id,
              showOotd
            }
          });
          console.log("res:", result)
          that.onPullDownRefresh();
          if (result.code === 0) {
            wx.showToast({
              title: "成功" + content
            })
          }
        }
      },
    })
  }

})