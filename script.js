// Gets the calculator display
const display = document.getElementById("display");

// Adds values to the display
function appendValue(value){
    display.value += value;
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

    // modulus //
     else if(expression.includes("%")){
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