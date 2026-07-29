// Gets the calculator display
const display = document.getElementById("display");

// Adds values to the display
function appendValue(value){
    display.value += value;
}

// Adds decimal point
function decimal(){
    // Prevent multiple decimal points
    if(!display.value.includes(".")){
        display.value += ".";
    }
}

// Calculates the answer
function calculate(){
    let expression = display.value;

    // Addition
    if(expression.includes("+")){
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