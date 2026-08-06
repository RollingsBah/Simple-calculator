// Gets the calculator display
const display = document.getElementById("display");

// Tracks when a message (e.g. "History cleared!") is shown on the display
let messageShowing = false;

// Shows a temporary message on the display, optionally restoring a value
function showMessage(text, restoreValue) {
  messageShowing = true;
  display.value = text;

  if (restoreValue !== undefined) {
    setTimeout(() => {
      display.value = restoreValue;
      messageShowing = false;
    }, 1500);
  }
}

// Clears a displayed message before the user starts typing again
function clearMessage() {
  if (messageShowing) {
    display.value = "";
    messageShowing = false;
  }
}

// Adds values to the display
function appendValue(value) {
  // only allow known calculator characters (x/X act as multiply)
  if (!/^[0-9+\-*/%^().xX]$/.test(value)) return;

  if (messageShowing || display.value === "Error") {
    display.value = "";
    messageShowing = false;
  }
  display.value += value;
  hideHistoryPanel();
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
    } else if (char === "x" || char === "X") {
      // "x²" is shorthand for "power of 2", otherwise x is multiply
      if (expression[i + 1] === "²") {
        i++;
        tokens.push("^", 2);
      } else {
        tokens.push("*");
      }
    } else if ("+-*/%^()".includes(char)) {
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

    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const operator = advance();
      const right = parseFactor();

      if (operator === "*") {
        value *= right;
      } else if (operator === "/") {
        if (right === 0) {
          throw new Error("Division by zero");
        }
        value /= right;
      } else if (operator === "%") {
        value = value % right;
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

    let value;

    if (token === "(") {
      advance();
      value = parseExpression();

      if (peek() !== ")") {
        throw new Error("Invalid expression");
      }

      advance();
    } else if (typeof token === "number") {
      value = token;
      advance();
    } else {
      throw new Error("Invalid expression");
    }

    // handle right-associative exponentiation
    if (peek() === "^") {
      advance();
      const exponent = parseFactor();
      value = Math.pow(value, exponent);
    }

    return value;
  }

  const result = parseExpression();

  if (peek() !== undefined) {
    throw new Error("Invalid expression");
  }

  return result;
}

// Formats a numeric result, hiding floating-point noise
function formatResult(value) {
  if (typeof value !== "number" || !isFinite(value)) {
    return "Error";
  }
  const rounded = Math.round(value * 1e12) / 1e12;
  return String(rounded);
}

// Calculates the answer
function calculate() {
  clearMessage();
  hideHistoryPanel();
  const expression = display.value.trim();

  if (!expression) {
    display.value = "Error";
    return;
  }

  // Handle nCr expressions like "5C2" or "5c2"
  const combMatch = expression.match(/^(-?\d+)[cC](-?\d+)$/);
  if (combMatch) {
    const n = Number(combMatch[1]);
    const r = Number(combMatch[2]);

    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n || n > 170) {
      display.value = "Error";
      return;
    }

    const result = formatResult(combination(n, r));
    display.value = result;
    if (result !== "Error") {
      saveToHistory(expression + " = " + result);
    }
    return;
  }

  // Evaluate a quadratic like "2x²-4x+5eq1" by plugging in x=1
  const eqMatch = expression.match(/^([+-]?\d*\.?\d+)x²([+-]?\d*\.?\d+)x([+-]?\d*\.?\d+)eq([+-]?\d*\.?\d+)$/i);
  if (eqMatch) {
    const a = Number(eqMatch[1]);
    const b = Number(eqMatch[2]);
    const c = Number(eqMatch[3]);
    const xVal = Number(eqMatch[4]);

    const formatted = formatResult(a * xVal * xVal + b * xVal + c);
    display.value = formatted;

    if (formatted !== "Error") {
      saveToHistory(expression + " = " + formatted);
    }
    return;
  }

  let result;
  try {
    result = evaluateExpression(expression);
  } catch (error) {
    display.value = "Error";
    return;
  }

  const formatted = formatResult(result);
  display.value = formatted;

  if (formatted !== "Error") {
    saveToHistory(expression + " = " + formatted);
  }
}

// Adds decimal point
function decimal() {
  clearMessage();
  hideHistoryPanel();
  // Prevent multiple decimal points in the current number
  const lastNumber = display.value.split(/[^0-9.]/).pop();
  if (!lastNumber || !lastNumber.includes('.')) {
    display.value += '.';
  }
}

// Finds square root
function squareRoot() {
  clearMessage();
  hideHistoryPanel();

  const number = Number(display.value);

  if (number < 0 || isNaN(number)) {
    display.value = "Error";
  } else {
    display.value = formatResult(Math.sqrt(number));
  }
}

// Inserts the x² token for building quadratic expressions
function appendSquare() {
  if (messageShowing || display.value === "Error") {
    display.value = "";
    messageShowing = false;
  }
  display.value += "x²";
  hideHistoryPanel();
}

// Inserts the "eq" text into the display
function appendEq() {
  if (messageShowing || display.value === "Error") {
    display.value = "";
    messageShowing = false;
  }
  display.value += "eq";
  hideHistoryPanel();
}

// Greatest Common Divisor
function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

// Converts decimal to fraction
function decimalToFraction() {
  clearMessage();
  hideHistoryPanel();

  const decimal = Number(display.value);

  if (isNaN(decimal)) {
    display.value = "Error";
    return;
  }

  // Whole number
  if (Number.isInteger(decimal)) {
    display.value = decimal + "/1";
    return;
  }

  // Round to 12 decimal places then strip trailing zeros to avoid float noise
  const decimalString = decimal.toFixed(12).replace(/\.?0+$/, "");
  const decimalPlaces = decimalString.split(".")[1].length;

  let denominator = Math.pow(10, decimalPlaces);
  let numerator = Math.round(decimal * denominator);

  const divisor = gcd(numerator, denominator);

  numerator = numerator / divisor;
  denominator = denominator / divisor;

  display.value = numerator + "/" + denominator;
}

// DELETE last digit
function deleteLast() {
  clearMessage();
  hideHistoryPanel();
  if (display.value.length > 1) {
    display.value = display.value.slice(0, -1);
  } else {
    display.value = '';
  }
}

// clear button
function acButton() {
  messageShowing = false;
  display.value = '';
  hideHistoryPanel();
}

// History actions
let historyList = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

// Saves an entry to the history list
function saveToHistory(entry) {
  historyList.push(entry);
  localStorage.setItem('calculatorHistory', JSON.stringify(historyList));
}

// 1.retrievehistory Retrieve the most recent saved calculation
function retrievehistory() {
    if (historyList.length === 0) {     //empty
        showMessage("No history to retrieve", display.value);
        return;
    }
    const lastSaved = historyList[historyList.length - 1];   //recentcalc
    // entries look like "8-5 = 3"; pull out just the result
    const result = lastSaved.includes(" = ") ? lastSaved.split(" = ").pop() : lastSaved;
    display.value = result;
}

// 2. PREVIEW button - show all saved calculations on the display AND in the history panel
function previewHistory() {
    clearMessage();

    const panel = document.getElementById('history-panel');

    if (historyList.length === 0) {
        if (panel) panel.classList.remove('show');
        showMessage("No history to preview", display.value);
        return;
    }

    const rows = historyList.slice().reverse()
        .map((entry, index) => `${historyList.length - index}. ${entry}`);

    // Always show on the main display so there is guaranteed feedback
    showMessage(rows.join(' | '), display.value);

    // Also show in the history panel when available
    if (panel) {
        panel.innerHTML = rows.map(row => `<div class="history-row">${row}</div>`).join('');
        panel.classList.add('show');
    }
}

// Hides the history panel when the user starts typing again
function hideHistoryPanel() {
    const panel = document.getElementById('history-panel');
    if (panel) panel.classList.remove('show');
}

// 3. CLEARED button - clear the saved history
function clearedHistory() {
    clearMessage();

    const previous = display.value;
    historyList = [];
    localStorage.removeItem('calculatorHistory');
    showMessage("History cleared!", previous);
}

// save history
function saveHistory() {
  if (display.value === '') {
    alert('Nothing to save');
    return;
  }

  const previous = display.value;
  saveToHistory(previous);

  // show save confirmation message then restore previous value
  document.getElementById('display').value = 'History saved!';
  setTimeout(() => {
    document.getElementById('display').value = previous;
  }, 800);
}

// =========================================
// COMBINATION (nCr) - C button
// =========================================
function combinationButton() {
  clearMessage();
  hideHistoryPanel();

  const match = display.value.match(/^(-?\d+)[cC](-?\d+)$/);

  if (match) {
    const n = Number(match[1]);
    const r = Number(match[2]);

    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n || n > 170) {
      display.value = "Error";
      return;
    }

    display.value = formatResult(combination(n, r));
    return;
  }

  // First press: insert the C operator (e.g. "5" -> "5C")
  display.value += "C";
}

// =========================================
// FACTORIAL
// =========================================
function factorial(number) {
    if (number < 0 || !Number.isInteger(number)) {
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
    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
        return NaN;
    }

    return factorial(n) /
        (factorial(r) * factorial(n - r));
}

// =========================================
// KEYBOARD SUPPORT
// =========================================
document.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    appendValue(event.key);
  } else if ("+-*/%^()".includes(event.key)) {
    appendValue(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    deleteLast();
  } else if (event.key === "Escape") {
    acButton();
  } else if (event.key === ".") {
    decimal();
  } else if (event.key === "c" || event.key === "C") {
    combinationButton();
  } else if (event.key === "x" || event.key === "X") {
    appendValue("x");
  }
});
