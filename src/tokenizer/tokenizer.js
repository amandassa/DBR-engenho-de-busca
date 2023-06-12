import Tokenizr from "tokenizr"
import { removeStopwords, porBr, por } from 'stopword'
import { readFileSync } from 'fs'

const data = readFileSync('stopwords.json', 'utf8');
const jsonData = JSON.parse(data);
const stopwords = jsonData['words']

/**
 * Extrai termos relevantes de uma string em português
 * @param {*} text 
 * @returns array com termos
*/
export default function tokenizer (text) {
    let lexer = new Tokenizr()

    lexer.rule(/\\[ntrf]/, (ctx, match) => {
        ctx.ignore()
    })

    lexer.rule(/[^\s\p{P}\p{S}]+/u, (ctx, match) => {
        ctx.accept("word", match[0]);
    });

    lexer.rule(/\/\/[^\r\n]*\r?\n/u, (ctx, match) => {
        ctx.ignore()
    })

    lexer.rule(/[\f\t\r\n]+/, (ctx, match) => {
        ctx.ignore()
    })
    
    lexer.rule(/./u, (ctx, match) => {
        ctx.ignore()
    })
    
    lexer.rule(/[^\s.,\[\]()?!]+|[çãõáéíóúà]+/u, (ctx, match) => {
        ctx.accept("word", match);
    });

    lexer.rule(/[\s\u000C]+/u, (ctx, match) => {
        ctx.ignore()
    });
    
    lexer.rule(/[\s\p{P}]+/u, (ctx, match) => {
        ctx.ignore()
    });
    
    lexer.rule(/[+-]?[0-9]+/u, (ctx, match) => {
        ctx.accept("number", parseInt(match[0]))
    })

    // lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
    //     ctx.accept("string", match[1].replace(/\\"/g, "\""))
    // })  // talvez seja melhor apagar

    lexer.rule(/[^\s.,\[\]()?!/çãé]+|[çãé]+/iu, (ctx, match) => {
        ctx.accept("word", match[0]);
    });
    
    lexer.input(text)

    let  tokens = []
    var t = ''
    while ((t = lexer.token()) != null) {
        if (t.text !== "") {
            tokens.push(t.text)
        }
    }
    
    return removeStopwords(tokens, stopwords)
}
