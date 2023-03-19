<template>
  <div class="menu-demo">
    <a-menu
     :style="{ width: '200px', height: '100%' }"
     :default-selected-keys=[defaultSelectedKey]
     auto-open
     breakpoint="xl"
     @menu-item-click="handleTypeEmit"
    >
    <a-sub-menu v-for="category in categories" :key="category.name">
      <template #title>{{ category.name }}</template>
      <a-menu-item v-for="child in category.childrens" :key="child.name">
        <span>{{child.name}}</span>
      </a-menu-item>
    </a-sub-menu>
    </a-menu>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue';

import { category as categories } from '../../utils/category.ts';

export default {
  emits:['handleTypeChange'],
  setup(_, ctx) {
    const state = reactive({
      categories,
      defaultSelectedKey: 'Optimization'
    })

    const handleTypeEmit = key => {
      ctx.emit('handleTypeChange', key)
    }
    
    return {
      ...toRefs(state),
      handleTypeEmit
    }
  }
};
</script>
<style scoped>
.menu-demo {
  box-sizing: border-box;
  padding-left: 30px;
  width: 100%;
  height: 600px;
}
</style>