// Gets the calculator display element
const display = document.getElementById("display");

// Adds the clicked number or operator to the display
function appendValue(value){

    display.value += value;

}

// Calculates the expression entered by the user
function calculate(){

    try{

        // Evaluates the mathematical expression
        display.value = eval(display.value);

    }

    // Displays an error if the expression is invalid
    catch{

        display.value = "Error";

    }
    
}