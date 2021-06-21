import { tokenRegular } from "./regularDefine";
import handler from "./handler";
import amendmentStrategy from "./amendmentStrategy";
import {checkTokenParse} from '../util/check'
import {calculateAbs} from '../util/calculate'

function tokenPaser(string) {
  let tokenObj = {
    results:[],
    _absCount:0,
    $absCount:0
  };
  let isContinue = false;
  let absCount = 0
  while (string) {
    isContinue = false;
    string = string.replace(tokenRegular, (match, $1) => {
      isContinue = true;
      if (match === "|") absCount++;
      tokenObj.results.push(match);
      return "";
    });
    checkTokenParse(isContinue,string)
  }
  calculateAbs(tokenObj,absCount)
  return buildChild(amendmentToken(tokenObj));
}

function amendmentToken(tokenObj) {
  let tokenList = tokenObj.results
  for (let i = 0; i < tokenList.length; i++) {
    let token = tokenList[i];
    if (amendmentStrategy[token]) {
      amendmentStrategy[token](tokenObj, i);
    }
  }
  return tokenList;
}

function buildChild(tokenList) {
  let results = [];
  let token = tokenList.shift();
  const childExpressionParser = {
    "(": function () {
      let childExpression = "";
      token = tokenList.shift();
      let leftParentheses = 1;
      let rightParentheses = 0;
      while (token) {
        if (token === "(") leftParentheses++;
        if (token === ")") rightParentheses++;
        if (leftParentheses === rightParentheses) break;
        childExpression += token;
        token = tokenList.shift();
      }
      if (leftParentheses !== rightParentheses)
        throw "leftParentheses and leftParentheses are mismatching";
      results.push(tokenPaser(childExpression));
    },
    "^|": function () {
      let childExpression = "";
      token = tokenList.shift();
      let leftAbsSign = 1;
      let rightAbsSign = 0;
      while (token) {
        if (token === "^|") leftAbsSign++;
        if (token === "$|") rightAbsSign++;
        if (rightAbsSign === leftAbsSign) break;
        childExpression += token;
        token = tokenList.shift();
      }
      if (leftAbsSign !== rightAbsSign)
        throw "leftAbsSign and rightAbsSign are mismatching";
      results.push(handler.abs(tokenPaser(childExpression)));
    },
  };
  while (token) {
    if (childExpressionParser[token]) {
      childExpressionParser[token]();
    } else {
      results.push(token);
    }
    token = tokenList.shift();
  }
  return results;
}

function expressionGenerator(tokenList) {
  const produceExpression = function (results) {
    results.unshift("(");
    results.push(")");
    return results.join("");
  };
  let results = [];
  let token = tokenList.shift();
  while (token) {
    if (Array.isArray(token)) {
      results.push(expressionGenerator(token));
      token = tokenList.shift();
      continue;
    }
    if (handler[token]) {
      handler[token](results, tokenList, token);
    } else {
      results.push(token);
    }
    token = tokenList.shift();
  }
  return produceExpression(results);
}

function expressionParser(string) {
  return expressionGenerator(tokenPaser(string));
}

export { expressionGenerator, expressionParser };
