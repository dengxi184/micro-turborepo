export const filePath = ['apps/micro-react/src'] // 'apps/micro-vue/src', 'apps/react-base/src'
export const ignoreExtension = ['css','less','style','ts','json','svg']
export const transfyFilePath = 'apps/micro-react/src/locale'
export const transUrl = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
export const appId = '20230427001657589'
export const translateKey = 'bSclU_6Mu9ARuehr15vT'
export const wordTemplate = '// insert new translation here'
export const fileTemplate = 
`export default{
   ${wordTemplate}
}`
export const status2Path = {
  en: `${transfyFilePath}/en-US.ts`,
  zh: `${transfyFilePath}/zh-CN.ts`,
  jp: `${transfyFilePath}/jp-JP.ts`,
  yue: `${transfyFilePath}/yue-YUE.ts`,
}
