/*
Project Name: Calculator version 1.0
File Name: script.js
Author: Lance Takiguchi
Date: 09/02/2016 Time: 10:42
09/05/2016 16:00, 9/6/2016 09:07
Objective: Aid in connect the calculator to the js to create functionality
Prompt: https://github.com/Learning-Fuze/calculator/tree/v1#getting-started
*/
var equation_string_array = [];
var index = 0;
var current_string = "";
var was_last_button_operator; /* **Used to reset the current_string */
var unsolved_operation; /* **Used to know when to do an operation */
var solution; /* **the solution to the last operation */
//* **Determines what kind of button was pushed */
var determine_type = function(button){
    if(button.value == "/" || button.value == "x" || button.value == "-" || button.value == "+"){
        return {type: "operator", value: button.value}
    }else if(button.value == "c" || button.value == "ce"){
        return {type: "clear", value: button.value}
    }else if(button.value == "."){
        return {type: "decimal", value: button.value}
    }else if(button.value == "="){
        return {type: "equals", value: button.value}
    }else{
        return {type: "number", value: button.value}
    }
};
//* **The brain that sorts what to do with the last input */
/** * It is passed an object with type & value of the last button input and then determines what to call according
 * to certain conditions */
var handle_type = function(button){
    if(button.type == "operator"){
        last_button_operator = true;
        unsolved_operation = true; /*TODO: make this usful*/
        index++;
        string_into_array(button);
        index++;
        if(button.value == "/"){
            console.log("That's a divide");
        }else if(button.value == "x"){
            console.log("That's a multiply");
        }else if(button.value == "-"){
            console.log("That's a subtract");
        }else{
            console.log("That's addtion");;
        }
    }else if(button.type == "clear"){
        if (button.value == "ce"){
            console.log("That's a clear");
        }else{
            console.log("That's a clear all");
        }
    }else if(button.type == "decimal"){
        console.log("That's a decimal");
    }else if(button.type == "equals"){
        console.log("that's an equals");
        solution = equals_operator( /* ** Call appropriate operator function */
            equation_string_array[index-2], // **num1
            equation_string_array[index], // **num2
            equation_string_array[index-1]); // **operator
        display(solution);
    }else{ /* If it was a number */
        string_into_array(button);
        display(current_string);
        /*TODO: Handle a number input after an equals/result input*/
    }
}
/* **string_into_array: 1 parameters object with type, value. if it is a number, add to string, if operator, put into next index */
var string_into_array = function(last_input){
    if(last_input.type == "operator"){
        equation_string_array[index] = last_input.value;
        current_string = "";
    }else{ /* **It is a number */
        if(was_last_button_operator){ /* **This whole flag is to reset the current_string if it was last a operator */
            was_last_button_operator = false;
            current_string = "";
        }
        console.log("Its a number");
        current_string += last_input.value;
        equation_string_array[index] = current_string;
    }
};
/* **display function: shows parameter into the calculator's display. */
var display = function(display_this){
    /*console.log(display_this);*//*TODO: delete*/
    $("#display").html(display_this);
    console.log(equation_string_array)
};
// ** Takes two numbers and an operator's string.
    // It determines what kind of operation to perform
    // and calls the appropriate operator function and returns the result.
var equals_operator = function (num1, num2, operator) {
    if(operator == "+"){
        return addition_operator(num1, num2);
    }else if(operator == "-"){
        return subtraction_operator(num1, num2);
    }else if(operator == 'x'){
        return multiplication_operator(num1, num2);
    }
};
// **Passed 2 numbers, the functions adds them and returns the value
var addition_operator = function (num1, num2){
    return Number(num1) + Number(num2); /*TODO: Change from hardcoded to last two numbers*/
};
// **Passed 2 numbers, the functions subtracts them and returns the value
var subtraction_operator = function(num1, num2){
    return Number(num1) - Number(num2);
};
// **Passed 2 numbers, the functions multiplies them and returns the value
var multiplication_operator = function(num1, num2){
    return Number(num1) * Number(num2)
}
/* ** Run the js functions */
$(document).ready(function(){
    $('.buttons button').on('click', function () {
        var button_input = $(this);
        handle_type(determine_type(button_input[0]));
    });
});