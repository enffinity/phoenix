
import chalk from 'npm:chalk@5';

import Parser from './lib/parser.ts';
import { evaluate } from './runtime/interpreter.ts';

repl();

async function repl() {
    const parser = new Parser();

    const decoder = new TextDecoder('utf-8')
    const version = await Deno.readFile('VERSION');

    console.log(`${chalk.red(`🐦 Phoenix Repl v${decoder.decode(version)}`)}`);
    console.log(`${chalk.yellow('Run exit() to exit')}`);

    while (true) {
        const input = prompt(`${chalk.grey('$')} `);

        // check for no user input or exit() keyword
        if(!input || input.includes('exit()')) {
            Deno.exit()
        }

        const program = parser.produceAST(input);

        const result = evaluate(program);
        console.log(result);
    }
}