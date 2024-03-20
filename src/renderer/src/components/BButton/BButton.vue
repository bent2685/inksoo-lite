<script setup lang="ts">
import { computed, ref, onMounted, useSlots } from 'vue'
const slots = useSlots()
interface IBButtonProps {
  disabled? /* 是否禁用 */ : boolean
  async? /* 是否开启异步 */ : boolean
  icon? /* 按钮图标 */ : string
  loading? /* 是否显示加载 */ : boolean
  type? /* 按钮类型 */ : 'primary' | 'warning' | 'default' | 'normal'
  round?: boolean
  timeout? /* 异步超时 */ : number
}

const props = withDefaults(defineProps<IBButtonProps>(), {
  disabled: false,
  loading: false,
  type: 'default',
  round: false,
  async: false,
  timeout: 10 * 1000
})
const myDisabled /* 按钮禁用 */ = ref<boolean>(props?.disabled || false)
const myLoading /* 按钮加载 */ = ref<boolean>(props?.loading || false)
const isError /* 按钮错误状态 */ = ref<boolean>(false)
const hasDefaultSlot /* 设置了默认插槽 */ = ref<boolean>(false)

const emits = defineEmits(['click'])

let timer4Error: NodeJS.Timeout | null
/**
 * 短暂的让按钮显示错误状态
 */
const setError = () => {
  isError.value = true
  if (timer4Error) clearTimeout(timer4Error)
  timer4Error = setTimeout(() => {
    isError.value = false
  }, 1500)
}

/**
 * 关闭按钮错误显示
 */
const clearError = () => {
  isError.value = false
  if (timer4Error) clearTimeout(timer4Error)
}

// 按钮是否可以按下
const canClick = computed(() => {
  return !myDisabled.value && !myLoading.value
})

/**
 * 按钮按下
 */
const handleClick = () => {
  clearError()
  if (!canClick.value) return
  let timer
  if (props.async) {
    myLoading.value = true
  }

  // 执行点击回调参数
  const e = {
    // 停止加载
    stopLoading: () => {
      if (timer) clearTimeout(timer)
      myLoading.value = false
    },
    // 设置按钮禁用
    setDisabled: (disabled: boolean) => {
      myDisabled.value = disabled
    }
  }
  // 如果开启了异步模式
  if (props.async) {
    // 超时判断
    timer = setTimeout(() => {
      if (myLoading.value) {
        e.stopLoading()
        setError()
        console.error('<BButton> 请求超时')
      }
    }, props.timeout)
  }
  emits('click', e)
}

onMounted(() => {
  // 获取默认插槽里的内容，判断有无内容
  const slot = slots.default?.()
  if (slot?.length) {
    hasDefaultSlot.value = true
  }
})
</script>

<template>
  <button
    :class="[
      type,
      {
        loading: myLoading,
        disabled: myDisabled,
        error: isError,
        round: round,
        'can-click': canClick
      }
    ]"
    class="b-button m-0 border-(2 solid transparent) text-#fff border-rd-5px select-none duration-300"
    @click="handleClick"
  >
    <div
      v-if="icon"
      class="ico"
      :class="[icon]"
      :style="{ 'margin-right': hasDefaultSlot ? '4px' : 0 }"
    />
    <slot></slot>
    <div v-if="myLoading" i-tabler:loader class="ico loading__ico" />
  </button>
</template>

<style lang="scss" scoped>
.b-button {
  display: flex;
  align-items: center;
  cursor: not-allowed;
  font-size: 12px;
  padding: 0.3rem 0.5rem;

  &.round {
    border-radius: 999px;
  }

  &.primary {
    background: $primary;
    color: #fff;
  }

  &.default {
    background: transparent;
    color: $text;
    border: 1px solid $border-color;
  }

  &.normal {
    background: $border-color;
    color: $text;
  }

  &.warning {
    background: $warning;
    color: #fff;
  }

  &.disabled {
    background: $border-color;
    color: $text2;
  }

  &.error {
    background: transparent !important;
    border-color: $warning !important;
    color: $warning !important;
  }

  &.can-click {
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }

    &:active {
      transform: scale(0.95);
      border-color: $border-color;
    }
  }

  &.loading {
    opacity: 0.6;
    .loading__ico {
      animation: spin 3s linear infinite;
    }
  }

  .ico {
    zoom: 0.8;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
