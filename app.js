// //app.js
// // 这里是调用公共函数库  
// var util = require('utils/util.js')



// App({
//   /**  
//   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）  
//   */
//   onLaunch: function (options) {

//     // 调用API从本地缓存中获取数据  
//     var that = this
//     var logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)
//   },

//   /**  
//   * 当小程序启动，或从后台进入前台显示，会触发 onShow  
//   */
//   onShow: function (options) {

//     var that = this,
//       // scenes是场景值它的类型是整形  
//       scenes = options.scene,
//       // sid是参数,建议兼容ios和android的时候强转换为整形  
//       sid = Number(options.query.sid)

//     // 获取用户信息  
//     that.getUserInfo(function (userInfo) {
//       // 判断场景是否是从公众号进入（这里的意思是如果用户从公众号的自定义菜单进入的话且参数sid为1的话触发什么方法）  
//       // 获取场景值在onLaunch方法中也可以获取到，但是呢由于业务要求我们的这个方法需要用户进入就会触发  
//       // 各位可以根据需求去决定在哪里获取合适一些,onLaunch是小程序未关闭的情况下只执行一次,所以各位一定要考虑清楚  
//       if (scenes === 1035 && sid === 1) {
//         // 这里是从什么场景下要执行的方法  
//         //console.log(44);
//       }
//     })
//   },

//   /**  
//   * 获取用户信息  
//   */
//   getUserInfo: function (cb) {
//     var that = this
    
//     if (this.globalData.userInfo) {

//       typeof cb == "function" && cb(this.globalData.userInfo)
     
//     } else {
     
//       // 调用登录接口  
//       wx.login({
        
//         success: function (res) {
          
//           // 登录成功  
//           // 在这里登录的时候会返回一个登录凭证，以前是发送一次请求换一个，现在好像是登录凭证有5分钟的有效时间  
//           // 从这种情况来看微信小程序的发展还是不错的，以前估计没多少人访问，现在访问量上去后后台的布局都重新架构了  
//           var code = res.code// 登录凭证  

//           // 获取用户信息  
//           wx.getUserInfo({
//             // 当你获取用户信息的时候会弹出一个弹框是否允许授权  
            
//             // 这里点击允许触发的方法  
//             success: function (res2) {
              
//               that.globalData.userInfo = res2.userInfo

//               // 准备数据（下面的这些参数都是必须参数，请不要问为什么，看文档去吧）  
//               var data = { encryptedData: res2.encryptedData, iv: res2.iv, code: code }
//               // 请求自己的服务器(在这里我结合promise封装了一下request请求，下面会把方法给大家分享一下)  
//               util.commonAjax('方法名', 1, data)
//                 .then(function (resolve) {
//                   // 这里自然不用解释了，这是接口返回的参数  
//                   if (resolve.data.status === '200') {
//                     // 成功  
//                     wx.setStorageSync('userInfo', resolve.data.data)
//                     // 新手们注意一下，记得把下面这个写到这里，有好处。  
//                     typeof cb == "function" && cb(that.globalData.userInfo)
//                   } else {
//                     // 失败  
//                   }
//                 })
//             },

//             // 这里是点击拒绝触发的方法  
//             fail: function (res2) {
//               console.log(res2)
//               // 在这里做一下兼容，有些同行业的用户会点击拒绝玩一玩看你们的小程序是否存在bug，  
//               // 所以在这里还是加上下面这两行代码吧，打开微信小程序的设置，允许小程序重新授权的页面  
//               wx.openSetting({
//                 success: (res) => {
//                   // 下面的代码格式按照我的写，不要看工具打印的什么，在这里提醒大家一句，有时候不能相信开发者工具，因为  
//                   // android和ios还有工具底层的js库是不同的，有些时候坑的你是一点脾气也没有，所以大家注意一下，  
//                   // 不相信的慢慢的去自己跳坑吧  
//                   if (res.authSetting["scope.userInfo"]) {
//                     // 进入这里说明用户重新授权了，重新执行获取用户信息的方法  
//                     that.getUserInfo()
//                   }
//                 }
//               })
//             }
//           })
//         }
//       })
//     }
//   },

//   /**  
//   * 全局变量配置（在这里放一些常量和配置文件，如果公共参数多的话大家也可以去重新布局一个文件，在里面进行设置）  
//   */
//   globalData: {
//     userInfo: null,
//     url: 'https://tk.qikeya.com/'
//   }
// }) 