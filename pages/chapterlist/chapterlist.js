
var app = getApp()

Page({
  data: {
    loadHidden: true,
    subject_id:null,
    typeSort:null
  },
  onLoad: function (options) {
    //显示出加载中的提示


    this.setData({ loadHidden: false, subject_id: options.id, sortType: options.sortType })
    this.setData({ mid: options.id })
    var that = this
    //console.log(options);
    wx.request({
      url: 'https://tk.qikeya.com/api/subject/getChapters/subjectID/' + options.id,
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