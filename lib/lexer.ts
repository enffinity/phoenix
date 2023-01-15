// let x = 45 + ( foo * bar )
// [ letToken, IdentifierTk, EqualsToken, NumberToken ]

export enum TokenType {
    // Literaly Types
    Null,
    Number,
    Identifier,
    // Grouping * Operators
    Equals,
    OpenParen, 
    CloseParen,
    BinaryOperator,
    // Keywords
    Let,

    EOF, // Signified the end of file
}

const KEYWORDS: Record<string, TokenType> = {
    'let': TokenType.Let,
    'null': TokenType.Null,
}

export interface Token {
    value: string;
    type: TokenType;
}

function token( value = '', type: TokenType ): Token {
    return { value, type, }
}

function isalpha (src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isskippable(str: string) {
    return str == ' ' || str == '\n' || str == '\t';
}

function isint (str: string) {
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]);
}

export function tokenize (sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split('');

    // Build each token until end of file
    while (src.length > 0) {
        switch(src[0]) {
            case '(':
                tokens.push(token(src.shift(), TokenType.OpenParen));
                break;
            case ')':
                tokens.push(token(src.shift(), TokenType.CloseParen));
                break;
            case '+':
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
                break;
            case '-':
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
                break;
            case '*':
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
                break;
            case '/':
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
                break;
            case '=':
                tokens.push(token(src.shift(), TokenType.Equals));
                break;
            case '%':
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
                break;
            default:
                // handle multicharacter tokens

                // Build number token
                if(isint(src[0])) {
                    let num = '';
                    while (src.length > 0 && isint(src[0])) {
                        num += src.shift();
                    }

                    tokens.push(token(num, TokenType.Number));
                // Build alphabet token
                } else if(isalpha(src[0])) {
                    let ident = '';
                    while (src.length > 0 && isalpha(src[0])) {
                        ident += src.shift();
                    }

                    // check for reserved keywords
                    const reserved = KEYWORDS[ident];
                    if(typeof reserved == "number" ) {
                        tokens.push(token(ident, reserved));
                    } else {
                        tokens.push(token(ident, TokenType.Identifier));
                    }
                } else if(isskippable(src[0])) {
                    src.shift();
                } else {
                    console.log('Unrecognized character found in source: ', src[0]);
                    Deno.exit(1);
                }
                break;
        }
    }

    tokens.push({ type: TokenType.EOF, value: 'EndOfFile' });
    return tokens;
}