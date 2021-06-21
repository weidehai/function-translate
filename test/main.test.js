import {expressionParser} from '../src/parser/main'


test("expressionParser",()=>{
    expect(expressionParser('123+1')).toBe("(123+1)")
})

test("expressionParser",()=>{
    expect(expressionParser('1231')).toBe("(1231)")
})

test("expressionParser",()=>{
    expect(()=>{
        expressionParser('(22')
    }).toThrow()
})



test("expressionParser",()=>{
  expect(expressionParser('1-(||x||-1)')).toBe("(1-((Math.abs((Math.abs(x))))-1))")
})


test("expressionParser",()=>{
  expect(expressionParser('(1-(|x|-1)^2)^(1/2)')).toBe("(Math.pow((1-Math.pow(((Math.abs(x))-1),2)),(1/2)))")
})



test("expressionParser",()=>{
  expect(expressionParser('1.2(tanx)')).toBe("(1.2*(Math.tan(x)))")
})
