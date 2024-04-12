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
  onLoad: function () {
    this.getOotdImageList();
  },

  async getOotdImageList() {
    const result = await requestUtil({
      url: "/my/ootd/listAll",
      method: "GET"
    });
    console.log(result)
    const baseUrl = getBaseUrl();
    this.setData({
      ootdImageList: result.ootdImageList,
      baseUrl: baseUrl
    })
  },

})