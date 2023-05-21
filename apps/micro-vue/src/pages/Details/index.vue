<template>
  <icon-left-circle @click="backToHome" :style="{position:'absolute',left:'20%',fontSize:'32px'}"/>
  <icon-delete @click="deleteAndBack" :style="{position:'absolute',left:'22%',fontSize:'32px'}"/>
  <div class="details-wrap">
    <div  v-html="htmlTitle"/> 
    <div  v-html="htmlContent"/>
  </div>  
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IconLeftCircle, IconDelete } from '@arco-design/web-vue/es/icon';

const { delArticleRequest, getDetailsRequest } = microApp.getGlobalData()

export default {
  components:{ IconLeftCircle, IconDelete },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      id: '',
      htmlTitle: '',
      htmlContent: ''
    })

    const backToHome = () => {
      router.back()
    }
    
    const deleteAndBack = async () => {
      try {
        const { id } = state
        await delArticleRequest({id})
        router.back()
      } catch(err) {
        console.log(err)
      }
    }
    
    onMounted(async ()=> {
      const { id } = route.query
      state.id = id
      const rsp = await getDetailsRequest({id})
      const { title, content } = rsp
      state.htmlTitle = `<h1>${title}</h1>`
      state.htmlContent = content
    })

    return {
      ...toRefs(state),
      deleteAndBack,
      backToHome
    }
  }
}
</script>
<style>
.details-wrap {
  padding-left: 25%;
  padding-right: 25%;
}
</style>