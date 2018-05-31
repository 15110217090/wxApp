
var app = getApp()

Page({
  data: {
    loadHidden: true,
    matter:[],
    idCache:null
  },
  onLoad: function (options) {
    console.log('optionsd' + options )
    //显示出加载中的提示
    this.setData({ loadHidden: false, idCache: { subject_id: options.subject_id, chapter_id: options.chapter_id, sortType: options.sortType}})

    console.log(this.data);
    this.setData({ mid: options.id })
    var that = this

    wx.request({
      url: 'https://tk.qikeya.com/api/subject/getUnits/chapterID/' + options.chapter_id,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (!res.data) {
          that.setData({ toastHidden: false })
          return false
        }
       console.log(res.data);
        // console.log(res.data);
        that.setData({ matter: res.data.data })
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