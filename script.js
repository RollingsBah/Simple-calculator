
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
// DELETE last digit
function deleteLast(){
     const display = document.getElementById("display");
        if (display.value.length > 1) {
    display.value = display.value.slice(0, -1);

} else{
    display.value ='';
    currentInput = '';
}
}

// clear button done!
function acButton(){
    const display = document.getElementById("display");
    display.value = '';
    currentInput = '';
}
  // History actions
let historyList = JSON.parse(localStorage.getItem('calcHistory')) || [];
let clearedList = JSON.parse(localStorage.getItem('clearedHistory')) || [];


// 1.retrievehidstory Retrieve last cleared calculation
function retrievehistory() {
    if(clearedList.length === 0) {
        alert('No cleared history');
        return;
    }
    let lastCleared = clearedList[clearedList.length - 1];
    display.value = lastCleared;
}
// 2. PREVIEW button - show all saved calculations
function previewHistory() {
    if(historyList.length === 0) {
        alert('No history to preview');
        return;
    }
    alert('Saved History:\n' + historyList.join('\n'));
}

// 3. CLEARED button - save what was cleared so you can get it back
function clearedHistory() {
    if(display.value !== '') {
        clearedList.push(display.value);
        localStorage.setItem('clearedHistory', JSON.stringify(clearedList));
        display.value = ''; // clear screen, no alart
        alert('Cleared and saved');
    }
}

// save history
function saveHistory(){

    // save the history array to local storage
    localStorage.setItem("calculatorHistory", JSON.stringify(history));

    // show save confirmation message
    document.getElementById("display").value = "History saved!";
        setTimeout(() =>{
            document.getElementById("display").value = display.value;
        }, 1000);
        
    }

    
    

// =========================================
// CALCULATOR DISPLAY
// =========================================
const display = document.getElementById("display");

// =========================================
// DISPLAY FUNCTIONS
// =========================================

// Add values to the display
function appendValue(value) {
    if (display.value === "Error") {
        display.value = "";
    }

    display.value += value;
}

// Add decimal point
function decimal() {

    let parts = display.value.split(/[+\-*/%^C()]/);
    let current = parts[parts.length - 1];

    if (!current.includes(".")) {
        display.value += ".";
    }
}

// Clear display
function clearDisplay() {
    display.value = "";
}

// Delete one character
function deleteLast() {
    display.value = display.value.slice(0, -1);
}
// =========================================
// SQUARE ROOT BUTTON
// =========================================
function squareRootValue() {

    let number = Number(display.value);

    if (isNaN(number) || number < 0) {
        display.value = "Error";
        return;
    }

    display.value = squareRoot(number);

}

// =========================================
// CALCULATE
// =========================================

function calculate() {

    let expression = display.value.trim();

    if (expression === "") {
        display.value = "Error";
        return;
    }

// -------------------------
// Quadratic Equation
// -------------------------
if (expression.includes("Q")) {

    let numbers = expression.split("Q");

    if (numbers.length != 3) {
        display.value = "Error";
        return;
    }

    let a = Number(numbers[0]);
    let b = Number(numbers[1]);
    let c = Number(numbers[2]);

    if (isNaN(a) || isNaN(b) || isNaN(c) || a == 0) {
        display.value = "Error";
        return;
    }

    display.value = quadratic(a, b, c);
    return;
}

    // -------------------------
    // Combination (nCr)
    // -------------------------
 if (expression.includes("C")) {

    let numbers = expression.split("C");

    let n = Number(numbers[0]);
    let r = Number(numbers[1]);

    if (
        isNaN(n) ||
        isNaN(r) ||
        !Number.isInteger(n) ||
        !Number.isInteger(r) ||
        n < 0 ||
        r < 0 ||
        r > n
    ) {
        display.value = "Error";
        return;
    }

    display.value = combination(n, r);
    return;
}
    // -------------------------
    // Modulus
    // -------------------------
    if (expression.includes("%")) {

        let numbers = expression.split("%");

        let first = Number(numbers[0]);
        let second = Number(numbers[1]);

        if (isNaN(first) || isNaN(second)) {
            display.value = "Error";
            return;
        }

        display.value = first % second;
        return;
    }

    // -------------------------
    // Exponent
    // -------------------------
    if (expression.includes("^")) {

        let numbers = expression.split("^");

        let first = Number(numbers[0]);
        let second = Number(numbers[1]);

        if (isNaN(first) || isNaN(second)) {
            display.value = "Error";
            return;
        }

        let answer = 1;

        for (let i = 0; i < second; i++) {
            answer *= first;
        }

        display.value = answer;
        return;
    }

    // -------------------------
    // Normal Expression
    // -------------------------
    try {

        display.value = evaluateExpression(expression);

    } catch {

        display.value = "Error";

    }
}

// =========================================
// TOKENIZER
// =========================================

function tokenizeExpression(expression) {

    const tokens = [];

    for (let i = 0; i < expression.length; i++) {

        const char = expression[i];

        if (/\s/.test(char)) {
            continue;
        }

        if (/[0-9.]/.test(char)) {

            let number = char;

            while (
                i + 1 < expression.length &&
                /[0-9.]/.test(expression[i + 1])
            ) {
                number += expression[++i];
            }

            tokens.push(Number(number));

        }

        else if (char === "x") {

            tokens.push("*");

        }

        else if ("+-*/()".includes(char)) {

            tokens.push(char);

        }

        else {

            throw new Error("Invalid Expression");

        }

    }

    return tokens;
}

// =========================================
// EXPRESSION EVALUATOR
// =========================================

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

            let operator = advance();

            let right = parseTerm();

            value = operator === "+"
                ? value + right
                : value - right;

        }

        return value;
    }

    function parseTerm() {

        let value = parseFactor();

        while (peek() === "*" || peek() === "/") {

            let operator = advance();

            let right = parseFactor();

            if (operator === "*") {

                value *= right;

            }

            else {

                if (right === 0) {
                    throw new Error();
                }

                value /= right;

            }

        }

        return value;

    }

    function parseFactor() {

        let token = peek();

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

            let value = parseExpression();

            if (peek() !== ")") {
                throw new Error();
            }

            advance();

            return value;

        }

        if (typeof token === "number") {

            advance();

            return token;

        }

        throw new Error();

    }

    let result = parseExpression();

    if (peek() !== undefined) {
        throw new Error();
    }

    return result;

}

// =========================================
// FACTORIAL
// =========================================

function factorial(number) {

    if (number < 0) {
        return NaN;
    }

    let result = 1;

    for (let i = 2; i <= number; i++) {
        result *= i;
    }

    return result;

}
// =========================================
// COMBINATION (nCr)
// =========================================

function combination(n, r) {

    return factorial(n) /
        (factorial(r) * factorial(n - r));

}
// =========================================
// SQUARE ROOT (BINARY SEARCH)
// =========================================

function squareRoot(number) {

    if (number < 0) {
        return "Error";
    }

    if (number === 0 || number === 1) {
        return number;
    }

    let low = 0;
    let high = number;
    let middle;

    while ((high - low) > 0.000001) {

        middle = (low + high) / 2;

        if (Math.abs((middle * middle) - number) < 0.000001) {
            return middle;
        }

        if ((middle * middle) < number) {
            low = middle;
        } else {
            high = middle;
        }

    }

    return (low + high) / 2;

}
// =========================================
// QUADRATIC EQUATION
// =========================================

function quadratic(a, b, c) {

    let discriminant = (b * b) - (4 * a * c);

    if (discriminant < 0) {
        return "No real solution";
    }

    let root = squareRoot(discriminant);

    let x1 = (-b + root) / (2 * a);
    let x2 = (-b - root) / (2 * a);

    return "x1 = " + x1 + ", x2 = " + x2;
}
// =========================================
// GREATEST COMMON DIVISOR
// =========================================

function gcd(a, b) {

    while (b !== 0) {

        let temp = b;

        b = a % b;

        a = temp;

    }

    return a;

}

// =========================================
// DECIMAL TO FRACTION
// =========================================

function decimalToFraction() {

    let decimal = Number(display.value);

    if (isNaN(decimal)) {

        display.value = "Error";
        return;

    }

    if (Number.isInteger(decimal)) {

        display.value = decimal + "/1";
        return;

    }

    let decimalPlaces = decimal.toString().split(".")[1].length;

    let denominator = 10 ** decimalPlaces;

    let numerator = decimal * denominator;

    let divisor = gcd(numerator, denominator);

    numerator /= divisor;
    denominator /= divisor;

    display.value = numerator + "/" + denominator;

}

