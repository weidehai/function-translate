const tokenRegular = /^(\(|[-+]|(\d*\.\d+)|(\d+\.\d*)|\d+|[*\/]|\)|\^|(ln|lg|log)|(cos|sin|tan|cot)|x|\|)/;

const xVariable = /^x$/
const signNumber = /^[+-]+\d+$/
const number = /^\d+$/
const float = /((^\d*\.\d+$)|(^\d+\.\d*$))/
const signFloat = /((^([+-]+)?\d*\.\d+$)|(^([+-]+)?\d+\.\d*$))/


const leftParentheses = /^\($/
const rightParentheses = /^\)$/

const leftAbs = /^\^\|$/
const rightAbs = /^\$\|$/

export { tokenRegular,xVariable,signNumber,number,float,signFloat,leftParentheses,rightParentheses,leftAbs,rightAbs };
