/*
Project Name: Calculator version 1.0
File Name: script.js
Author: Lance Takiguchi
Date: 09/02/2016 Time: 10:42
09/05/2016 16:00, 9/6/2016 09:07
Objective: Aid in connect the calculator to the js to create functionality
Prompt: https://github.com/Learning-Fuze/calculator/tree/v1#getting-started
*/
// ****** GLOBAL VARIABLES ******
var equation_string_array = []; // ** The array that holds all the inputs of current use
var index = 0; // ** index for equation_string_array
var current_string = ""; // ** Holds the last number inputs or operator
var was_last_button_operator = null; /* **Flag to tell if the last input was an operator*/
var was_last_equals = null; // ** Flag to tell if the last button pressed was an equals
var solution = null; /* **the solution to the last operation */
/* ** Run the js functions */
$(document).ready(function(){
    display(0); // ** Default loaded calculator displays 0.
    $('.buttons button').on('click', function () {
        var button_input = $(this);
        handle_type(determine_type(button_input[0]));
    });
});
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
/* ** It is passed an object with type & value of the last button input and then determines what to call according
        to certain conditions */
var handle_type = function(button){
    if(button.type == "operator"){
        if(was_last_equals){  // ** If the last button pressed was an equals
            clear_all_string();
            index = 0;
            string_into_array({type: "number", value: solution});
            clear_all();
        }
        var maybe_operator = equation_string_array[index - 1]; // ** Should be the last operator value in the array
        // ** Purpose: Handle num, op, num, op situation
        if(maybe_operator == "+" || maybe_operator == "-" || maybe_operator == "x" || maybe_operator == "/"){
            var num1 = null;
            if(typeof(solution) == "number"){ // ** If there is a solution already in the works
                num1 = solution;
            }else{ // ** This is the 2nd operator in the operation
                num1 = equation_string_array[index-2];
            }
            solution = equals_operator( /* ** Call appropriate operator function */
                num1, // **num1
                equation_string_array[index], // **num2
                equation_string_array[index-1]); // **operator
            display(solution);
        }
        index++;
        string_into_array(button);
        index++;
        was_last_button_operator = true;
        was_last_equals = false;
        if(button.value == "/"){
        }else if(button.value == "x"){
        }else if(button.value == "-"){
        }else{ // ** Addtion
        }
    }else if(button.type == "clear"){
        was_last_equals = false;
        if (button.value == "ce"){
            // **If the last_button was a operator, we do not care to clear the number
            if(was_last_button_operator){
                display(0);
            }else{
                string_into_array(button);
                display(0);
                was_last_button_operator = true; // **Because we are clearing the last input, which was a number,
                                                    // the array's last input is now an operator, therefore,
                                                    // the was_last_button_operator flag is true
            }
        }else{ // ** C was pressed; Clear all.
            string_into_array(button);
            was_last_button_operator = false;
            display(0)
            index = 0;
        }
    }else if(button.type == "decimal"){
        was_last_button_operator = false;
        was_last_equals = false;
        string_into_array(button);
        display(current_string)
    }else if(button.type == "equals"){
        was_last_equals = true;
        if (typeof(solution) == "number"){
            solution = equals_operator( /* ** Call appropriate operator function */
                solution, // **num1
                equation_string_array[index], // **num2
                equation_string_array[index-1]); // **operator
            was_last_button_operator = false;
            display(solution);
        }else{
            solution = equals_operator( /* ** Call appropriate operator function */
                equation_string_array[index-2], // **num1
                equation_string_array[index], // **num2
                equation_string_array[index-1]); // **operator
            was_last_button_operator = false;
            display(solution);
        }
    }else{ /* If it was a number */
        if(was_last_equals){ // ** If last inputs were number, operator, number, equals, number,
            // then act like there was a clear pressed first
            clear_all_string();
            clear_all();
        }/*else if(typeof(solution) == "number"){

        }*/
        was_last_equals = false;
        string_into_array(button);
        was_last_button_operator = false;
        display(current_string);
        /*TODO: Handle a number input after an equals/result input*/
    }
};
/* **string_into_array: 1 parameters object with type, value.
        if it is a number, add to string, if operator, put into next index */
var string_into_array = function(last_input){
    if(last_input.type == "operator"){
        equation_string_array[index] = last_input.value;
        current_string = "";
    }else if(last_input.type == "clear") {
        if (last_input.value == "ce") {
            equation_string_array.pop();
            current_string = "";
        }else{ // ** button c was pressed; aka, clear all
            clear_all();
            clear_all_string()
        }
    }else if(last_input.type == "decimal"){
        var decimal_flag = false; // ** If true, there is already a decimal in the current_string
        var last_string = equation_string_array[index];
        for(char in last_string){
            if(last_string[char] == "."){ // ** Search to see if there is a decimal already, if so, set the decimal_flag.
                decimal_flag = true;
                break;
            }
        }
        if(!decimal_flag){ // ** If there has been no decimal
            if(display() == 0){ // ** Check to see if it was last just a 0.
                current_string += 0;
                current_string += last_input.value;
                equation_string_array[index] = current_string;
            }else{
                current_string += last_input.value;
                equation_string_array[index] = current_string;
            }
        }
    }else{ /* **It is a number */
        current_string += last_input.value;
        equation_string_array[index] = current_string;
    }
};
// ** Clears all of the strings
var clear_all_string = function(){
    equation_string_array = [];
    current_string = "";
};
/* **display function: shows parameter into the calculator's display. */
var display = function(display_this){
    $("#display").html(display_this);
    console.log(equation_string_array)
    return $("#display").text();
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
    }else if(operator == "/"){
        return division_operator(num1, num2);
    }
};
// **Passed 2 numbers. The functions adds them and returns the value.
var addition_operator = function (num1, num2){
    return Number(num1) + Number(num2);
};
// **Passed 2 numbers. The functions subtracts them and returns the value.
var subtraction_operator = function(num1, num2){
    return Number(num1) - Number(num2);
};
// **Passed 2 numbers. The functions multiplies them and returns the value.
var multiplication_operator = function(num1, num2){
    return Number(num1) * Number(num2);
}
// **Passed 2 numbers. The functions divides them and returns the value.
var division_operator = function(num1, num2){
    return Number(num1) / Number(num2);
}
var clear_all = function(){
    solution = null;
    index = 0;
    was_last_button_operator = null;
}