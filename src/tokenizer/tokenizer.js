import Tokenizr from "tokenizr"
import { removeStopwords, porBr, por } from 'stopword'
import { readFileSync } from 'fs'

const data = readFileSync('./stopwords.json', 'utf8');
const jsonData = JSON.parse(data);
const stopwords = jsonData['words']

/**
 * Extrai termos relevantes de uma string em português
 * @param {*} text 
 * @returns array com termos
 */
export default function tokenizer (text) {
    let lexer = new Tokenizr()
    
    lexer.rule(/[^\s.,\[\]()?!]+|[çãõáéíóúà]+/, (ctx, match) => {
        ctx.accept("word", match);
    });
    lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
        ctx.accept("number", parseInt(match[0]))
    })
    lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
        ctx.accept("string", match[1].replace(/\\"/g, "\""))
    })
    lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, match) => {
        ctx.ignore()
    })
    lexer.rule(/[ \t\r\n]+/, (ctx, match) => {
        ctx.ignore()
    })
    lexer.rule(/./, (ctx, match) => {
        ctx.ignore()
    })
        
    lexer.input(text)

    let  tokens = []

    while (lexer.token()) {
      tokens.push(lexer.token().text);
    }
    
    return removeStopwords(tokens, stopwords)
}
