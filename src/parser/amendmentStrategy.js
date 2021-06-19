import {
  signNumber,
  number,
  float,
  signFloat,
  leftParentheses,
  rightParentheses,
  rightAbs,
  leftAbs
} from "./regularDefine";

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

export default amendmentStrategy;
