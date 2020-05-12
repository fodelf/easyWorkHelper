/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: http://gitlab.yzf.net/wuwenzhou
 * @Date: 2020-05-12 19:08:59
 * @LastEditors: 吴文周
 * @LastEditTime: 2020-05-12 23:48:07
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
