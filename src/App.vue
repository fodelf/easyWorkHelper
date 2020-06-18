<!--
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2020-05-11 21:44:05
 * @LastEditors: 吴文周
 * @LastEditTime: 2020-06-18 11:57:00
 * @FilePath: /workespacemanger/Users/fodelf/git/easyWorkHelper/src/App.vue
 -->
<template>
  <div id="app">
    <van-nav-bar title="EasyWork小助手" left-text="首页">
    </van-nav-bar>
    <van-collapse v-model="activeName" :border = flag accordion>
      <van-collapse-item title="拦截资源" name="1">
        <van-cell title="拦截列表">
          <template #right-icon>
             <van-switch v-model="EWData.action" size="18" style= 'margin-right: 6px;' />
            <van-icon name="add" style='cursor: pointer;position: relative;top: -2px;' @click="showSource" color="#1989fa" size ='24' />
          </template>
        </van-cell>
        <van-form style='max-height:300px;overflow-y: auto;'>
          <van-cell-group :title="item.name" v-for='(item, index) in EWData.sourceList' :key="index">
            <van-switch v-model="item.checked" size="18"  style='position: absolute;z-index: 10;right: 45px;top: -27px;'/>
            <van-icon name="clear" @click="deleteItem(index)" color="#1989fa" size ='24'  style='position: absolute;z-index: 10;right: 15px;top: -29px;cursor: pointer;' />
            <van-field
              v-model="item.req"
              name="拦截地址"
              label="拦截地址"
              placeholder="请输入http://开头地址否则拦截无效"
            >
            </van-field>
            <van-field
              v-model="item.value"
                name="替换资源"
                label="替换资源"
              >
            </van-field>
          </van-cell-group>
        </van-form>
      </van-collapse-item>
      <van-collapse-item title="拦截请求(已使用Ajax-hook的项目会冲突)" name="2">
        <van-cell title="拦截列表">
          <template #right-icon>
             <van-switch v-model="EWData.ajax" size="18" style= 'margin-right: 6px;' />
            <van-icon name="add" style='cursor: pointer;position: relative;top: -2px;' @click="showAjaxAction" color="#1989fa" size ='24' />
          </template>
        </van-cell>
        <van-form style='max-height:350px;overflow-y: auto;'>
          <van-cell-group :title="item.name" v-for='(item, index) in EWData.ajaxList' :key="index">
            <van-switch v-model="item.checked" size="18"  style='position: absolute;z-index: 10;right: 45px;top: -27px;'/>
            <van-icon name="clear" @click="deleteItem(index,'ajax')" color="#1989fa" size ='24'  style='position: absolute;z-index: 10;right: 15px;top: -29px;cursor: pointer;' />
            <van-field
              v-model="item.req"
              name="拦截规则"
              label="拦截规则"
              placeholder="请输入需要拦截的url部分字符串"
            >
            </van-field>
            <van-field
              v-model="item.url"
              label="替换url"
            />
            <van-field
              v-model="item.value"
              rows="4"
              type="textarea"
              name="替换内容"
              label="替换内容"
              @input = changeJson(index)
              >
            </van-field>
            <van-cell title="JSON编辑器">
              <!-- 使用 right-icon 插槽来自定义右侧图标 -->
              <template #right-icon>
                <van-switch v-model="item.isShowEditor" size="18" />
              </template>
            </van-cell>
            <vue-json-editor v-if="item.isShowEditor"
            v-model="item.JSON" lang="zh"
            @json-change="onJsonChange(index)" @json-save = "onJsonSave" />
          </van-cell-group>
        </van-form>
      </van-collapse-item>
    </van-collapse>
    <van-dialog v-model="sourceShow" title="新增资源拦截规则" show-cancel-button  @confirm = confirm @close = close>
      <van-form>
        <van-field
          v-model="source.name"
          name="rule"
          label="规则名称"
          :rules="[{ required: true, message: '请填写规则名称' }]"
        />
        <van-field
          v-model="source.req"
          name="rule"
          label="拦截地址"
          placeholder="请输入http://开头地址否则拦截无效"
          :rules="[{ required: true, message: '请填写拦截地址' }]"
        />
        <van-field
          v-model="source.value"
          name="detail"
          label="替换资源"
          :rules="[{ required: true, message: '请填写替换资源' }]"
        />
      </van-form>
    </van-dialog>
    <van-dialog v-model="showAjax" title="新增请求拦截规则" show-cancel-button  @confirm = confirmAjax @close = close>
      <van-form>
        <van-field
          v-model="source.name"
          name="rule"
          label="请求名称"
          :rules="[{ required: true, message: '请填写请求名称' }]"
        />
        <van-field
          v-model="source.req"
          name="rule"
          label="拦截规则"
          placeholder="请输入需要拦截的url部分字符串"
          :rules="[{ required: true, message: '请填写拦截规则' }]"
        />
        <van-field
          v-model="source.url"
          name="rule"
          label="替换url"
          placeholder="可以拦截符合规则的url并进行替换请求的url"
        />
        <van-field
          v-model="source.value"
          rows="4"
          type="textarea"
          name="detail"
          label="替换内容"
          placeholder="可以拦截符合规则的url并进行替换返回结果"
          :rules="[{ required: true, message: '请填写替换内容' }]"
        />
      </van-form>
    </van-dialog>
  </div>
</template>
<script>
import vueJsonEditor from 'vue-json-editor'
export default {
  components: {
    vueJsonEditor
  },
  data () {
    return {
      activeName: '1',
      sourceShow: false,
      showAjax: false,
      flag: false,
      EWData: {
        action: true,
        sourceList: [],
        ajax: false,
        ajaxList: []
      },
      source: {
        name: '',
        req: '',
        value: '',
        url: '',
        JSON: {},
        checked: true
      }
    }
  },
  methods: {
    changeJson (index) {
      try {
        const list = JSON.parse(JSON.stringify(this.EWData.ajaxList))
        list[index].JSON = JSON.parse(list[index].value)
        this.$set(this.EWData, 'ajaxList', list)
      } catch (error) {
        // item.JSON = {}
      }
    },
    onJsonChange (index) {
      try {
        this.$nextTick(() => {
          const list = JSON.parse(JSON.stringify(this.EWData.ajaxList))
          list[index].value = JSON.stringify(list[index].JSON)
          this.$set(this.EWData, 'ajaxList', list)
        })
      } catch (error) {
        // item.JSON = {}
      }
    },
    onJsonSave () {
    },
    showSource () {
      this.sourceShow = true
    },
    showAjaxAction () {
      this.showAjax = true
    },
    confirm () {
      if (this.source.name && this.source.value) {
        this.EWData.sourceList.push(JSON.parse(JSON.stringify(this.source)))
        this.source.name = ''
        this.source.value = ''
        this.source.req = ''
        this.source.url = ''
        this.sourceShow = false
      }
    },
    close () {
      this.source = {
        name: '',
        req: '',
        value: '',
        JSON: {},
        checked: true
      }
    },
    confirmAjax () {
      if (this.source.name && this.source.value) {
        try {
          const value = JSON.parse(this.source.value)
          this.source.JSON = value
        } catch (error) {
          // item.JSON = {}
        }
        this.EWData.ajaxList.push(JSON.parse(JSON.stringify(this.source)))
        this.source.name = ''
        this.source.value = ''
        this.source.req = ''
        this.sourceShow = false
      }
    },
    setValue () {
      window.localStorage.setItem('EWData', JSON.stringify(this.EWData))
      chrome.storage && chrome.storage.local.set({['EWData']: JSON.stringify(this.EWData)})
    },
    deleteItem (index, type) {
      if (type) {
        this.EWData.ajaxList.splice(index, 1)
      } else {
        this.EWData.sourceList.splice(index, 1)
      }
    }
  },
  created () {
    if (window.localStorage.EWData) {
      this.EWData = JSON.parse(window.localStorage.EWData)
    }
  },
  watch: {
    EWData: {
      handler (newValue, oldValue) {
        this.setValue()
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
#app {
  // width: 375px;
  // height: 600px;
  height: 100%;
  background: white;
  /deep/.van-field__label {
    flex: none;
    box-sizing: border-box;
    width: 90px;
    display: flex;
    align-items: center;
  }
}
</style>
