(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FT = {}));
}(this, (function (exports) { 'use strict';

  const tokenRegular = /^(\(|[-+]|(\d*\.\d+)|(\d+\.\d*)|\d+|[*\/]|\)|\^|(ln|lg|log)|(cos|sin|tan|cot)|x|\|)/;
  const signNumber = /^[+-]+\d+$/;
  const number = /^\d+$/;
  const float = /((^\d*\.\d+$)|(^\d+\.\d*$))/;
  const signFloat = /((^([+-]+)?\d*\.\d+$)|(^([+-]+)?\d+\.\d*$))/;


  const leftParentheses = /^\($/;
  const rightParentheses = /^\)$/;

  const leftAbs = /^\^\|$/;
  const rightAbs = /^\$\|$/;

  const exponentHanlder = function(results, tokenList) {
    let left = results.pop();
    let right = tokenList.shift();
    let expression = `Math.pow(${
    Array.isArray(left) ? expressionGenerator(left) : left
  },${Array.isArray(right) ? expressionGenerator(right) : right})`;
    results.push(expression);
  };

  const lnHanlder = function(results, tokenList) {
    let right = tokenList.shift();
    let expression = `Math.log(${
    Array.isArray(right) ? expressionGenerator(right) : right
  })`;
    results.push(expression);
  };

  const lgHandler = function(results, tokenList) {
    let right = tokenList.shift();
    let expression = `Math.log(${
    Array.isArray(right) ? expressionGenerator(right) : right
  })/Math.log(10)`;
    results.push(expression);
  };

  const trigonometryHanlder = function(results, tokenList, token) {
    let right = tokenList.shift();
    let expression = `Math.${token}(${
    Array.isArray(right) ? expressionGenerator(right) : right
  })`;
    results.push(expression);
  };

  const cotHanlder = function(results, tokenList) {
    let next = tokenList.shift();
    next = Array.isArray(next) ? expressionGenerator(next) : next;
    let expression = `Math.cos(${next})/Math.sin(${next})`;
    results.push(expression);
  };

  const absHanlder = function(results){
    results.unshift('Math.abs(');
    results.push(')');
    return results
  };

  const handler = {
    "^": exponentHanlder,
    ln: lnHanlder,
    log: lnHanlder,
    lg: lgHandler,
    sin: trigonometryHanlder,
    cos: trigonometryHanlder,
    tan: trigonometryHanlder,
    cot: cotHanlder,
    abs:absHanlder
  };

  const amendmentStrategy = {
    x: xVariableStrategy,
    "(": leftParenthesesStrategy,
    ")": rightParenthesesStrategy,
    ln: logarithmStrategy,
    lg: logarithmStrategy,
    log: logarithmStrategy,
    sin: trigonometryStrategy,
    cos: trigonometryStrategy,
    tan: trigonometryStrategy,
    cot: trigonometryStrategy
  };

  function xVariableStrategy(tokenList, index) {
    if (index > 0) {
      if (
        isNumber(tokenList[index - 1]) ||
        isRightParentheses(tokenList[index - 1]) ||
        isRightAbs(tokenList[index - 1])
      ) {
        tokenList[index] = `*${tokenList[index]}`;
      }
    }
    if (index < tokenList.length - 1) {
      if (
        isNumber(tokenList[index + 1]) ||
        isLeftParentheses(tokenList[index + 1]) ||
        isLeftAbs(tokenList[index + 1])
      ) {
        tokenList[index] = `${tokenList[index]}*`;
      }
    }
  }

  function logarithmStrategy(tokenList, index) {
    if (index > 0) {
      if (isNumber(tokenList[index - 1])) {
        tokenList[index - 1] = `${tokenList[index - 1]}*`;
      }
    }
  }

  function trigonometryStrategy(tokenList, index) {
    if (index > 0) {
      if (isNumber(tokenList[index - 1])) {
        tokenList[index - 1] = `${tokenList[index - 1]}*`;
      }
    }
  }

  function leftParenthesesStrategy() {}

  function rightParenthesesStrategy() {}

  function isNumber(token) {
    return (
      signNumber.test(token) ||
      number.test(token) ||
      float.test(token) ||
      signFloat.test(token)
    );
  }

  function isRightParentheses(token) {
    return rightParentheses.test(token);
  }

  function isLeftParentheses(token) {
    return leftParentheses.test(token);
  }

  function isLeftAbs(token) {
    return leftAbs.test(token);
  }

  function isRightAbs(token) {
    return rightAbs.test(token);
  }

  function tokenPaser(string) {
    let results = [];
    let isContinue = false;
    let absEnter = false;
    while (string) {
      isContinue = false;
      string = string.replace(tokenRegular, (match, $1) => {
        isContinue = true;
        if (!absEnter && match === "|") {
          absEnter = true;
          match = "^|";
        }
        if (absEnter && match === "|") {
          absEnter = false;
          match = "$|";
        }
        results.push(match);
        return "";
      });
      if (!isContinue && string) throw "illegal expression";
    }
    return buildChild(amendmentToken(results));
  }

  function amendmentToken(tokenList) {
    for (let i = 0; i < tokenList.length; i++) {
      let token = tokenList[i];
      if (amendmentStrategy[token]) {
        amendmentStrategy[token](tokenList, i);
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

  exports.expressionGenerator = expressionGenerator;
  exports.expressionParser = expressionParser;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
