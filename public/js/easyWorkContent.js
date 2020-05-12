/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: http://gitlab.yzf.net/wuwenzhou
 * @Date: 2020-05-12 19:08:59
 * @LastEditors: 吴文周
 * @LastEditTime: 2020-05-12 21:02:26
 */
// eslint-disable-next-line no-undef
!function(t){function n(e){if(r[e])return r[e].exports;var i=r[e]={exports:{},id:e,loaded:!1};return t[e].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){r(1)(window)},function(t,n){t.exports=function(t){var n="RealXMLHttpRequest";t.hookAjax=function(t){function r(n){return function(){var r=this.hasOwnProperty(n+"_")?this[n+"_"]:this.xhr[n],e=(t[n]||{}).getter;return e&&e(r,this)||r}}function e(n){return function(r){var e=this.xhr,i=this,o=t[n];if("function"==typeof o)e[n]=function(){t[n](i)||r.apply(e,arguments)};else{var u=(o||{}).setter;r=u&&u(r,i)||r;try{e[n]=r}catch(t){this[n+"_"]=r}}}}function i(n){return function(){var r=[].slice.call(arguments);if(!t[n]||!t[n].call(this,r,this.xhr))return this.xhr[n].apply(this.xhr,r)}}return window[n]=window[n]||XMLHttpRequest,XMLHttpRequest=function(){var t=new window[n];for(var o in t){var u="";try{u=typeof t[o]}catch(t){}"function"===u?this[o]=i(o):Object.defineProperty(this,o,{get:r(o),set:e(o),enumerable:!0})}this.xhr=t},window[n]},t.unHookAjax=function(){window[n]&&(XMLHttpRequest=window[n]),window[n]=void 0},t.default=t}}]);
(function () {
  var ajaxList = []
  // eslint-disable-next-line no-undef
  chrome.storage.local.get(['EWData'], function (result) {
    if (result.EWData && JSON.parse(result.EWData).ajax) {
      ajaxList = JSON.parse(result.EWData).ajaxList
      action()
    }
  })
  // eslint-disable-next-line no-undef
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key]
      if (storageChange.newValue) {
        ajaxList = JSON.parse(storageChange.newValue).ajaxList
        action()
      }
    }
  })
  function tryParseJson (v, xhr) {
    var re = ''
    ajaxList.forEach(item => {
      if (xhr.responseURL.indexOf(item.req)) {
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
  function getterFactory (attr) {
    return function () {
      var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
      var attrGetterHook = (proxy[attr] || {})["getter"]
      return attrGetterHook && attrGetterHook(v, this) || v
    }
  }
  function setterFactory (attr) {
    return function (v) {
        var xhr = this.xhr;
        var that = this;
        var hook = proxy[attr];
        // hookAjax  event callbacks such as `onload`、`onreadystatechange`...
        if (attr.substring(0, 2) === 'on') {
            that[attr + "_"] = v;
            xhr[attr] = function (e) {
                e = configEvent(e, that)
                var ret = proxy[attr] && proxy[attr].call(that, xhr, e)
                ret || v.call(that, e);
            }
        } else {
            //If the attribute isn't writable, generate proxy attribute
            var attrSetterHook = (hook || {})["setter"];
            v = attrSetterHook && attrSetterHook(v, that) || v
            this[attr + "_"] = v;
            try {
                // Not all attributes of xhr are writable(setter may undefined).
                xhr[attr] = v;
            } catch (e) {
            }
        }
    }
  }
  function action () {
    var realXhr = "_rxhr"
    window[realXhr] = window[realXhr] || XMLHttpRequest
    XMLHttpRequest = function () {
        var xhr = new window[realXhr];
        // We shouldn't hookAjax XMLHttpRequest.prototype because we can't
        // guarantee that all attributes are on the prototype。
        // Instead, hooking XMLHttpRequest instance can avoid this problem.
        for (var attr in xhr) {
            var type = "";
            try {
                type = typeof xhr[attr] // May cause exception on some browser
            } catch (e) {
            }
            if (type === "function") {
                // hookAjax methods of xhr, such as `open`、`send` ...
                // this[attr] = hookFunction(attr);
            } else {
                Object.defineProperty(this, attr, {
                    get: getterFactory(attr),
                    set: setterFactory(attr),
                    enumerable: true
                })
            }
        }
        var that = this;
        xhr.getProxy = function () {
            return that
        }
        this.xhr = xhr;
    }
    // hookAjax({
    //   responseText: {
    //     getter: tryParseJson
    //   },
    //   response: {
    //     getter: tryParseJson
    //   },
    //   onreadystatechange: function (xhr) {
    //   },
    //   onload: function (xhr) {
    //   },
    //   // 拦截方法
    //   open: function (arg, xhr) {
    //   },
    //   send: function (arg, xhr) {
    //   }
    // })
    return window[realXhr]
  }
})()
