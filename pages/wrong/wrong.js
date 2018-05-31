var collectUrl = 'http://tk.qikeya.com/api/question/getWrong/id/1'
var app = getApp()
Page({
  data: {
    true: true,
    collect: [],

  },

  onLoad: function () {
    var that = this;
    //进入页面显示正在加载的图标
    wx.showLoading({
      title: '正在加载中...',
    })
    wx.request({
      url: collectUrl,
      data: {},
      header: {
        'ContentType': 'application/json'
      },
      success: function (res) {
        //获取到数据后隐藏正在加载图标
        wx.hideLoading();
        console.log(res.data)
        that.setData({
          collect: res.data.data  //获取的数据截取数组下标0-2的数据
        })
      }
    })

    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight   //设备的高度等于scroll-view内容的高度
        })
      }
    })
  }
})
