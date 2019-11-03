import Schema from 'async-validator'

export default {
  data () {
    return {
      // 错误列表
      errorList: {}
    }
  },
  methods: {
    // 数据校检 (对外暴露)
    validate () {
      // 没有数据 或者 没有校检, 则直接返回 resolve
      if (!this.rules || !this.value.length) return Promise.resolve()

      // 检测单个值, 用于界面提示
      this.validateAllValue()

      // 检查, 用于返回值
      let validators = null
      if (this.computedColumns.length === 1) {
        validators = this.value.map((item) => {
          return new Promise((resolve, reject) => {
            const validator = new Schema({ value: this.rules })
            return validator.validate({ value: item }).then(resolve).catch(reject)
          })
        })
      } else {
        validators = this.value.map((item) => {
          return new Promise((resolve, reject) => {
            const validator = new Schema(this.rules)
            return validator.validate(item).then(resolve).catch(reject)
          })
        })
      }

      return Promise.all(validators)
    },
    // 检测每一个行的每个值的数据
    validateAllValue () {
      this.value.forEach((item, i) => {
        if (this.computedColumns.length === 1) {
          this.validateOneValue(item, i)
        } else {
          Object.keys(this.rules).forEach((valueKey) => {
            this.validateOneValue(item[valueKey], i, valueKey)
          })
        }
      })
    },
    // 检测单个数据
    validateOneValue (value, index, valueKey) {
      return new Promise(async (resolve) => {
        try {
          // 参数校检
          await this.checkValue(value, valueKey)
          this.handleCheckSuccess(index, valueKey)
          resolve(true)
        } catch (errors) {
          // 处理错误
          this.handleCheckError(errors, index, valueKey)
          resolve(false)
        }
      })
    },
    // 数据校检
    checkValue (value, valueKey) {
      return new Promise((resolve, reject) => {
        // 单列和多列的校检有区别
        // 单列rules直接是数组或者对象, 无需key
        // 多列需要制定每个key的校检规则
        let rules = null
        if (this.computedColumns.length === 1) {
          if (!this.rules) return resolve()
          rules = this.rules
        } else {
          if (!(this.rules && this.rules[valueKey])) return resolve()
          rules = this.rules[valueKey]
        }
        const validator = new Schema({ value: rules })
        validator.validate({ value }, (errors) => {
          if (errors) {
            reject(errors)
          } else {
            resolve()
          }
        })
      })
    },
    // 检查通过
    // 重置 errorList 的值
    handleCheckSuccess (index, valueKey) {
      if (valueKey) {
        if (this.errorList[index] && this.errorList[index][valueKey]) {
          this.errorList[index][valueKey] = null
        }
      } else {
        this.errorList[index] = null
      }
    },
    // 处理错误, 将错误拼接字符串, 并保存在 errorList 中
    handleCheckError (errors, index, valueKey) {
      let errorMsg = errors.map((item) => item.message).join(',')
      if (valueKey) {
        errorMsg = Object.assign({}, this.errorList[index], { [valueKey]: errorMsg })
      }
      this.$set(this.errorList, index, errorMsg)
    }
  }
}
