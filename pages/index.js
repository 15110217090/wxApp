var app=getApp();
Page({
  data: {
    index: 0,
    doctors:[],
    countDownDay: 0,
    animationData: {},
   
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'https://tk.qikeya.com/api/subject/getSubjects',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data);
        var objectArray = res.data.data
        
        //  console.log(objectArray)
        var doctors = []
        for (var i = 0; i < objectArray.length; i++) {
         // console.log(objectArray[i].name)
          doctors.push(objectArray[i].name)
        }
        // that.setData({ doctors: res.data, object: objectArray[this.data.index].array })  
        //console.log(doctors)
         that.setData({ doctors})
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    // 心跳的动画 
    var circleCount = 0;    
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 500, // 以毫秒为单位 
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
    });
    setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationMiddleHeaderItem.scale(1.5).step();
      } else {
        this.animationMiddleHeaderItem.scale(1.0).step();
      }
      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()
      });
      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 500);  
  }
})

