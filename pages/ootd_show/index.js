import {
  getBaseUrl,
} from "../../utils/requestUtil.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    arr: [],
    fileList: [], //文件上传时 在前端展示上传的图片
    newArr: [] //点击删除按钮的时候 进行赋值
  },
  //点击删除图片
  del(event) {
    let id = event.detail.index //能获取到对应的下标
    let newArr = this.data.newArr //这里引用 上传的数组 
    let fileList = this.data.fileList //这里是前端页面展示的数组
    newArr.splice(id, 1) //根据下标来删除对应的图片
    fileList.splice(id, 1)
    this.setData({
      fileList: fileList, //在这里进行重新赋值  删除后 图片剩几张就相当于给后台传几张
      newArr: newArr
    })
    console.log("fileList", this.data.fileList)
    console.log("newArr", this.data.newArr)
  },

  /**
   * 
   * @param {传入文件} event 
   */
  show(event) {
    var img = event.detail.file;
    this.setData({
      fileList: this.data.fileList.concat(img)
    })
    console.log("fileList", this.data.fileList)
    console.log("newArr", this.data.newArr)
  },

  //上传访问后台接口
  uoload() {
    var img = this.data.fileList
    let arr = this.data.newArr
    img.map(function (v, k) { //这里是多文件上传 使用map
      let imgs = v.url;
      let token = wx.getStorageSync('token');
      let BaseUrl = getBaseUrl();
      wx.uploadFile({ //这里一定要用  wx.uploadFile 否则无法穿到后台
        url: BaseUrl + '/my/ootd/uploadImage/upper',
        filePath: imgs, //你要上传的路径
        name: 'file', //你上传到后台的name值
        header: {
          "Content-Type": "multipart/form-data",
          "token": token
        },
        formData: {
          "testImage": "123",
          "testImage2": ["111", "222"]
        },
        success(res) {
          let img = res.data
          console.log(img)
          arr.push(img); //返回图片的路径  并追加到新数组里面
          this.setData({
            newArr: [] //在这里重新赋值，用来做删除
          })
        }

      })
    })
  }

})