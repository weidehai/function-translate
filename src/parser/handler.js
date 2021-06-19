import { expressionGenerator } from "./main";

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
  results.unshift('Math.abs(')
  results.push(')')
  return results
}

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

export default handler;
