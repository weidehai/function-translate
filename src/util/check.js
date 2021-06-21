export function checkTokenParse(isContinue,string){
  if (!isContinue && string) throw "illegal expression";
}


export function checkAbsCount(absCount){
  if(absCount%2 !== 0) throw "abs must come with partners"
}
