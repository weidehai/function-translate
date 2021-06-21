import {
  signNumber,
  number,
  float,
  signFloat,
  leftParentheses,
  rightParentheses,
  rightAbs,
  leftAbs,
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
  cot: trigonometryStrategy,
  "|": absStrategy,
};

function absStrategy(tokenObj, index) {
  let tokenList = tokenObj.results;
  if (tokenObj._absCount) {
    tokenList[index] = "^" + tokenList[index];
    tokenObj._absCount--;
  } else {
    tokenList[index] = "$" + tokenList[index];
    tokenObj.$absCount--;
  }
}

function xVariableStrategy(tokenObj, index) {
  let tokenList = tokenObj.results;
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

function logarithmStrategy(tokenObj, index) {
  let tokenList = tokenObj.results;
  if (index > 0) {
    if (isNumber(tokenList[index - 1])) {
      tokenList[index - 1] = `${tokenList[index - 1]}*`;
    }
  }
}

function trigonometryStrategy(tokenObj, index) {
  let tokenList = tokenObj.results;
  if (index > 0) {
    if (isNumber(tokenList[index - 1])) {
      tokenList[index - 1] = `${tokenList[index - 1]}*`;
    }
  }
}

function leftParenthesesStrategy(tokenObj, index) {
  let tokenList = tokenObj.results;
  if (index > 0) {
    if (isNumber(tokenList[index - 1])) {
      tokenList[index - 1] = `${tokenList[index - 1]}*`;
    }
  }
}

function rightParenthesesStrategy(tokenObj, index) {
  let tokenList = tokenObj.results;
  if (index > 0) {
    if (isNumber(tokenList[index + 1])) {
      tokenList[index + 1] = `*${tokenList[index + 1]}`;
    }
  }
}

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
