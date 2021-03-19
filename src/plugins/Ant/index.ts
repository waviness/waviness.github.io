import { Button, Input, Form, Select, Row, Radio, Col, Icon, Checkbox, Tabs, Drawer, Dropdown, Menu, Popconfirm, Divider, Spin, Card, Table, Tree, TreeSelect, InputNumber, Modal, Upload, Empty } from 'ant-design-vue'

const ant = {
  install(Vue: any) {
    Vue.use(Button)
    Vue.use(Input)
    Vue.use(InputNumber)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Icon)
    Vue.use(Checkbox)
    Vue.use(Spin)
    Vue.use(Dropdown)
    Vue.use(Popconfirm)
    Vue.use(Divider)
    Vue.use(Card)
    Vue.use(Table)
    Vue.use(Tree)
    Vue.use(TreeSelect)
    Vue.use(Form)
    Vue.use(Select)
    Vue.use(Radio)
    Vue.use(Tabs)
    Vue.use(Menu)
    Vue.use(Drawer)
    Vue.use(Modal)
    Vue.use(Upload)
    Vue.use(Empty)
  }
}
export default ant
