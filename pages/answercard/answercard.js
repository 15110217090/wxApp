



// var getEndDayCardUrl = ' http://tk.qikeya.com/api/testpaper/putComplete/user_id/' + user_id+'/test_id'  //每日一练答题卡结束
// var getEndmoniCardUrl = 'http://tk.qikeya.com/api/testpaper/putSimulateComplete/user_id/' + user_id +'/test_id'  // 模拟考试答题卡结束
// var getEndketangCardUrl = ' http://tk.qikeya.com/api/testpaper/putButClassExercise/user_id/' + user_id +'/test_id'  // 课堂练习答题卡结束




var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    showDialog: false,
    cards: [],
    selects: [],
    idCache: {},
    isContainA: false,
    isContainB: false,
    isContainC: false,
    isContainD: false,
    indexArray: ["A", "B", "C", "D", "E"],
    currentTestID: 0,
    result: {
      passed_status: '',
      score: '',
      Tnum: 0,
      accuracy: 0,
      use_time: 0
    }
  },
  lookResult: function () {

  },
  selectTap: function (e) {

    // console.log(e.target.dataset.select)
    wx.setStorageSync('currentIndex', e.target.dataset.select)
    wx.navigateBack()
  },
  reStart: function () {

    // console.log(this.data.idCache.unit_id)
    wx.navigateBack({

    })
    var url = ''
    if (this.data.type < 4) {
      urlStr = '../alltest/alltest?unit_id=' + this.data.idCache.unit_id + '&subject_id=' + this.data.idCache.subject_id + '&chapter_id=' + this.data.idCache.chapter_id + '&sortType=' + this.data.idCache.sortType + '&type=' + this.data.type
    } else {
      urlStr = '../alltest/alltest?unit_id=' + this.data.idCache.unit_id + '&subject_id=' + this.data.idCache.subject_id + '&chapter_id=' + this.data.idCache.chapter_id + '&sortType=' + this.data.idCache.sortType + '&tiType=' + this.data.type
    }

    wx.redirectTo({
      url: urlStr
    })

  },
  endAnswer: function () {
    var that = this
    //章节练习直接调回首页
    // console.log(this.data.sortType)
    if (this.data.idCache.sortType == 1) {

      wx.reLaunch({
        url: '../index',
      })
      return;
    }







    // 试卷结束答题      
    wx.showModal({
      title: '',
      confirmColor: "#3ea5ff",
      content: '是否要交卷？',
      success: function (res) {

        if (res.confirm) {
          var url = ''
          if (that.data.type == 5) {

            url = 'http://tk.qikeya.com/api/testpaper/putComplete/user_id/2' + '/test_id/' + that.data.currentTestID
            that.showResult(url)
          } else if (that.data.type == 6) {

            url = 'http://tk.qikeya.com/api/testpaper/putSimulateComplete/user_id/3' + '/test_id/' + that.data.currentTestID
            that.showResult(url)
          } else if (that.data.type == 7) {

            url = 'http://tk.qikeya.com/api/testpaper/putButClassExercise/user_id/3' + '/test_id/' + that.data.currentTestID
            that.showResult(url)
          }


        }
        // this.setData({
        //   showDialog: true
        // })
      }
    })
  },

  showResult: function (url) {
    var that = this
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        var pstatus = ''
        if (res.data.data.passed_status == 1) {
          pstatus = '合格'
        } else {
          pstatus = '不合格'
        }


        that.setData({
          'result.passed_status': pstatus,
          'result.score': res.data.data.score,
          'result.Tnum': res.data.data.Tnum,
          'result.accuracy': res.data.data.accuracy,
          'result.use_time': res.data.data.use_time.toFixed(0),
          showDialog: true
        })
      }
    })
  },
  closeDialog: function () {
    this.setData({
      showDialog: false
    })
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    if (options.type) {
      that.setData({
        type: options.type

      })
      if (options.type == '5' || options.type == '6' || options.type == '7') {
        that.setData({
          idCache: JSON.parse(options.idCache)

        })
      }
    } else {

      that.setData({
        idCache: JSON.parse(options.idCache)

      })
    }



    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // debugger
    let url = 'http://tk.qikeya.com/api/subject/getCardS/subject_id/' + this.data.idCache.subject_id + '/chapter_id/' + this.data.idCache.chapter_id + '/unit_id/' + this.data.idCache.unit_id
    if (options.type <= 4) {
      url = 'http://tk.qikeya.com/api/topic/getCard/type/' + options.type
    }
    if (options.type == '5') {
      url = 'http://tk.qikeya.com/api/testpaper/getDaytestItems/'
    }
    if (options.type == '6') {
      url = 'http://tk.qikeya.com/api/testpaper/getTestpaterItems/'
    }
    if (options.type == '7') {
      url = 'http://tk.qikeya.com/api/testpaper/getClassCard/'
    }
    wx.request({
      url: url,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        wx.hideLoading()
        let tmpCardList = []
        let typeList = []
        if (parseInt(options.type) < 5) {


          if (Object.keys(res.data.data.List).length > 0) {
            Object.keys(res.data.data.List).forEach((questionName) => {
              res.data.data.List[questionName].forEach((question) => {

                if (options.selects.indexOf(question.id) != -1) {
                  question = { "id": question.id, "type": question.type, "isS": true }
                  // console.log(question.id)
                } else {
                  question = { "id": question.id, "type": question.type, "isS": false }
                }

                tmpCardList.push(question);

                if (question.type == 1) {
                  that.setData({
                    isContainA: true
                  })
                } else if (question.type == 2) {
                  that.setData({
                    isContainB: true
                  })

                } else if (question.type == 3) {
                  that.setData({
                    isContainC: true
                  })
                } else if (question.type == 4) {
                  that.setData({
                    isContainD: true
                  })
                }

              })
            })
          }
        }
        //每日一练
        if (options.type == '5' || options.type == '6' || options.type == '7') {


          if (Object(res.data.data).length > 0) {
            Object(res.data.data).forEach(question => {

              that.setData({
                currentTestID: question.test_id
              })
              if (options.selects.indexOf(question.question_id) != -1) {
                question = { "id": question.question_id, "type": question.question_type, "isS": true }
                // console.log(question.id)
              } else {
                question = { "id": question.question_id, "type": question.question_type, "isS": false }
              }

              tmpCardList.push(question);

              if (question.type == 1) {
                that.setData({
                  isContainA: true
                })
              } else if (question.type == 2) {
                that.setData({
                  isContainB: true
                })

              } else if (question.type == 3) {
                that.setData({
                  isContainC: true
                })
              } else if (question.type == 4) {
                that.setData({
                  isContainD: true
                })
              }


            })

            var objectArraySort = function (keyName) {
              return function (objectN, objectM) {
                var valueN = objectN[keyName]
                var valueM = objectM[keyName]
                if (valueN > valueM) return 1
                else if (valueN < valueM) return -1
                else return 0
              }
            }
            tmpCardList.sort(objectArraySort('type'))



          }
        }


        let arr = [];
        if (options.selects.length > 0) {
          arr = options.selects.split(",");
        }


        // console.log('cache' + options.idCache)
        that.setData({
          cards: tmpCardList,
          selects: arr

        })

      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
})