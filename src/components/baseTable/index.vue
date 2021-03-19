<!-- 表格基本封装 可根据需求使用 具体传参可根据需要增加和修改 -->
<template>
  <div class="baseTable">
    <el-table
      id="iTable"
      ref="mutipleTable"
      tooltip-effect="light"
      highlight-current-row
      :max-height="tableHeight"
      v-loading.iTable="options.loading"
      :data="tableDataList"
      :stripe="options.stripe"
      :border="options.border"
      :size="options.size"
      @row-click="handleClickChange"
      @select="handleSelectionChange"
    >
      <!--region 选择框-->
      <el-table-column v-if="options.mutiSelect" type="selection" style="width: 55px;"></el-table-column>
      <!--endregion-->
      <!--region 数据列-->
      <template v-for="(column, index) in columns">
        <el-table-column
          :prop="column.prop"
          :key="column.label"
          :label="column.label"
          :align="column.align"
          :min-width="column.minWidth"
          :width="column.width"
          :show-overflow-tooltip="column.showoverflow"
          :formatter="column.formatter"
        >
          <template slot-scope="scope">
            <template v-if="!column.render">
              <template v-if="!scope.row.editing || !column.editingType">
                <template v-if="column.formatter">
                  <span v-if="!column.showoverflow && column.showoverflowAndCopy">
                    <el-popover trigger="hover" placement="top">
                      <span v-html="column.formatter(scope.row, column)"></span>
                      <div slot="reference" class="name-wrapper">
                        <span v-html="column.formatter(scope.row, column)"></span>
                      </div>
                    </el-popover>
                  </span>
                  <span v-else v-html="column.formatter(scope.row, column)"></span>
                </template>
                <template v-else>
                  <span v-if="!column.showoverflow && column.showoverflowAndCopy">
                    <el-popover trigger="hover" placement="top">
                      <span>{{ scope.row[column.prop] }}</span>
                      <div slot="reference" class="name-wrapper">
                        <span>{{ scope.row[column.prop] }}</span>
                      </div>
                    </el-popover>
                  </span>
                  <span v-else>{{ scope.row[column.prop] }}</span>
                </template>
              </template>
              <template v-else>
                <el-input
                  v-if="column.editingType === 'input'"
                  size="mini"
                  v-model="scope.row[column.prop]"
                  @click.stop.native="inputClick(scope.$index, column.prop)"
                  @input="inputChange(scope.$index, column.prop)"
                  :borderColor="scope.row.isSaveClick && !column.nomustEnter && !scope.row[column.prop] ? 'danger' : ''"
                  :placeholder="`请输入${column.label}`"
                ></el-input>
                <el-select
                  v-if="column.editingType === 'select'"
                  @change.stop.native="val => selectChange(val, scope.$index, column.prop)"
                  size="mini"
                  v-model="scope.row[column.prop]"
                  filterable
                  :placeholder="`请选择${column.label}`"
                >
                  <!-- 根据具体情况在做修改 -->
                  <el-option v-for="item in column.selectOptions" :key="item[selectvalue]" :label="item[selectlabel]" :value="item[selectvalue]">
                    <div>
                      <span>{{ item[selectvalue] }}</span>
                      <span>/{{ item[selectlabel] }}</span>
                      <span v-if="otherValue" style="color:#aaa">({{ item[otherValue] }})</span>
                    </div>
                  </el-option>
                </el-select>
                <!-- 其他（例如：无限下拉的select）  保留 遇到后再看 -->
                <span class="inputTag" v-if="column.editingType === 'inputTag'">
                  <slot :name="column.editingType" :index="scope.$index" :clumnValue="column.prop" :row="scope.row"></slot>
                </span>
                <!-- <el-input v-if="column.editingType === 'inputTag'" size="mini" v-model="scope.row[column.prop]" :placeholder="`请点击选择${column.label}`" @focus="inputTagClick(column.label)"></el-input> -->
              </template>
            </template>
            <template v-else>
              <expand-dom :column="column" :row="scope.row" :render="column.render" :index="index"></expand-dom>
            </template>
          </template>
        </el-table-column>
      </template>
      <!--endregion-->
      <!--region 按钮操作组-->
      <el-table-column
        label="操作"
        align="left"
        :width="operates.width"
        :fixed="operates.fixed ? operates.fixed : ''"
        v-if="operates && operates.initButtonList && operates.initButtonList.filter(_x => _x.show === true).length > 0 && operates.fixed"
      >
        <template slot-scope="scope">
          {{ !scope.row.editing }}
          <div class="operate-group" v-if="!scope.row.editing">
            <template v-for="(btn, key) in operates.initButtonList">
              <span class="item" :key="btn.id">
                <el-button :type="btn.type" size="mini" :icon="btn.icon" :disabled="btn.disabled" :plain="btn.plain" @click.stop="btn.method(key, scope.row, scope.$index)">
                  {{ btn.label }}
                </el-button>
              </span>
            </template>
          </div>
          <div class="operate-group" v-else>
            <template v-for="(btn, key) in operates.clickButtonList">
              <span class="item" :key="btn.id">
                <el-button :type="btn.type" size="mini" :icon="btn.icon" :disabled="btn.disabled" :plain="btn.plain" @click.stop="btn.method(key, scope.row, scope.$index)">
                  {{ btn.label }}
                </el-button>
              </span>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" :width="operates.width" v-if="operates && !operates.fixed">
        <template slot-scope="scope">
          <div class="operate-group" v-if="!scope.row.editing">
            <template v-for="(btn, key) in operates.initButtonList">
              <span class="item" v-if="btn.show" :key="btn.id">
                <el-button
                  v-show="btn.label === '作废' ? (scope.row.USESTATUS === 1 || scope.row.usestatus === 1 ? true : false) : true"
                  :type="btn.type"
                  :size="btn.size"
                  :icon="btn.icon"
                  :disabled="btn.disabled"
                  :plain="btn.plain"
                  @click.stop="btn.method(key, scope.row, scope.$index)"
                >
                  {{ btn.label }}
                </el-button>
              </span>
            </template>
          </div>
          <div class="operate-group" v-else>
            <template v-for="(btn, key) in operates.clickButtonList">
              <span class="item" :key="btn.id">
                <el-button :type="btn.type" size="mini" :icon="btn.icon" :disabled="btn.disabled" :plain="btn.plain" @click.stop="btn.method(key, scope.row, scope.$index)">{{ btn.label }}</el-button>
              </span>
            </template>
          </div>
        </template>
      </el-table-column>
      <!--endregion-->
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  components: {
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h: any, ctx: any) => {
        const params: any = {
          row: ctx.props.row,
          index: ctx.props.index
        }
        if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, params)
      }
    }
  }
})
export default class BaseTable extends Vue {
  @Prop({ type: Number, default: 1000 }) private tableHeight!: number
  @Prop() private tableDataList: any
  /**
   * columns可根据需要增加和修改
   * prop：列数据对应的属性
   * label：列名
   * align：对齐方式
   * width：列宽
   * min-width：最小宽度
   * showoverflow: 超出tag显示 缺点无法复制 true/false
   * showoverflowAndCopy：无论超出不超出都会显示 可以复制 true/false showoverflow为true 该属性不生效
   * editingType: select（普通下拉选择）/input（输入框）/inputTag(激活选择)
   * nomustEnter: 不是必须输入和选择的项  默认不传表示必须输入
   * selectOptions: 下拉选项 editingTypeselect（普通下拉选择）
   * isSaveClick: 判断是否点击保存
   */
  @Prop() private columns: any
  @Prop({ default: 'label' }) private selectlabel!: string // select绑定的label
  @Prop({ default: 'value' }) private selectvalue!: string // select绑定的value
  @Prop({ default: '' }) private otherValue!: string // select绑定的其他值
  /**
   * operates可根据需要增加和修改
   * label: 文本
   * type :类型（primary / success / warning / danger / info / text）
   * size: 尺寸
   * show：是否显示
   * icon：按钮图标
   * plain：是否朴素按钮
   * disabled：是否禁用
   * method：回调方法
   * formatter： 用来格式化内容
   */
  @Prop() private operates: any
  /**
   * options可根据需要增加和修改
   * border: 是否显示边框
   * size: 表格尺寸
   * stripe: 是否为斑马纹
   * loading: 是否添加表格loading加载动画
   * highlightCurrentRow: 是否支持当前行高亮显示
   * mutiSelect: 是否支持列表项选中功能
   */
  @Prop({
    default: {
      stripe: true, // 是否为斑马纹 table
      highlightCurrentRow: true // 是否要高亮当前行
    }
  })
  private options: any // table 表格的控制参数
  // 方法需要的时候继续追加
  // 某一行被点击时会触发该事件
  private handleClickChange(row: any, column: any, event: any) {
    const val = {
      row: row,
      column: column,
      event: event
    }
    console.log(event)
    this.$emit('handleClickChange', val)
  }
  // 手动勾选数据行的 Checkbox
  private handleSelectionChange(selection: any, row: any) {
    const val = {
      selection: selection,
      row: row
    }
    this.$emit('handleSelectionChange', val)
  }
  private inputClick(index: any, prop: string) {
    const val = {
      index: index,
      prop: prop
    }
    this.$emit('inputClick', val)
  }
  private inputChange(index: any, prop: string) {
    const val = {
      index: index,
      prop: prop
    }
    this.$emit('inputChange', val)
  }
  private selectChange(changeVal: any, index: any, prop: string) {
    const val = {
      changeVal: changeVal,
      index: index,
      prop: prop
    }
    this.$emit('selectChange', val)
  }
}
</script>

<style lang="scss">
.baseTable {
  .inputTag {
    width: 100%;
  }
  .el-table thead {
    color: #333;
  }
  .el-table th.is-leaf {
    background: #f5f7fa;
    text-align: center;
  }
  .el-table th.el-table-column--selection {
    text-align: left;
  }
  .operate-group {
    .item {
      margin-right: 10px;
    }
  }
}
</style>
