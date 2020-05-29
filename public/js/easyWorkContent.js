/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: http://gitlab.yzf.net/wuwenzhou
 * @Date: 2020-05-12 19:08:59
 * @LastEditors: 吴文周
 * @LastEditTime: 2020-05-26 16:46:31
 */
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
// eslint-disable-next-line no-undef
script.setAttribute('src', chrome.extension.getURL('js/action.js'))
document.documentElement.appendChild(script)
script.addEventListener('load', () => {
  // eslint-disable-next-line no-undef
  chrome.storage.local.get(['EWData'], (result) => {
    // eslint-disable-next-line no-prototype-builtins
    if (result.hasOwnProperty('EWData')) {
      if (JSON.parse(result.EWData).ajax) {
        postMessage({ type: '_ew', mes: JSON.parse(result.EWData).ajaxList })
      }
    }
  })
})
// eslint-disable-next-line no-undef
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key]
    if (storageChange.newValue) {
      if (JSON.parse(storageChange.newValue).ajax) {
        postMessage({ type: '_ew', mes: JSON.parse(storageChange.newValue).ajaxList })
      }
    }
  }
})
let iframe;
let iframeLoaded = false;
// 只在最顶层页面嵌入iframe
if (window.self === window.top) {

  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      iframe = document.createElement('iframe');
      //iframe.className = "api-interceptor";
      iframe.style.setProperty('height', '100%', 'important');
      iframe.style.setProperty('width', '400px', 'important');
      iframe.style.setProperty('min-width', '1px', 'important');
      iframe.style.setProperty('position', 'fixed', 'important');
      iframe.style.setProperty('top', '0', 'important');
      iframe.style.setProperty('right', '0', 'important');
      iframe.style.setProperty('z-index', '9999999999999', 'important');
      iframe.style.setProperty('transform', 'translateX(420px)', 'important');
      iframe.style.setProperty('transition', 'all .4s', 'important');
      iframe.style.setProperty('box-shadow', '0 0 15px 2px rgba(0,0,0,0.12)', 'important');
      iframe.frameBorder = "none";
      iframe.src = chrome.extension.getURL("index.html")
      try {
        document.body.appendChild(iframe);
      } catch (error) {
      }
      let show = false
      chrome.runtime.onMessage.addListener((msg, sender) => {
        if (msg == 'toggle') {
          show = !show;
          iframe.style.setProperty('transform', show ? 'translateX(0)' : 'translateX(420px)', 'important');
        }

        return true;
      });
    }
  }
}
