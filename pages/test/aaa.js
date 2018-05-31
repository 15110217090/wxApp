


// Page({
//   data: {
//     logs: []
//   },
//   onLoad: function () {
//     this.setData({
//       logs: (wx.getStorageSync('logs') || []).map(log => {
//         return util.formatTime(new Date(log))
//       })
//     })
//   }
// })


Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{
      time:0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

 



    // var wxTimer1 = new wxTimer({
    //   beginTime: "00:00:10",
    //   name: 'wxTimer1',
    //   complete: function () {
    //     console.log("完成了")
    //   }
    // })
    // wxTimer1.start(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  clickTap:function(){
     
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})