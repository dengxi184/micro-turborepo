<template>
    <div class="editorContainer" style=" z-index: 999;margin-left: 20%; width: 60%; border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="width: 100%; height: 800px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
      <div class="btnGro">
        <a-button @click="handleSubmit" type="primary">发布</a-button>
        <a-button @click="handleBack" style="margin-left: 20px" type="primary">返回</a-button>
      </div>
    </div>
</template>
<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, toRefs, reactive, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  components: { Editor, Toolbar },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    // 内容 HTML
    const valueHtml = ref('')
    const router = useRouter()
    const route = useRoute()
    const toolbarConfig = {}
    const editorConfig = 
    { 
      placeholder: '请在第一行输入你的标题...',
      MENU_CONF: {}
    }
    editorConfig.MENU_CONF['uploadImage'] = {
      async customUpload(file, insertFn) { 
        //console.log(file)
        try {
          const fd = new FormData()
          fd.append('file', file)
          const rsp = await (await fetch('http://localhost:3000/api/upload/upload-img',{method:'POST',body:fd})).json()
          insertFn(rsp.filePath)
        } catch(err) {
          console.log(err)
        }
      }
    }
    
    const state = reactive({
      type: route.query.type
    })
    
    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    const handleSubmit = async () => {
      try {
        const Reg = /<[Hh]([1-6])>[^<]*?<\/[Hh]\1>/g
        const Tags = Reg.exec(valueHtml.value)[0]
        const title = Tags.split('>')[1].split('<')[0]
        const content = valueHtml.value.replace(Tags, '')
        const id = getStorage('userId')
        const { type } = state
        if( !title ) return
        await publishRequest({title, content, id, date: new Date(), type})
        router.push({name: 'Home'})
      } catch(err) {
        console.log(err)
      }
    }

    const handleBack = () => {
      router.back()
    }

    const uploadImg = async () => {
      const rsp = await uploadImgRequest({})
    }

    return {
      ...toRefs(state),
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleSubmit,
      handleBack,
      uploadImg
    };
  }
}
</script>    

<style>
.btnGro {
  display: flex;
  position: absolute;
  right: 5%;
  bottom: 5%;
}
#editor—wrapper {
  border: 1px solid #ccc;
  z-index: 100; /* 按需定义 */
}
#toolbar-container { border-bottom: 1px solid #ccc; }
#editor-container { height: 800px; }
</style>