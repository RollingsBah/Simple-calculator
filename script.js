// Gets the calculator display
const display = document.getElementById("display");

// Adds values to the display
function appendValue(value){
    display.value += value;
}
// Calculates the answer
function calculate(){
    let expression = display.value;
    let expression = display.value;

    // Combination
    if(expression.includes("C")){

        let numbers = expression.split("C");

        let n = Number(numbers[0]);
        let r = Number(numbers[1]);

        display.value = combination(n, r);

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


// Calculates factorial
function factorial(number){

    let result = 1;

    for(let i = 1; i <= number; i++){

        result = result * i;

    }

    return result;

}


// Calculates combination
function combination(n, r){

    let answer;

    answer = factorial(n) /
            (factorial(r) * factorial(n-r));

    return answer;

}
}
