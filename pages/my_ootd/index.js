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
    imgUrl: [],
    imgUpperUrl: "",
    imgLowerUrl: "",
    imgDressUrl: "",
    imgBodyUrl: "",
  },

  uploadUpper() {
    wx.chooseMedia({
      success: res => {
        this.setData({
          'imgUrl[0].url': res.tempFiles[0].tempFilePath
        })
        console.log(this.data.imgUrl[0].url)
        console.log(res.tempFiles[0].tempFilePath)
      }
    })
  },

  upload() {
    if (this.data.imgUrl[0].url == "") {
      wx.showToast({
        title: '未上传图片',
        icon: 'error',
        mask: true
      })
      return;
    }
    let token = wx.getStorageSync("token");
    let BaseUrl = getBaseUrl()
    wx.uploadFile({
      url: BaseUrl + '/my/ootd/uploadImage/upper',
      filePath: this.data.imgUpperUrl,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        "token": token
      }
    })
  },

  deleteImg(e) {
    let index = e.detail.index
    let imgUrl = this.data.imgUrl;
    imgUrl.splice(index, 1);
    this.setData({
      imgUrl
    })
  }

})