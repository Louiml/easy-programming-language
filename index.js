class Easy{
    constructor(codelouieasy){
        this.codelouieasy = codelouieasy
    }
    tokenize(){
        const length = this.codelouieasy.length
        let pos = 0
        let tokens = []
        const BUILT_IN_KEYWORDS = ["put", "print", "println"]
        const varChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
        let line = 1
        let column = 0
        while(pos < length){
            let currentChar = this.codelouieasy[pos]
            if(currentChar === " "){
                pos++
                column++
                continue
            }else if(currentChar === "\n"){
                line++
                column = 0
                pos++
                continue
            }else if(currentChar === '"'){
                let res = ""
                pos++
                column++
                while(this.codelouieasy[pos] !== '"' && pos < length){
                    res += this.codelouieasy[pos]
                    pos++
                    column++
                }
                if(this.codelouieasy[pos] !== '"'){
                    return {
                        error: `Unterminated string at line ${line} column ${column}`
                    }
                }
                pos++
                column++
                tokens.push({
                    type: "string",
                    value: res,
                })
            }else if(varChars.includes(currentChar)){
                let res = currentChar
                pos++
                column++
                while(varChars.includes(this.codelouieasy[pos]) && pos < length){
                    res += this.codelouieasy[pos]
                    pos++
                    column++
                }
                tokens.push({
                    type: BUILT_IN_KEYWORDS.includes(res) ? "keyword" : "keyword_custom",
                    value: res
                })
            }else if(currentChar === "="){
                pos++
                column++
                tokens.push({
                    type: "operator",
                    value: "eq"
                })
            }else{
                return {
                    error: `Unexpected character ${this.codelouieasy[pos]} at line ${line} column ${column}`
                }
            }
        }
        return {
            error: false,
            tokens
        }
    }
    parse(tokens){
        const len = tokens.length
        let pos = 0
        const vars = {}

        while(pos < len){
            const token = tokens[pos]
            if(token.type === "keyword" && token.value === "put", "print", "println"){
                if(!tokens[pos + 1]){
                    return console.log("Unexpected end of line, expected string")
                }
                let isVar = tokens[pos + 1].type === "keyword_custom"
                let isString = tokens[pos + 1].type === "string"
                if(!isString && !isVar){
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected string`)
                }
                if(isVar){
                    if(!(tokens[pos + 1].value in vars)){
                        return console.log(`Undefined variable ${tokens[pos + 1].value}`)
                    }
                    console.log('\x1b[35m%s\x1b[0m', vars[tokens[pos + 1].value])
                }else{
                    console.log('\x1b[35m%s\x1b[0m', tokens[pos + 1].value)
                }
                pos += 2
            }else if(token.type === "keyword" && token.value === "var"){
                const isCustomKW = tokens[pos + 1] && tokens[pos + 1].type === "keyword_custom"
                if(!isCustomKW){
                    if(!tokens[pos + 1]){
                        return console.log("Unexpected end of line, expected variable name")
                    }
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected variable name`)
                }
                const Name = tokens[pos + 1].value
                const isEq = tokens[pos + 2] && tokens[pos + 2].type === "operator" && tokens[pos + 2].value === "eq"
                if(!isEq){
                    if(!tokens[pos + 2]){
                        return console.log("Unexpected end of line, expected =")
                    }
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected =`)
                }
                const isString = tokens[pos + 3] && tokens[pos + 3].type === "string"
                if(!isString){
                    if(!tokens[pos + 3]){
                        return console.log("Unexpected end of line, expected string")
                    }
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected string`)
                }
                if(Name in vars){
                    return console.log(`Variable ${Name} already exists`)
                }
                vars[Name] = tokens[pos + 3].value
                pos += 4
            }else{
                return console.log(`Unexpected token ${token.type}`)
            }
        }
    }

    run(){
        const{ tokens, error}=this.tokenize()
        if(error){
            return console.log(error)
        }
        this.parse(tokens)
    }
}
const codelouieasy = 
`
put "loui1"
print "loui2"
println "loui3"
`
const easy = new Easy(codelouieasy)
easy.run()