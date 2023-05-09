const template = require('babel-template');

const createDeclareAST = () => {
  const declareTemplate = `
    const [, translate] = useLocale();
  `;
  const temp = template(declareTemplate);
  return temp({});
};
const createImportAST = () => {
  const buildRequire = template(
    `
    import useLocale from '@utils/useLocale'
  `,
    { sourceType: 'module' },
  );

  return buildRequire({});
};

const getReplaceExpression = (babel, path, value) => {
  let replaceExpression = babel.template.ast(
    `translate("${value}")`,
  ).expression;
  if (
    path.findParent((p) => p.isJSXAttribute()) &&
    !path.findParent((p) => p.isJSXExpressionContainer())
  ) {
    replaceExpression = babel.types.JSXExpressionContainer(replaceExpression);
  }
  return replaceExpression;
};

exports.createDeclareAST = createDeclareAST;
exports.createImportAST = createImportAST;
exports.getReplaceExpression = getReplaceExpression;
