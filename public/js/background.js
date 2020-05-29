/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: http://gitlab.yzf.net/wuwenzhou
 * @Date: 2020-05-12 08:51:15
 * @LastEditors: 吴文周
 * @LastEditTime: 2020-05-26 16:45:11
 */
var EWMap = []
var action = false
var typeMap = {
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  json: "text/json",
  xml: "text/xml",
  jpg: "image/jpeg",
  gif: "image/gif",
  png: "image/png",
  webp: "image/webp"
}

function getLocalStorage () {
  EWMap = window.localStorage.EWData
    ? JSON.parse(window.localStorage.EWData).sourceList
    : EWMap
  action = window.localStorage.EWData
    ? JSON.parse(window.localStorage.EWData).action
    : false
}

function getLocalFileUrl (url) {
  var arr = url.split('.')
  var type = arr[arr.length - 1]
  var xhr = new XMLHttpRequest()
  xhr.open('get', url, false)
  xhr.send(null)
  var content = xhr.responseText || xhr.responseXML;
  if (!content) {
    return false
  }
  content = encodeURIComponent(
    type === 'js'
      ? content.replace(/[\u0080-\uffff]/g, function ($0) {
          var str = $0.charCodeAt(0).toString(16)
          return "\\u" + "00000".substr(0, 4 - str.length) + str
        })
      : content
  );
  return "data:" + (typeMap[type] || typeMap.txt) + ";charset=utf-8," + content;
}

// eslint-disable-next-line no-undef
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    var url = details.url
    for (var i = 0, len = EWMap.length; i < len; i++) {
      // var reg = new RegExp(EWMap[i].req, 'gi')
      if (
        EWMap[i].checked && EWMap[i].req &&
        typeof EWMap[i].value === 'string' &&
        // reg.test(url)
        url.indexOf(EWMap[i].req) >= 0 &&
        action
      ) {
        if (!/^file:\/\//.test(EWMap[i].value)) {
          url = EWMap[i].value
          // do {
          //   // url = url.replace(reg, EWMap[i].value)
          //   url = EWMap[i].value
          // } while (reg.test(url))
        } else {
          url = getLocalFileUrl(EWMap[i].value)
          // do {
          //   // url = getLocalFileUrl(url.replace(reg, EWMap[i].value))
          //   url = getLocalFileUrl(EWMap[i].value)
          //   // url = EWMap[i].value
          // } while (reg.test(url))
        }
      }
    }
    return url === details.url ? {} : { redirectUrl: url }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
)
// chrome.webRequest.onCompleted.addListener((details)=>{
// console.log(details)
// return null
// })
// chrome.webRequest.onCompleted.addListener(
//   function (details) {
//     console.log(details)
//   }
// )

getLocalStorage()
window.addEventListener('storage', getLocalStorage, false);
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, "toggle");
  })
});