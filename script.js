// Gets the calculator display
const display = document.getElementById("display");

// Adds values to the display
function appendValue(value){
    display.value += value;
}

// Calculates the answer
function calculate(){

    let expression = display.value;

    // Combination
    if(expression.includes("C")){

        let numbers = expression.split("C");

        let n = Number(numbers[0]);
        let r = Number(numbers[1]);

        display.value = combination(n, r);

    }

    // Quadratic Equation
    else if(expression.includes("Q")){

        let numbers = expression.split("Q");

        let a = Number(numbers[0]);
        let b = Number(numbers[1]);
        let c = Number(numbers[2]);

        display.value = quadratic(a, b, c);

    }

    // Addition
    else if(expression.includes("+")){

        let numbers = expression.split("+");

        let first = Number(numbers[0]);
        let second = Number(numbers[1]);

        display.value = first + second;

    }

    // Subtraction
    else if(expression.includes("-")){

        let numbers = expression.split("-");

        let first = Number(numbers[0]);
        let second = Number(numbers[1]);

        display.value = first - second;

    }

    // Multiplication
    else if(expression.includes("*")){

        let numbers = expression.split("*");

        let first = Number(numbers[0]);
        let second = Number(numbers[1]);

        display.value = first * second;

    }

    // Division
    else if(expression.includes("/")){

        let numbers = expression.split("/");

        let first = Number(numbers[0]);
        let second = Number(numbers[1]);

        if(second == 0){

            display.value = "Error";

        }

        else{

            display.value = first / second;

        }

    }

    // Invalid expression
    else{

        display.value = "Error";

    }

}


// ==========================
// FACTORIAL
// ==========================

function factorial(number){

    let result = 1;

    for(let i = 1; i <= number; i++){

        result = result * i;

    }

    return result;

}


// ==========================
// COMBINATION (nCr)
// ==========================

function combination(n, r){

    let answer;

    answer = factorial(n) /
             (factorial(r) * factorial(n - r));

    return answer;

}


// ==========================
// QUADRATIC EQUATION
// ==========================

function quadratic(a, b, c){

    let discriminant;

    discriminant = (b * b) - (4 * a * c);

    if(discriminant < 0){

        return "No real solution";

    }

    let root = Math.sqrt(discriminant);

    let x1 = (-b + root) / (2 * a);

    let x2 = (-b - root) / (2 * a);

    return "x1 = " + x1 + " , x2 = " + x2;

}