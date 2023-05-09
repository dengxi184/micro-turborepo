<template>
  <div class="container">
    <LeftNavBar @handleTypeChange="handleTypeChange"/>
    <div class="page-content">
      <Loading :promiseList="promiseList">
        <template #articleList>
          <a-list :max-height="360" @reach-bottom="handleLoadMoreThrottle" >
            <a-list-item @click="toDetails(article.id)" class="list-item" v-for="article in list" :key="article.id">{{ article.title }}</a-list-item>
            <template #scroll-loading>  
              <div v-if="bottom">No more data</div>
              <a-spin v-else />
            </template>
          </a-list>
        </template>
      </Loading>
    </div>
    <div class="searchWrap">
      <a-input-search @input="handleInput" placeholder="Please enter something"/>
      <a-button style="margin-left: 10px;width: 35px;" @click="handlePublish" type="primary" shape="circle">
        <icon-plus />
      </a-button>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, watch, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { IconPlus } from '@arco-design/web-vue/es/icon';

import LeftNavBar from '../../components/LeftNavBar/LeftNavBar.vue'
import Loading from '../../components/Loading/index.vue'

export default {
  components:{ LeftNavBar, IconPlus, Loading },
  setup() {
    const router = useRouter()
    const state = reactive({
      // 默认类型
      keyword: '',
      bottom: false,
      loading: false,
      type: 'Optimization',
      pageSize: 10,
      curPage: 1,
      list:[],
      promiseList:() => getList('Optimization', 10)
    })

    const handlePublish = () => {
      router.push({name:'Write', query:{type: state.type}})
    }

    const handleTypeChange = value => {
      state.type = value
    }

    const getList = async (type, pageSize, curPage = 1, keyword = '', isLoadMore = false) => {
      try {
        const rsp = await getListRequest({keyword, type, id: getStorage('userId'), curPage, pageSize})
        if( isLoadMore ) {
          state.list = [...state.list,...rsp.listData]
          state.bottom = true
        } else {
          state.list = rsp.listData
        }
        // state.list = isLoadMore? [...state.list,...rsp.listData] : rsp.listData
        state.curPage = state.curPage + 1
      } catch( err ) {
        console.log(err)
      }
    }

    const handleInput = (keyword) => {
      state.keyword = keyword
    }

    const handleLoadMoreThrottle = _.throttle(()=> {
      if( state.bottom ) return
      const { type, pageSize, curPage, keyword } = state
      getList(type, pageSize, curPage, keyword, true)
    }, 500, { 'trailing': false })

    const handleSearchDebounce = _.debounce(()=> {
      const { type, pageSize, keyword } = state
      getList(type, pageSize, 1, keyword)
    }, 300)

    const toDetails = (id) => {
      router.push({name:'Details', query:{id}})
    }
   
    onMounted(()=> {
      const data = window.microApp.getData()
    })

    watch(
      ()=> state.type,
      (type, _)=> {
        const { pageSize } = state
        state.promiseList = () => getList(type, pageSize)
      }   
    )

    watch(
      ()=> state.keyword,
      ()=> {
        handleSearchDebounce()
      }   
    )

    return {  
      ...toRefs(state),
      handlePublish,
      handleTypeChange,
      toDetails,
      handleInput,
      handleLoadMoreThrottle
    }
  }
}
</script>

<style>
.container {
  display: flex;
}
.page-content {
  position: absolute;
  width: 80%;
  height: 80%;
  top: 60px;
  left: 230px;
  background-color: #fff;
}
.searchWrap {
  width: 345px;
  position: absolute;
  display: flex;
  top: 3%;
  right: 60%;
}
.list-item :hover { 
  cursor:pointer
}
</style>
  