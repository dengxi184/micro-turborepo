<template>
  <div class="spin-loading-container" v-if="loading">
    <a-spin></a-spin>
  </div>
  <slot name="articleList" v-else></slot>
</template>
<script>
// import { defineProps } from 'vue';
import {
  watch,
  reactive,
  toRefs,
  onMounted
} from "vue"

// const props = defineProps(['foo'])
export default {
    props: {
      promiseList: {
        type: Function
      },
    },
    setup(props, ctx) {
      const state = reactive({
        loading: true
      })
      onMounted(async ()=>{
        await Promise.all([props.promiseList(), new Promise(resolve=> setTimeout(resolve, 500))])
        state.loading = false
      })
      watch(
        () => props.promiseList,
        async (promiseList) => {
          state.loading = true
          await Promise.all([promiseList(), new Promise(resolve=> setTimeout(resolve, 500))])
          state.loading = false
        }
      )
      return {
        ...toRefs(state)
      }
    }
}
</script>
<style >
/* .spin-loading-container {
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  z-index: 999;

  background-color: rgba(255, 255, 255, 0.4);
} */
</style>
  