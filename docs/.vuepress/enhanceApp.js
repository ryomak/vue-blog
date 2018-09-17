import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/ja'
import axios from 'axios'

export default ({
  Vue,
  options,
  router
}) => {
  Vue.use(Element,{locale})
}