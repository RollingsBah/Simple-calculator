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
      if (messageShowing && display.value === text) {
        display.value = restoreValue;
        messageShowing = false;
      }
    }, 1500);
  }
}

// Clears a displayed message before the user starts typing again
function clearMessage() {
  messageShowing = false;
}

// Adds values to the display
function appendValue(value) {
  if (messageShowing) {
    messageShowing = false;
    display.value = "";
  }

  if (display.value === "Error" || display.value === "No Real Roots") {
    display.value = "";
  }

  display.value += value;
  hideHistoryPanel();
}

// Adds decimal point
function decimal() {
  clearMessage();
  hideHistoryPanel();
  const lastNumber = display.value.split(/[^0-9.]/).pop();
  if (!lastNumber || !lastNumber.includes('.')) {
    display.value += '.';
  }
}

// =========================================
// SQUARE ROOT BUTTON
// =========================================
function squareRootValue() {
  let number = Number(display.value);

  if (display.value.trim() !== "" && isNaN(number)) {
    try {
      number = evaluateExpression(display.value);
    } catch (e) {
      display.value = "Error";
      return;
    }
  }

  if (isNaN(number) || number < 0) {
    display.value = "Error";
    return;
  }

  display.value = squareRoot(number);
}

// Clear display
function clearDisplay() {
  messageShowing = false;
  display.value = "";
  hideHistoryPanel();
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

// =========================================
// TOKENIZER
// =========================================
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
      tokens.push("*");
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

// =========================================
// CALCULATE
// =========================================
function calculate() {
  clearMessage();
  hideHistoryPanel();

  const expression = display.value.trim();

  if (expression === "") {
    display.value = "Error";
    return;
  }

  // =========================================
  // QUADRATIC EQUATION
  // Format: ax²+bx+ceqy
  // Example: 2x²-5x+3eq7
  // =========================================

  let eqPosition = -1;

  // Find "eq"
  for (let i = 0; i < expression.length - 1; i++) {
    if (expression[i] === "e" && expression[i + 1] === "q") {
      eqPosition = i;
      break;
    }
  }

  if (eqPosition !== -1) {
    let left = "";
    let right = "";

    // Get left side
    for (let i = 0; i < eqPosition; i++) {
      left += expression[i];
    }

    // Get y value
    for (let i = eqPosition + 2; i < expression.length; i++) {
      right += expression[i];
    }

    const y = Number(right);

    if (isNaN(y)) {
      display.value = "Error";
      return;
    }

    let a = 0;
    let b = 0;
    let c = 0;

    // Find x² position
    let xSquarePosition = -1;

    for (let i = 0; i < left.length - 1; i++) {
      if (left[i] === "x" && left[i + 1] === "²") {
        xSquarePosition = i;
        break;
      }
    }

    if (xSquarePosition === -1) {
      display.value = "Error";
      return;
    }

    // Get a
    let aText = "";

    for (let i = 0; i < xSquarePosition; i++) {
      aText += left[i];
    }

    if (aText === "" || aText === "+") {
      a = 1;
    } else if (aText === "-") {
      a = -1;
    } else {
      a = Number(aText);
    }

    // Remaining part after x²
    let remaining = "";

    for (let i = xSquarePosition + 2; i < left.length; i++) {
      remaining += left[i];
    }

    // Find x position
    let xPosition = -1;

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i] === "x") {
        xPosition = i;
        break;
      }
    }

    if (xPosition === -1) {
      display.value = "Error";
      return;
    }

    // Get b
    let bText = "";

    for (let i = 0; i < xPosition; i++) {
      bText += remaining[i];
    }

    if (bText === "" || bText === "+") {
      b = 1;
    } else if (bText === "-") {
      b = -1;
    } else {
      b = Number(bText);
    }

    // Get c
    let cText = "";

    for (let i = xPosition + 1; i < remaining.length; i++) {
      cText += remaining[i];
    }

    c = Number(cText);

    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
      display.value = "Error";
      return;
    }

    // ax²+bx+c=y
    // becomes ax²+bx+(c-y)=0
    c = c - y;

    // Discriminant
    const d = (b * b) - (4 * a * c);

    if (d < 0) {
      display.value = "No Real Roots";
      return;
    }

    const root = squareRoot(d);

    const x1 = (-b + root) / (2 * a);
    const x2 = (-b - root) / (2 * a);

    const result = "x1=" + x1 + " , x2=" + x2;

    saveToHistory(expression + " = " + result);
    display.value = result;
    return;
  }

  // -------------------------
  // Combination (nCr)
  // -------------------------
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

  // -------------------------
  // Normal Expression
  // -------------------------
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

  return factorial(n) / (factorial(r) * factorial(n - r));
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
  let high = number < 1 ? 1 : number;
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

  const result = (low + high) / 2;

  const rounded = Math.round(result * 1000000) / 1000000;

  if (Math.abs((rounded * rounded) - number) < 0.000001) {
    return rounded;
  }

  return result;
}

// =========================================
// GREATEST COMMON DIVISOR
// =========================================
function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

// =========================================
// DECIMAL TO FRACTION
// =========================================
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

// =========================================
// HISTORY
// =========================================
let historyList = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

// Saves an entry to the history list
function saveToHistory(entry) {
  historyList.push(entry);
  localStorage.setItem('calculatorHistory', JSON.stringify(historyList));
}

// 1. retrieved - Retrieve the most recent saved calculation
function retrievehistory() {
  clearMessage();
  if (historyList.length === 0) {
    showMessage("No history to retrieve", display.value);
    return;
  }
  const lastSaved = String(historyList[historyList.length - 1]);
  // entries look like "8-5 = 3"; pull out just the result
  const result = lastSaved.includes(" = ") ? lastSaved.split(" = ").pop() : lastSaved;
  display.value = result;
}

// 2. preview - show all saved calculations on the display AND in the history panel
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

// 3. cleared - clear the saved history
function clearedHistory() {
  clearMessage();

  const previous = display.value;
  historyList = [];
  localStorage.removeItem('calculatorHistory');
  showMessage("History cleared!", previous);
}

// save history
function saveHistory() {
  if (display.value === '' || display.value === 'Error') {
    alert('Nothing to save');
    return;
  }

  const previous = String(display.value);
  let entry = previous;

  try {
    const result = evaluateExpression(previous);
    if (typeof result === 'number' && !isNaN(result)) {
      entry = previous + " = " + result;
    }
  } catch (e) {
    // not a plain expression; keep the raw value
  }

  saveToHistory(entry);

  // show save confirmation message then restore previous value
  display.value = 'History saved!';
  setTimeout(() => {
    display.value = previous;
  }, 800);
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
    clearDisplay();
  } else if (event.key === ".") {
    decimal();
  } else if (event.key === "c" || event.key === "C") {
    combinationButton();
  }
});
