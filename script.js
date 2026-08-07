// Gets the calculator display
const display = document.getElementById("display");

// Adds values to the display
function appendValue(value){
    display.value += value;
}
// Calculates the answer
function calculate(){
    let expression = display.value;

    let operator="";
    let operatorIndex=-1;

    //find the operator using loops
    for(let i=0; i<expression.length; i++){
        if(expression[i] === "+" || 
            expression[i] === "-" ||
            expression[i] === "*" || 
            expression[i] === "/" || 
            expression[i] === "%" || 
            expression[i] === "^"){
            operator = expression[i];
            operatorIndex = i;
            break;
        }
    }
       let first = Number(expression.substring(0, operatorIndex));
       let second = Number(expression.substring(operatorIndex + 1));
    // Addition
       
    if(operator === "+"){
        display.value = first + second;
    }
    // Subtraction
    else if(operator === "-"){
        display.value = first - second;
    }

    // Multiplication
    else if(operator === "*"){
        display.value = first * second;
    }
    // modulus //
     else if(operator === "%"){
        display.value = first % second;
     }
     // exponent //
      else if(operator === "^"){
          let result = 1;
          for(let i = 0; i < second; i++){
              result *= first;
          }
          display.value = result;
      }
    
     // Division
     else if(operator === "/"){
        display.value = first / second;
        }
    
    }