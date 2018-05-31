// var videoUrl = 'http://t.jingduhealth.com/index/xcsvideo'
var app = getApp()
Page({
  data: {
    true: true,
    video: [],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,  // tab切换 
  },
  //tab导航条切换事件
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    })
  },
  switchNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onLoad: function () {
    var that = this;
    //进入页面显示正在加载的图标
    wx.showToast({
      title: '正在加载中...',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: videoUrl,
      data: {},
      header: {
        'ContentType': 'application/json'
      },
      success: function (res) {
        //获取到数据后隐藏正在加载图标
        wx.hideLoading();
        console.log(res.data)
        that.setData({
          video: res.data.slice(0, 2)  //获取的数据截取数组下标0-2的数据
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
