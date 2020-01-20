<template>
  <el-card
    header="ele-form-dynamic 演示"
    shadow="never"
    style="max-width: 1250px;margin: 20px auto;"
  >
    <ele-form
      :request-fn="handleRequest"
      :formData="formData"
      @request-success="handleSuccess"
      :formDesc="formDesc"
    />
  </el-card>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data () {
    return {
      formData: {
        color: ['red', 'blue']
      },
      formDesc: {
        goods: {
          type: 'input',
          label: '电脑名称',
          rules: { required: true, message: '请输入电脑名称' }
        },
        color: {
          // 指定类型为 dynamic
          type: 'dynamic',
          label: '电脑颜色',
          // dynamic 相关的配置写在 attrs 中
          attrs: {
            columns: {
              // type: 'el-input', // 默认类型为input, 可以省略
              // 这里的书写同 https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
              attrs: {
                placeholder: '电脑颜色'
              },
              style: {
                width: '200px'
              }
              // class: {}, slots: {}, scopedSlots:{}, on: {}
            },
            // 注意这里的rules, 和外面的rules不同, 是对里面各个组件的校检
            rules: {
              required: true, message: '颜色必填'
            }
          }
        },
        sku: {
          label: '销售价格',
          type: 'dynamic',
          attrs: {
            // 校检规则, 同样是写在 attrs 里面
            rules: {
              disk: {
                required: true,
                message: '硬盘必须选择'
              },
              price: [
                {
                  required: true,
                  message: '电脑价格必填'
                },
                {

                  type: 'number',
                  min: 1000,
                  message: '价格必须大于1000元'
                }
              ]
            },
            columns: [
              {
                // 这里制定了类型
                type: 'el-select',
                // 必须指定 valueKey
                valueKey: 'disk',
                attrs: {
                  type: 'number',
                  clearable: true,
                  placeholder: '硬盘大小'
                },
                // 这里使用了插槽
                slots: {
                  default (h) {
                    return [
                      h('el-option', { attrs: { label: '128GB', value: 0 } }),
                      h('el-option', { attrs: { label: '512GB', value: 1 } }),
                      h('el-option', { attrs: { label: '1024GB', value: 2 } })
                    ]
                  }
                }
              },
              {
                type: 'el-input-number',
                // 必须指定 valueKey
                valueKey: 'price',
                attrs: {
                  min: 0,
                  type: 'number',
                  placeholder: '价格'
                }
              }
            ]
          }
        }
      }
    }
  },
  methods: {
    handleRequest (data) {
      // eslint-disable-next-line
      console.log(data)
      return Promise.resolve(data)
    },
    handleSuccess () {
      this.$message.success('提交成功')
    }
  }
}
</script>

<style>
body {
  background-color: #f0f2f5;
}
</style>
