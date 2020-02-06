<template>
  <form-dynamic
    :class="desc.class"
    :style="desc.style"
    v-bind="attrs"
    ref="form-dynamic"
    v-model="newValue"
    v-on="onEvents"
  />
</template>

<script>
import FormDynamic from './FormDynamic'
import { formMixin } from 'vue-ele-form'

export default {
  name: 'EleFormDynamic',
  mixins: [formMixin],
  components: {
    FormDynamic
  },
  computed: {
    defaultAttrs () {
      return {
        placeholder: this.t('ele-form.input') + this.desc.label
      }
    }
  },
  methods: {
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs['form-dynamic'].validate().then(resolve).catch(() => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ [this.$parent.$props.prop]: '出错了' })
        })
      })
    }
  }
}
</script>
