
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [],    
    hidden: false,
    hiddenmodalput: true,//可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框        
  },
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      confirmColor: "#3ea5ff",
      hiddenmodalput: true,
      jsInput: function (e) { 
          this.setData({ inpval: e.detail.value })
       }
      
    })
  },  
  radioChange: function (e) {
    var checked = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.radioItems.length; i++) {
      if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
        changed['radioItems[' + i + '].checked'] = true
      } else {
        changed['radioItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
  },
  lookResult: function (e){

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