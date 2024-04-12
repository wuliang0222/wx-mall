import {
  getBaseUrl,
  requestUtil,
  getLogin,
  getUserProfile,
} from "../../utils/requestUtil.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    fileList: [], // 文件上传时 在前端展示上传的图片
    garment: [],
    newGarment: "",
    model: [],
    newModel: "",
    radio: "0",
    baseUrl: ""
  },

  // 单选框
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onShow: function () {
    this.setData({
      baseUrl: getBaseUrl()
    })
  },
  
  // 删除图片
  del(event) {
    console.log("event:", event)
    let type = event.currentTarget.dataset.type; // 图片类型
    if (type === "garment") {
      this.setData({
        garment: [],
        newGarment: ""
      })
    } else {
      this.setData({
        model: [],
        newModel: ""
      })
    }
  },

  /**
   * 上传一张图片到后端
   * @param {*} event 
   */
  uoload(event) {
    //根据data-type的不同，放到不同地方
    console.log("event", event)
    var img = event.detail.file; // 当前获得的图片
    let type = event.currentTarget.dataset.type; // 图片类型
    let category = this.data.radio; // 虚拟试衣模式
    let that = this;

    if (type === "garment") {
      this.setData({
        garment: img,
      })
    } else {
      this.setData({
        model: img,
      })
    }

    img.map(function (v, k) {
      let imgs = v.url;
      let token = wx.getStorageSync('token');
      let BaseUrl = getBaseUrl();
      // 上传图片
      wx.uploadFile({
        url: BaseUrl + '/my/ootd/uploadImage',
        filePath: imgs,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          "token": token
        },
        formData: {
          "type": type,
          "category": category,
        },
        success(res) {
          let img = JSON.parse(res.data).data.src;
          console.log(img)
          if (type === "garment") {
            that.setData({
              newGarment: img,
            })
          } else {
            that.setData({
              newModel: img,
            })
          }

        }
      })
    })
  },

  async create() {
    // 设置参数
    let clothingImage = this.data.newGarment;
    let bodyImage = this.data.newModel;
    let status = 1;
    let category = this.data.radio;
    console.log("this.data.newGarment:", this.data.newGarment)
    console.log("this.data.newModel:", this.data.newModel)
    if (clothingImage == "" || bodyImage == "") {
      wx.showToast({
        title: '请选择图片',
        icon: 'error',
        mask: true
      })
      return;
    }

    //请求体
    const ootdParams = {
      clothingImage,
      bodyImage,
      status,
      category
    }

    // 发送请求
    const res = await requestUtil({
      url: "/my/ootd/create",
      method: "POST",
      data: ootdParams
    });
    wx.showModal({
      title: '提示',
      content: '正在生成，请稍后在虚拟试衣管理查看',
    })

  },

})