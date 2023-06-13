import tokenizer from "./tokenizer.js";
import { readFileSync } from "fs";

let cfg = readFileSync("sample.txt", 'utf-8')

// console.log(cfg)
console.log(tokenizer(cfg))