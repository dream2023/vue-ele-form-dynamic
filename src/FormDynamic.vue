<template>
  <div class="ele-form-dynamic">
    <div
      v-for="(dataItem, i) of value"
      :key="i"
      class="ele-form-dynamic-section"
    >
      <!-- computedColumns 单个的时候, 按照数组处理 -->
      <template v-if="computedColumns.length === 1">
        <el-tooltip
          :content="errorList[i]"
          :class="{ 'ele-form-dynamic-error': errorList[i] ? true : false }"
          :disabled="!errorList[i]"
          placement="top"
        >
          <component
            :is="item.type || 'el-input'"
            :key="index"
            @input="validateOneValue($event, i)"
            v-model="value[i]"
            :style="item.style"
            v-bind="getAttrs(item.attrs)"
            :class="item.class"
            :on="item.on"
            v-for="(item, index) of computedColumns"
          >
            <!-- 作用域插槽 -->
            <template
              v-for="(render, key) of item.scopedSlots"
              v-slot:[key]="data"
            >
              <extend-slot :data="data" :key="key" :render="render" />
            </template>

            <!-- 非作用域插槽 -->
            <template v-for="(render, key) of item.slots" v-slot:[key]>
              <extend-slot :key="key" :render="render" />
            </template>
          </component>
        </el-tooltip>
      </template>
      <!-- computedColumns 多个的时候, 按照对象处理 -->
      <template v-else>
        <div v-for="(item, index) of computedColumns" :key="index">
          <el-tooltip
            :class="{
              'ele-form-dynamic-error':
                errorList[i] && errorList[i][item.valueKey] ? true : false
            }"
            :content="
              errorList[i] && errorList[i][item.valueKey]
                ? errorList[i][item.valueKey]
                : null
            "
            :disabled="!(errorList[i] && errorList[i][item.valueKey])"
            placement="top"
          >
            <component
              :is="item.type || 'el-input'"
              v-model="value[i][item.valueKey]"
              :style="item.style"
              v-bind="getAttrs(item.attrs)"
              @input="validateOneValue($event, i, item.valueKey)"
              :class="item.class"
              :on="item.on"
            >
              <!-- 作用域插槽 -->
              <template
                v-for="(render, key) of item.scopedSlots"
                v-slot:[key]="data"
              >
                <extend-slot :data="data" :key="key" :render="render" />
              </template>

              <!-- 非作用域插槽 -->
              <template v-for="(render, key) of item.slots" v-slot:[key]>
                <extend-slot :key="key" :render="render" />
              </template>
            </component>
          </el-tooltip>
          <span
            v-if="index !== computedColumns.length - 1"
            class="ele-form-dynamic-delimiter"
            >{{ delimiter }}</span
          >
        </div>
      </template>
      <template v-if="!disabled">
        <!-- 当只有1条时, 不显示删除 -->
        <i
          v-if="value.length !== 1"
          @click="removeRow(i)"
          class="ele-form-dynamic-icon el-icon-remove-outline"
        ></i>
        <!-- 仅在最后一条显示添加 -->
        <i
          @click="addRow"
          v-if="i === value.length - 1"
          class="ele-form-dynamic-icon el-icon-circle-plus-outline"
        ></i>
      </template>
    </div>
  </div>
</template>

<script>
// 本组件的重点在于单列和多列对数据的处理不一致
// 单列基本类型数组, 多列是对象数组
import validate from './validate'
import ExtendSlot from 'vue-ele-form/lib/ExtendSlot'

export default {
  name: 'FormDynamic',
  mixins: [validate],
  components: {
    ExtendSlot
  },
  props: {
    // 值
    value: {
      type: Array,
      required: true,
      default: () => []
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 校检对象
    rules: [Object, Array],
    // 列
    columns: {
      type: [Object, Array],
      required: true,
      validator (columns) {
        if (Array.isArray(columns)) {
          const isError = columns.some((item) => !item.valueKey)
          if (isError) {
            console.error('[ele-form-dynamic warn]: columns当为数组时, 必须包含valueKey属性')
            return false
          }
        }
        return true
      }
    },
    // 分割符
    delimiter: {
      type: String,
      default: '-'
    }
  },
  computed: {
    // 无论是单列还是多列, 统一转为数组
    computedColumns () {
      return Array.isArray(this.columns) ? this.columns : [this.columns]
    }
  },
  methods: {
    // 获取属性 (为了将disabled统一设置)
    getAttrs (attrs = {}) {
      return Object.assign(attrs, { disabled: this.disabled })
    },
    // 移除一行
    removeRow (index) {
      this.value.splice(index, 1)
    },
    // 新增一行
    addRow () {
      // 单列和多列数据不一样
      // 单列是数组 [a1, a2], 多列是对象 [{name: xx, age: xx}], 所以默认值不相同
      const column = this.computedColumns.length === 1 ? null : {}
      this.value.push(column)
      this.$emit('input', this.value)
      return this.value
    }
  },
  mounted () {
    // 当没有数据时,新增一行
    if (!this.disabled && (!this.value || this.value.length === 0)) {
      this.addRow(this.value)
    }
  }
}
</script>

<style>
.ele-form-dynamic {
  display: inline-block;
  width: 100%;
}
.ele-form-dynamic-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.ele-form-dynamic-section:last-child {
  margin-bottom: 0;
}
.ele-form-dynamic-icon {
  font-size: 22px;
  color: #606266;
  padding-left: 10px;
}
.ele-form-dynamic-delimiter {
  padding: 0 10px;
  color: #606266;
}

.ele-form-dynamic .el-input {
  width: inherit;
}

.ele-form-dynamic-error .el-input__inner,
.ele-form-dynamic-error .el-input__inner:focus,
.ele-form-dynamic-error .el-textarea__inner,
.ele-form-dynamic-error .el-textarea__inner:focus {
  border-color: #f56c6c;
}
</style>
