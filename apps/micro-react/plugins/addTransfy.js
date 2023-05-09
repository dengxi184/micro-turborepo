const {
  createDeclareAST,
  createImportAST,
  getReplaceExpression,
} = require('./utils');

module.exports = function (babel) {
  const findTransNodeVisitor = {
    'StringLiteral|JSXText|TemplateElement': function (path, state) {
      const value = (
        path.isTemplateElement() ? path.node.value.raw : path.node.value || ''
      )
        .replace(/\n/g, '')
        .trim();
      if (/[^\x00-\xff]/.test(value)) {
        console.log('中文 ~ ', value);
        // console语句不翻译
        if (
          path.findParent((p) => p.isCallExpression()) &&
          path.parent &&
          path.parent.callee &&
          path.parent.callee.object &&
          path.parent.callee.object.name === 'console'
        ) {
          return;
        }
        // 找顶层作用域
        const blockStatementPath = path.findParent((p) => p.isBlockStatement());
        if (!blockStatementPath) {
          return;
        }
        // 找文件顶部
        const programNode = path.findParent((p) => p.isProgram()).node.body;
        const bodyPathNode = blockStatementPath.node.body;
        const Declared = !bodyPathNode.every((node) => {
          if (
            node.type === 'VariableDeclaration' &&
            node.kind === 'const' &&
            node.declarations[0].init.callee
          ) {
            return node.declarations[0].init.callee.name !== 'useLocale';
          }
          return true;
        });
        if (!Declared) {
          // 将顶层作用域body插入声明节点
          const declareNode = createDeclareAST();
          bodyPathNode.unshift(declareNode);

          // 文件顶部插入引入语句
          const importNode = createImportAST();
          programNode.unshift(importNode);

          // 替换
          const replaceExpression = getReplaceExpression(babel, path, value);
          path.replaceWith(replaceExpression);
          path.skip();
        }
      }
    },
  };
  return {
    name: 'babel-plugin-add-transfy-key',
    visitor: findTransNodeVisitor,
  };
};
