
var app = getApp()

Page({
  data: {
    loadHidden: true,
  },
  onLoad: function (options) {
    //显示出加载中的提示
   this.setData({ loadHidden: false })
    this.setData({ mid: options.id })
    var that = this

    wx.request({
      url: 'http://tk.qikeya.com/api/subject/getChapters/subjectID/' + options.id,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (!res.data) {
          that.setData({ toastHidden: false })
          return false
        }
        //console.log(res.data);
        that.setData({ movie: res.data.data })
      },
      complete: function () {
        //显示出加载中的提示
        that.setData({ loadHidden: true })
      },
      modalChange: function () {
        this.setData({ confirmHidden: true })
      }
    })
  }
})