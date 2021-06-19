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