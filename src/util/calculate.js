import {checkAbsCount} from './check'
export function calculateAbs(tokenObj,absCount){
  checkAbsCount(absCount)
  tokenObj._absCount = tokenObj.$absCount = absCount/2
}
