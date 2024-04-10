// 同时发送异步代码的次数
let ajaxTimes = 0;

// 定义公共的url
const baseUrl = "http://localhost:8081";

/**
 * 返回baseUrl
 */
export const getBaseUrl = () => {
  return baseUrl;
}

/**
 * wx getUserProfile封装
 * @param {*} param0 
 */
export const getUserProfile = () => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

/**
 * wx login封装
 * @param {*} param0 
 */
export const getLogin = () => {
  return new Promise((resolve, reject) => {
    // 获取小程序登录成功后的code
    wx.login({
      timeout: 5000,
      success: (res) => {
        resolve(res);
        // console.log(res.code)
      },
      fail: (err) => {
        reject(err);
        // console.log(res.code)
      }
    })
  })
}

/**
 * promise形式的 小程序的微信支付
 * @param {*} pay 
 */
export const requestPay = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}


/**
 * 后端请求工具类
 * @param {*} params 请求参数
 */
export const requestUtil = (params) => {
  // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
  let header = {
    ...params.header
  };

  if (params.url.includes("/my/")) {
    // 拼接header 带上token
    header["token"] = wx.getStorageSync("token");
    // header["token"] = 0;
  }

  ajaxTimes++;

  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });

  //模拟网络延迟加载
  var start = new Date().getTime();
  while (true) {
    if (new Date().getTime() - start > 1000 * 1) break;
  }

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          //  关闭正在等待的图标
          wx.hideLoading();
        }
      }
    });
  })
}