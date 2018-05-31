var WxParse = require('../../wxParse/wxParse.js');
var getCardUrl = 'http://tk.qikeya.com/api/testpaper/getDaytestItems' //每日一练答题卡
var getQuestion = 'http://tk.qikeya.com/api/testpaper/getQuestion/uid/2/'   //itemID/112  具体的试题 itemID是上面的id
var completeUrl = 'http://tk.qikeya.com/api/testpaper/putComplete/'     //每日一练答题卡

//模拟试题答题卡
var getTestCardUrl = 'http://tk.qikeya.com/api/testpaper/getTestpaterItems'
var getTestQuestionUrl = 'http://tk.qikeya.com/api/testpaper/getQuestion/'



//课堂练习答题卡
var yearCardUrl = 'http://tk.qikeya.com/api/testpaper/getClassCard';
var getYearQuestionUrl = 'http://tk.qikeya.com/api/testpaper/getClassExercise/qid/'
var app = getApp();

var touchDot = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = "";// 记录/清理时间记录  
var nth = 0;// 设置活动菜单的index





function countDownTime(times, that) {
  var timer = null;
  timer = setInterval(function () {
    var day = 0,
      hour = 0,
      minute = 0,
      second = 0;//时间默认值
    if (times > 0) {
      day = Math.floor(times / (60 * 60 * 24));
      hour = Math.floor(times / (60 * 60)) - (day * 24);
      minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    if (day <= 9) day = '0' + day;
    if (hour <= 9) hour = '0' + hour;
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;

    // this.setData({
    //   'item.time': '0'
    // });
    // console.log(hour + ":" + minute + ":" + second);
    that.setData({
      'item.time': hour + ":" + minute + ":" + second
    })
    times--;
  }, 1000);
  if (times <= 0) {
    // this.setData({
    //   'item.time': '0'
    // });
    clearInterval(timer);
  }
}


Page({
  data: {
    idCache: {},
    selectIndexs: [],
    remark: '',
    clock: '',
    swiper: {
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 300,
      current: 0
    },
    isAnalyze: false,
    cardList: [],
    currentQuestionId: null,
    currentSelectIndex: 10,
    indexArray: ["A", "B", "C", "D", "E"],
    rightAnswers: '',
    currentAnswers: '',
    isClick: false,
    radioItems: [],
    checkeds: "",
    item: {
      index: 1,
      title: '',
      count: 0,
      currentQuestionId: null,
      states: 0,
      time: 0
    },
    type: 0,
    tiType: 0,
    hidden: false,
    hiddenmodalput: true//可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框          
  },

  onLoad: function (options) {



    // debugger
    this.setData({
      idCache: { subject_id: options.subject_id, chapter_id: options.chapter_id, unit_id: options.unit_id, sortType: options.sortType },
      tiType: options.tiType
    })


    if (this.data.idCache.sortType == 3 || this.data.idCache.sortType == 4 || this.data.idCache.sortType == 5) {
      // count_down(this);

    }


    if (options.type) {
      this.setData({
        type: options.type
      });

      this.getSortQuestion()

    } else {

      this.getCardList()

    }






  },




  // 获取题库列表
  getCardList: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    var url = 'http://tk.qikeya.com/api/subject/getCardS/subject_id/' + this.data.idCache.subject_id + '/chapter_id/' + this.data.idCache.chapter_id + '/unit_id/' + this.data.idCache.unit_id;
    if (this.data.idCache.sortType == 3) {
      url = getCardUrl;




    } else if (this.data.idCache.sortType == 4) {
      url = getTestCardUrl;
    } else if (this.data.idCache.sortType == 5) {
      url = yearCardUrl
    }


    wx.request({
      url: url,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        wx.hideLoading()

        // if (res.data.data.num == 0) {
        //   return;
        // }


        let tmpCardList = []


        if (this.data.idCache.sortType >= 3 ) {

          countDownTime(res.data.pour_time * 60, this)
          tmpCardList = res.data.data;


        } else {

          if (Object.keys(res.data.data.List).length > 0) {
            Object.keys(res.data.data.List).forEach((questionName) => {
              res.data.data.List[questionName].forEach((question) => {


                if (question.type == this.data.type || this.data.type == 0) {

                  tmpCardList.push(question);
                }

              })
            })
          }

        }

        // console.log('tmpCardList')
        console.log(tmpCardList)
        // console.log('tmpCardList')


        var qesid = 0
        var itemqesid = 0
        if (this.data.idCache.sortType == 3 || this.data.idCache.sortType == 4 || this.data.idCache.sortType == 5) {
          qesid = tmpCardList[0].question_id
          itemqesid = tmpCardList[0].question_id
        } else {
          qesid = tmpCardList[0].id
          itemqesid = tmpCardList[0].id
        }

        this.setData({
          cardList: tmpCardList,
          currentQuestionId: qesid,

          item: {
            index: this.data.item.index,
            title: this.data.item.title,
            count: tmpCardList.length,
            currentQuestionId: itemqesid
          }
        }, () => {
          this.getCurrentQuestion()
        })


        // console.log('AAA' + this.data.currentQuestionId);
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })

        //显示出加载中的提示
        this.setData({ loadHidden: true })
      }
    })
  },
  // 获取当前题目数据
  getSortQuestion: function () {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    let url = 'http://tk.qikeya.com/api/topic/getTopic/tType/' + this.data.type + '/id/' + this.data.swiper.current + '/uid/2';

    wx.request({
      url: url,
      success: res => {
        wx.hideLoading()



        // debugger
        for (var i = 0; i < this.data.indexArray.length; i++) {

          var item = this.data.indexArray[i];
          if (res.data.data.topic.answer == item) {
            this.data.rightAnswers = i;
            break;
          }
        }

        var typeStr = "";
        var type = this.data.type;

        if (type == 1) {
          typeStr = "A1";
        } else if (type == 2) {
          typeStr = "A2";

        } else if (type == 3) {
          typeStr = "A3/A4";
        } else {
          typeStr = "B1";
        }

        this.setData({
          questionC: res.data.data.topic,
          rightAnswers: this.data.rightAnswers,
          'item.title': typeStr
        })


        // console.log(res.data.data.topic)
        this.setData({
          cardList: this.data.cardList,
          toastHidden: false,
          currentQuestionId: res.data.data.topic.id,

          item: {
            index: this.data.item.index,
            title: this.data.item.title,
            count: res.data.data.snum,
            currentQuestionId: res.data.data.topic.id,
            states: res.data.data.states
          }
        })

        if (this.data.cardList.length == 0) {
          var cardsL = []
          for (var i = 0; i < res.data.data.snum; i++) {
            cardsL.push({})
          }

          this.setData({
            cardList: cardsL
          })
        }



        this.data.cardList[this.data.swiper.current] = res.data.data.topic
        this.setData({
          cardList: this.data.cardList
        })






        // 本地缓存
        try {
          wx.setStorageSync('key', res.data.data.topic.id)
        } catch (e) {
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })

        //显示出加载中的提示
        this.setData({ loadHidden: true })
      }
    })
  },

  // 获取当前题目数据
  getCurrentQuestion: function () {



    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    let url = 'https://tk.qikeya.com/api/question/getQuestionSingle/id/' + this.data.currentQuestionId;
    if (this.data.idCache.sortType == 3) {
      url = getQuestion + 'itemID/' + this.data.currentQuestionId;
    } else if (this.data.idCache.sortType == 4) {
      url = getTestQuestionUrl + 'itemID/' + this.data.currentQuestionId;
    } else if (this.data.idCache.sortType == 5) {
      url = getYearQuestionUrl + this.data.currentQuestionId + '/uid/';
    }

    console.log(url)
    wx.request({
      url: url,
      success: res => {
        wx.hideLoading()

        //console.log(res.data)

        if (!res.data) {
          this.setData({ toastHidden: false })
          return false
        }


        // debugger
        for (var i = 0; i < this.data.indexArray.length; i++) {

          var item = this.data.indexArray[i];
          if (res.data.data.answer == item) {
            this.data.rightAnswers = i;
            break;
          }
        }

        var typeStr = "";
        var type = res.data.data.type;
        // console.log("type" + type);
        if (type == 1) {
          typeStr = "A1";
        } else if (type == 2) {
          typeStr = "A2";

        } else if (type == 3) {
          typeStr = "A3/A4";
        } else {
          typeStr = "B1";
        }

        this.setData({
          questionC: res.data.data,
          rightAnswers: this.data.rightAnswers,
          'item.title': typeStr
        })
        this.setData({
          cardList: this.data.cardList.map((item) => {
            if (res.data && item.id == this.data.currentQuestionId) {
              item = res.data.data
            }
            if (this.data.idCache.sortType == 3 || this.data.idCache.sortType == 4 || this.data.idCache.sortType == 5) {

              if (res.data && item.question_id == this.data.currentQuestionId) {
                item = res.data.data
              }

            }
            return item
          }),
          toastHidden: false,
          'item.states': res.data.data.states,
        })


        // 本地缓存
        try {

          if (this.data.idCache.sortType == 3 || this.data.idCache.sortType == 4 || this.data.idCache.sortType == 5) {
            wx.setStorageSync('key', res.data.data.question_id)
          } else {
            wx.setStorageSync('key', res.data.data.id)
          }
        } catch (e) {
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })

        //显示出加载中的提示
        this.setData({ loadHidden: true })
      }
    })
  },
  onShow: function () {

    // console.log(this.data.cardList);

    // console.log('sss')
    var current = wx.getStorageSync("currentIndex")
    wx.removeStorageSync("currentIndex")
    // console.log(current)
    // console.log('rrrr')



    if (current && current > 0) {
      var qesid = 0
      if (this.data.idCache.sortType == 3 || this.data.idCache.sortType == 4 || this.data.idCache.sortType == 5) {
        qesid = this.data.cardList[current - 1].question_id

      } else {
        qesid = this.data.cardList[current - 1].id
      }
      this.setData({
        currentQuestionId: qesid,
        'item.index': current,
        'swiper.current': current - 1
      })


      if (this.type == 0) {
        this.getCurrentQuestion()
      } else {
        this.getSortQuestion()
      }
    }


  },
  changeSwiper: function (e) {
    var that = this
    // console.log(e.detail.current)

    if (this.data.type != 0) {
      this.setData({

        'swiper.current': e.detail.current,
        'item.index': e.detail.current + 1,
        'item.currentQuestionId': e.detail.current,

        isClick: false,

      })

      if (!this.data.cardList[this.data.swiper.current].choices) {

        // console.log(e.detail.current);
        this.getSortQuestion()
      }

      return
    }

    var qesid = 0
    var itemqesid = 0
    if (this.data.idCache.sortType == 3 || this.data.idCache.sortType == 4 || this.data.idCache.sortType == 5) {
      qesid = this.data.cardList[e.detail.current].question_id
      itemqesid = this.data.cardList[e.detail.current].question_id
    } else {
      qesid = this.data.cardList[e.detail.current].id
      itemqesid = this.data.cardList[e.detail.current].id
    }

    this.setData({

      'swiper.current': e.detail.current,
      currentQuestionId: qesid,
      'item.index': e.detail.current + 1,
      'item.currentQuestionId': itemqesid,

      isClick: false,
    }, () => {


      if (!this.data.cardList[this.data.swiper.current].choices) {

        // console.log(e.detail.current);
        this.getCurrentQuestion(e.detail.current);
      }
    })

    // console.log('BBB' + that.data.currentQuestionId);
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
  iRemark: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  //确认  
  confirm: function (e) {
    this.setData({
      confirmColor: "#3ea5ff",
      hiddenmodalput: true,
      jsInput: function (e) {
        this.setData({ inpval: e.detail.value })
      }

    })


    wx.request({
      url: 'http://tk.qikeya.com/api/question/putNotes/question_id/' + this.data.currentQuestionId + '/user_id/1/remark/' + this.data.remark,
      success: res => {
        this.data.cardList[this.data.item.index - 1].remark = this.data.remark;
        // console.log(this.data.remark)
        this.setData({
          cardList: this.data.cardList
        })
        // console.log(this.data.cardList)
      }
    })


  },
  lookResult: function (e) {
    this.setData({
      isAnalyze: !this.data.isAnalyze
    })
  },
  lookCard: function (e) {
    var that = this;
    var selectModel = JSON.stringify(that.data.idCache)

    let url = '../answercard/answercard?selects=' + that.data.selectIndexs + '&idCache=' + selectModel
    if (that.data.type <= 4 && that.data.type) {
      url = '../answercard/answercard?selects=' + that.data.selectIndexs + '&idCache=' + selectModel + '&type=' + that.data.type
    }
    if (that.data.tiType) {
      url = '../answercard/answercard?selects=' + that.data.selectIndexs + '&idCache=' + selectModel + '&type=' + that.data.tiType
    }

    wx.navigateTo({
      url: url,
      success: res => {

      }
    })




  },
  collectTap: function () {
    var that = this;
    let url = "http://tk.qikeya.com/api/question/putCancelCollect/question_id/' + this.data.currentQuestionId +'/user_id/3"
    if (that.data.item.states == 0) {
      url = 'http://tk.qikeya.com/api/question/putCollect/question_id/' + this.data.currentQuestionId + '/user_id/3'
    }
    wx.request({
      url: url,
      success: res => {
        // console.log('收藏成功')

        that.setData({
          'item.states': that.data.item.states == 0 ? 1 : 0
        })


      }
    })
  },
  radioChange: function (e) {
    var that = this;






    var checked = e.detail.value;
    // console.log(checked);

    var select = { index: that.data.item.index, type: that.data.item.title };

    that.data.selectIndexs.push(that.data.currentQuestionId);

    var answers = ['A', 'B', 'C', 'D', 'E']

    this.data.currentAnswers = checked - 10;

    let form = this.data.idCache.sortType;
    if (that.data.type) {
      form = 4;
    }
    var URL = 'http://tk.qikeya.com/api/question/putAnswer/question_id/' + this.data.currentQuestionId + '/answer/' + answers[this.data.rightAnswers] + '/user_id/1/user_answer/' + answers[this.data.currentAnswers] + '/from/' + form;

    wx.request({
      url: URL,
      success: res => {
        console.log(res.data);
      }
    })

    that.data.cardList[that.data.item.index - 1].isClick = '中国';
    that.data.cardList[that.data.item.index - 1].currentAnswers = this.data.currentAnswers;
    console.log(that.data.cardList)

    that.setData({

      currentAnswers: this.data.currentAnswers,
      isClick: true,
    })
    that.setData({
      currentSelectIndex: checked,
      cardList: that.data.cardList,
    })
  }
})