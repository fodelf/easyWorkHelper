/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: http://gitlab.yzf.net/wuwenzhou
 * @Date: 2020-05-12 19:14:13
 * @LastEditors: 吴文周
 * @LastEditTime: 2020-05-12 23:44:58
 */
// 命名空间
!function(t){function n(e){if(r[e])return r[e].exports;var i=r[e]={exports:{},id:e,loaded:!1};return t[e].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){r(1)(window)},function(t,n){t.exports=function(t){var n="RealXMLHttpRequest";t.hookAjax=function(t){function r(n){return function(){var r=this.hasOwnProperty(n+"_")?this[n+"_"]:this.xhr[n],e=(t[n]||{}).getter;return e&&e(r,this)||r}}function e(n){return function(r){var e=this.xhr,i=this,o=t[n];if("function"==typeof o)e[n]=function(){t[n](i)||r.apply(e,arguments)};else{var u=(o||{}).setter;r=u&&u(r,i)||r;try{e[n]=r}catch(t){this[n+"_"]=r}}}}function i(n){return function(){var r=[].slice.call(arguments);if(!t[n]||!t[n].call(this,r,this.xhr))return this.xhr[n].apply(this.xhr,r)}}return window[n]=window[n]||XMLHttpRequest,XMLHttpRequest=function(){var t=new window[n];for(var o in t){var u="";try{u=typeof t[o]}catch(t){}"function"===u?this[o]=i(o):Object.defineProperty(this,o,{get:r(o),set:e(o),enumerable:!0})}this.xhr=t},window[n]},t.unHookAjax=function(){window[n]&&(XMLHttpRequest=window[n]),window[n]=void 0},t.default=t}}]);
var _EWorkHelperAjaxList = []
function tryParseJson (v, xhr) {
  var re = ''
  _EWorkHelperAjaxList.forEach(item => {
    if (xhr.responseURL.indexOf(item.req) > -1) {
      if (xhr.status === 200 && xhr.readyState === 4) {
        re = item.value
      }
    }
  })
  if (re) {
    return re
  } else {
    return v
  }
}
window.addEventListener('message', function (event) {
  const data = event.data
  if (data.type && data.type === '_ew') {
    _EWorkHelperAjaxList = data.mes
    hookAjax({
      responseText: {
        getter: tryParseJson
      },
      response: {
        getter: tryParseJson
      },
      onreadystatechange: function (xhr) {
      },
      onload: function (xhr) {
      },
      // 拦截方法
      open: function (arg, xhr) {
      },
      send: function (arg, xhr) {
      }
    })
  }
}, false)
