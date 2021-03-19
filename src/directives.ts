import Vue from 'vue'

const loadmore = Vue.directive('loadmore', {
  inserted: function (el: any, binding: any) {
    const SELECTWRAP_DOM: any = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    const that: any = SELECTWRAP_DOM
    SELECTWRAP_DOM.addEventListener('scroll', function () {
      const CONDITION = that.scrollHeight - that.scrollTop <= that.clientHeight
      if (CONDITION) {
        binding.value()
      }
    })
  }
})
export default {
  loadmore
}
