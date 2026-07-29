// Gets the calculator display
const display = document.getElementById("display");

// Adds values to the display
function appendValue(value) {
  if (display.value === "Error") {
    display.value = "";
  }
  display.value += value;
}

// Tokenizes the expression into numbers and operators
function tokenizeExpression(expression) {
  const tokens = [];

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (/\s/.test(char)) {
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let number = char;

      while (i + 1 < expression.length && /[0-9.]/.test(expression[i + 1])) {
        number += expression[++i];
      }

      tokens.push(Number(number));
    } else if (char === "x") {
      tokens.push("*");
    } else if ("+-*/()".includes(char)) {
      tokens.push(char);
    } else {
      throw new Error("Invalid expression");
    }
  }

  return tokens;
}

// Evaluates the expression using BODMAS-style precedence
function evaluateExpression(expression) {
  const tokens = tokenizeExpression(expression);
  let index = 0;

  function peek() {
    return tokens[index];
  }

  function advance() {
    return tokens[index++];
  }

  function parseExpression() {
    let value = parseTerm();

    while (peek() === "+" || peek() === "-") {
      const operator = advance();
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }

    return value;
  }

  function parseTerm() {
    let value = parseFactor();

    while (peek() === "*" || peek() === "/") {
      const operator = advance();
      const right = parseFactor();

      if (operator === "*") {
        value *= right;
      } else {
        if (right === 0) {
          throw new Error("Division by zero");
        }
        value /= right;
      }
    }

    return value;
  }

  function parseFactor() {
    const token = peek();

    if (token === "+") {
      advance();
      return parseFactor();
    }

    if (token === "-") {
      advance();
      return -parseFactor();
    }

    if (token === "(") {
      advance();
      const value = parseExpression();

      if (peek() !== ")") {
        throw new Error("Invalid expression");
      }

      advance();
      return value;
    }

    if (typeof token === "number") {
      advance();
      return token;
    }

    throw new Error("Invalid expression");
  }

  const result = parseExpression();

  if (peek() !== undefined) {
    throw new Error("Invalid expression");
  }

  return result;
}

// Calculates the answer
function calculate() {
  const expression = display.value.trim();

  if (!expression) {
    display.value = "Error";
    return;
  }

  try {
    display.value = evaluateExpression(expression);
  } catch (error) {
    display.value = "Error";
  }
  
  if (expression.includes("%")) {
        let numbers = expression.split("%");

        let first = Number(numbers[0]);
        let second = Number(numbers[1]);

        display.value = first % second;
     }
     // exponent //
      else if(expression.includes("^")){
          let numbers = expression.split("^");

          let first = Number(numbers[0]);
          let second = Number(numbers[1]);

          display.value = Math.pow(first, second);
      }
}

// Adds decimal point
function decimal(){
    // Prevent multiple decimal points
    if(!display.value.includes(".")){
        display.value += ".";
    }
}

// Finds square root
function squareRoot(){

    let number = Number(display.value);

    if(number < 0 || isNaN(number)){
        display.value = "Error";
    }
    else{
        display.value = Math.sqrt(number);
    }
}


// Greatest Common Divisor
function gcd(a,b){

    while(b !== 0){
        let temp = b;
        b = a % b;
        a = temp;
    }

    return a;
}


// Converts decimal to fraction
function decimalToFraction(){

    let decimal = Number(display.value);

    if(isNaN(decimal)){
        display.value = "Error";
        return;
    }

    // Whole number
    if(Number.isInteger(decimal)){
        display.value = decimal + "/1";
        return;
    }


    let decimalPlaces = decimal.toString().split(".")[1].length;

    let denominator = Math.pow(10, decimalPlaces);

    let numerator = decimal * denominator;


    let divisor = gcd(numerator, denominator);


    numerator = numerator / divisor;
    denominator = denominator / divisor;


    display.value = numerator + "/" + denominator;
}