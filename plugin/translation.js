import path from "path"
import fs from "fs"
import parser from "@babel/parser"
import traverser from "@babel/traverse"
import axios from "axios"

import { MD5 } from "./md5.js"
import { 
  filePath, 
  wordTemplate,
  transUrl, 
  status2Path, 
  translateKey,
  fileTemplate,
  appId 
} from "./config.js"

const traverse = traverser.default;

const fileTra = (content) => {
  fs.readdir(content, async (err, files) => {
    if (err) {
      console.warn(err)
    } else {
      for (let i = 0; i < files.length; i++) {
        const filedir = path.join(content, files[i])
        if(filedir.indexOf('tsx') === -1) continue
        const isFile = await fileRead(filedir)
        if (!isFile) {
          fileTra(filedir)
        } else {
          const fileContent = fs.readFileSync(filedir, 'utf-8')
          getKey(fileContent)
        }
      }
    }
  })
}

const findTransNodeVisitor = {
  CallExpression(path) {
    const calleePath = path.get("callee")
    if( calleePath.node.name === 'translate' ){
      path.traverse(collectTransKeys)
    }
  }
}

const collectTransKeys = {
  StringLiteral(path) {
    Object.keys(status2Path).map(lang=>{
      translate(path.node.value, lang)
    })
  }
}

const getKey = (source) => {
  const ast = parser.parse(source,{
    sourceType: "module",
    plugins:['jsx', 'typescript']
  })
  traverse(ast, findTransNodeVisitor)
}

const fileRead = (filedir) => {
  return new Promise((resolve, reject) => {
    fs.stat(filedir, function (err, stats) {
      if (err) {
        console.warn('获取文件stats失败')
        reject(err)
      } else {
        const isFile = stats.isFile()
        const isDir = stats.isDirectory()
        if (isFile) {
          resolve(true)
        }
        if (isDir) {
          resolve(false)
        }
      }
    })
  })
}

const getSign = (text, salt) => {
  return MD5(appId+text+salt+translateKey)
}

const translate = async (text, lang) => {
  try {
    const salt = Date.now()
    const rsp = await axios.get(transUrl, {
      params: {
        q: text,
        from: 'auto',
        to: lang,
        appid: appId,
        salt: salt,
        sign: getSign(text, salt)
      },
    })
    const val = rsp.data.trans_result[0].dst
    const isExist = fs.existsSync(status2Path[lang])
    const fileContent = isExist? fs.readFileSync(status2Path[lang], 'utf-8') : fileTemplate
    writeFile(fileContent, text, val, status2Path[lang])
    console.log(`翻译成功！ key: ${text} value: ${val}`)
  } catch (err) {
    console.log(`翻译失败！`, err)
  }
}

const writeFile = (fileContent, text, value, path) => {
  if( fileContent.indexOf(`${text}`) !== -1 ) return
  const content = 
  `${fileContent.replace(wordTemplate,
  `"${text}":"${value}",
  ${wordTemplate}`)}`
  fs.writeFileSync(path, content)
}

filePath.forEach(path=> {
  fileTra(path)
})