const menu = document.getElementById("menu")
const center = document.getElementById("center")
const menuImg = document.getElementById('menu-img')
const cancel = document.getElementById("cancel");

menu.addEventListener('click', () => {
        
    center.style.display = "flex";
    menu.style.display = 'none'
    cancel.style.display = 'block'
    
})

cancel.addEventListener('click', () => {
        
    center.style.display = "none";
    menu.style.display = 'block'
    cancel.style.display = 'none'
    
})


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