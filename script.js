<<<<<<< HEAD
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

    let y = Number(right);

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

    } 
    else if (aText === "-") {

        a = -1;

    } 
    else {

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

    }
    else if (bText === "-") {

        b = -1;

    }
    else {

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

    let d = (b * b) - (4 * a * c);


    if (d < 0) {

        display.value = "No Real Roots";
        return;

    }


    let root = squareRoot(d);


    let x1 = (-b + root) / (2 * a);

    let x2 = (-b - root) / (2 * a);


    display.value = "x1=" + x1 + " , x2=" + x2;

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
=======
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

    let y = Number(right);

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

    } 
    else if (aText === "-") {

        a = -1;

    } 
    else {

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

    }
    else if (bText === "-") {

        b = -1;

    }
    else {

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

    let d = (b * b) - (4 * a * c);


    if (d < 0) {

        display.value = "No Real Roots";
        return;

    }


    let root = squareRoot(d);


    let x1 = (-b + root) / (2 * a);

    let x2 = (-b - root) / (2 * a);


    display.value = "x1=" + x1 + " , x2=" + x2;

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
>>>>>>> 490372839eda91e127163a531c45f486132a0d27
}