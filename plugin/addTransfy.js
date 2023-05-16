import path from "path";
import fs from "fs";
import parser from "@babel/parser";
import traverser from "@babel/traverse";
import generater from '@babel/generator';
import template from "babel-template";
import templateBuilder from "@babel/template";
import * as t from "@babel/types";

import { 
  filePath,
  ignoreExtension
} from "./config.js"

const traverse = traverser.default;
const generate = generater.default;
const templateBuild = templateBuilder.default;

function getReplaceExpression(path, value) {
  let replaceExpression = templateBuild.ast(`translate("${value}")`).expression;
  if ((path.findParent(p => p.isJSXAttribute()) || path.findParent(p => p.isJSXElement())) && 
      !path.findParent(p=> p.isJSXExpressionContainer())) {
    replaceExpression = t.JSXExpressionContainer(replaceExpression);
  }
  return replaceExpression;
}

const fileTra = (content) => {
  fs.readdir(content, async (err, files) => {
    if (err) {
      console.warn(err)
    } else {
      for (let i = 0; i < files.length; i++) {
        const filedir = path.join(content, files[i])
        const pathSplit = filedir.split('.')
        const suffixIndex = pathSplit.length-1
        const suffix = pathSplit[suffixIndex]
        if( ignoreExtension.includes(suffix) && suffix !== '' ) continue
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
  'StringLiteral|JSXText|TemplateElement': function(path, state) {
    const value = (path.isTemplateElement() ? path.node.value.raw : path.node.value || '').replace(/\n/g, '').trim();
    if (/[^\x00-\xff]/.test(value)) {
      console.log('中文 ~ ', value);
      // console语句不翻译
      if ( path.findParent(p => p.isCallExpression()) && 
      (path.parent && path.parent.callee && path.parent.callee.object && path.parent.callee.object.name === 'console') ) {
        return;
      }
      // 找顶层作用域
      const blockStatementPath = path.findParent(p => p.isBlockStatement())
      if ( !blockStatementPath ) {
        return 
      }
      // 找文件顶部
      const programNode = path.findParent(p => p.isProgram()).node.body
      const bodyPathNode = blockStatementPath.node.body
      const Declared = !bodyPathNode.every(node => {
        if(node.type === 'VariableDeclaration' && node.kind === 'const' && node.declarations[0].init.callee) { 
          return node.declarations[0].init.callee.name !== 'useLocale'
        }
        return true
      })
      if( !Declared ) {
        // 将顶层作用域body插入声明节点
        const declareNode = createDeclareAST()
        bodyPathNode.unshift(declareNode)

        // 文件顶部插入引入语句
        const importNode = createImportAST()    
        programNode.unshift(importNode)

        // 替换
        const replaceExpression = getReplaceExpression(path, value);
        path.replaceWith(replaceExpression);
        path.skip();
      }     
    }
  }
};


const createDeclareAST = () => {
  const declareTemplate = `
    const [, translate] = useLocale();
  `;

  const temp = template(declareTemplate);
  return temp({});
}

const createImportAST = () => {
  const buildRequire = template(`
  import useLocale from '@/utils/useLocale'
  `,{ sourceType: "module" });

  return buildRequire({})
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



filePath.forEach(path=> {
  fileTra(path)
})