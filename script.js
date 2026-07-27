// Gets the calculator display element
const display = document.getElementById("display");


// Adds numbers and operators to display
function appendValue(value){

    display.value += value;

}


// Clears display
function clearDisplay(){

    display.value = "";

}


// Deletes last character
function deleteLast(){

    let text = display.value;

    let newText = "";


    for(let i = 0; i < text.length - 1; i++){

        newText += text[i];

    }


    display.value = newText;

}



// ===============================
// COMBINATION FUNCTIONS (nCr)
// ===============================


// Calculates factorial
function factorial(number){

    let result = 1;


    for(let i = 1; i <= number; i++){

        result = result * i;

    }


    return result;

}



// Calculates combination
function combination(n,r){


    let answer;


    answer = factorial(n) / 
            (factorial(r) * factorial(n-r));


    return answer;

}



// ===============================
// QUADRATIC FUNCTIONS
// ===============================


// Square root without Math.sqrt()
function squareRoot(number){


    let guess = number / 2;


    for(let i = 0; i < 20; i++){

        guess = (guess + number / guess) / 2;

    }


    return guess;

}




// Solves quadratic equation
function quadratic(a,b,c){


    let discriminant;


    discriminant = (b*b) - (4*a*c);



    if(discriminant > 0){


        let root = squareRoot(discriminant);


        let x1 = (-b + root) / (2*a);


        let x2 = (-b - root) / (2*a);



        return "x1=" + x1 + " x2=" + x2;


    }


    else if(discriminant == 0){


        let x = -b/(2*a);


        return "x=" + x;


    }


    else{


        return "No real solution";

    }

}




// ===============================
// MAIN CALCULATE FUNCTION
// ===============================


function calculate(){


    let expression = display.value;



    // Check Combination
    if(expression.includes("C")){


        let values = expression.split("C");


        let n = Number(values[0]);


        let r = Number(values[1]);



        if(r > n || r < 0){

            display.value = "Error";

        }

        else{

            display.value = combination(n,r);

        }


    }



    // Check Quadratic Equation
    else if(expression.includes("Q")){


        let values = expression.split("Q");



        let a = Number(values[0]);

        let b = Number(values[1]);

        let c = Number(values[2]);



        display.value = quadratic(a,b,c);


    }



    // Normal calculation without eval()
    else{


        normalCalculate();

    }

}




// ===============================
// NORMAL CALCULATOR
// ===============================


function normalCalculate(){


    let expression = display.value;


    let operator = "";

    let position = -1;



    // Find operator
    for(let i = 0; i < expression.length; i++){


        if(expression[i]=="+" ||
           expression[i]=="-" ||
           expression[i]=="*" ||
           expression[i]=="/"){


            operator = expression[i];

            position = i;

            break;

        }

    }



    let first = "";

    let second = "";



    // Get first number
    for(let i = 0; i < position; i++){


        first += expression[i];


    }



    // Get second number
    for(let i = position+1; i < expression.length; i++){


        second += expression[i];


    }



    first = Number(first);

    second = Number(second);



    let answer;



    if(operator == "+"){


        answer = first + second;


    }


    else if(operator == "-"){


        answer = first - second;


    }


    else if(operator == "*"){


        answer = first * second;


    }


    else if(operator == "/"){


        if(second == 0){

            display.value = "Cannot divide by zero";

            return;

        }


        answer = first / second;


    }



    display.value = answer;


}