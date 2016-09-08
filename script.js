/*
Project Name: Calculator version 1.0
File Name: script.js
Author: Lance Takiguchi
Date: 09/02/2016 Time: 10:42
09/05/2016 16:00, 9/6/2016 09:07
Objective: Aid in connect the calculator to the js to create functionality
Prompt: https://github.com/Learning-Fuze/calculator/tree/v1#getting-started
 https://docs.google.com/spreadsheets/d/1HRpRqdyQrax5vgwrVatcOxSxly6GHXXfZuzc0lb9Tfg/pubhtml#
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
        // ** If the previous button pressed was an equals
        if(was_last_equals){
            if(typeof(solution) == Number){ // ** Ex: 1+1= op
                clear_all_string();
                index = 2;
                equation_string_array[0] = solution;
                equation_string_array[1] = button.value;
                return;
            }else if(solution == "Error"){ // ** If Ex: 1/0="Error" operator, then just reset completely
                was_last_equals = null;
                clear_all_string();
                clear_all();
                return;
            }else{
                clear_all_string();
                index = 0;
                string_into_array({type: "number", value: solution});
                display(solution);
                clear_all();
            }
        }else if(equation_string_array.length < 1){ // ** To handle premature operations; operators before anything exists
            display(0);
            return; // ** Do nothing about it
        }
        var maybe_operator = equation_string_array[index - 1]; // ** In [num, op, num] Should be the last operator value in the array
        // ** Purpose: Handle num, op, num, op situation
        if(maybe_operator == "+" || maybe_operator == "-" || maybe_operator == "x" || maybe_operator == "/"){
            // ** See if more than one operator is being pressed in a row
            if(was_last_button_operator) {
                string_into_array(button);
                display_log();
                return; // ** No more need for the operator
            }
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
        display_log();
        /*if(button.value == "/"){
        }else if(button.value == "x"){
        }else if(button.value == "-"){
        }else{ // ** Addtion
        }*/
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
            clear_display_log();
            display(0)
            index = 0;
        }
    }else if(button.type == "decimal"){
        was_last_button_operator = false;
        was_last_equals = false;
        string_into_array(button);
        display(current_string)
    }else if(button.type == "equals"){
        //** If inputs were just num equals
        clear_display_log(); // ** Always clear if button pressed was equals
        if(equation_string_array.length < 2){
            return; // ** ignore the equals input
        }else if(equation_string_array.length == 2){ // ** If it is a num op equals. Ex: 1+= -> 2
            was_last_equals = true;
            solution = equals_operator(equation_string_array[0],
                                        equation_string_array[0],
                                        equation_string_array[1]
            );
            display(solution);
            clear_all_string();
            clear_display_log(); // ** Any time equals is pressed, this should clear
            return;
        }
        // ** Set equals flag
        was_last_equals = true;
        if(was_last_button_operator){
            solution = equals_operator(solution, solution, equation_string_array[index-1]);
            display(solution)
            clear_all_string()
        }
        else if(typeof(solution) == "number"){
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
            clear_display_log();
        }
    }else{ /* If it was a number */
        if(was_last_equals){ // ** If last inputs were number, operator, number, equals, number,
            // then act like there was a clear pressed first
            clear_all_string();
            clear_all();
            clear_display_log()
        }/*else if(typeof(solution) == "number"){

        }*/
        was_last_equals = false;
        string_into_array(button);
        was_last_button_operator = false;
        display(current_string);
        if(equation_string_array.length > 1){
            display_log();
        }else{
            clear_display_log();
        }
    }
};
/* **string_into_array: 1 parameters object with type, value.
        if it is a number, add to string, if operator, put into next index */
var string_into_array = function(last_input){
    if(last_input.type == "operator"){
        var previous_input = equation_string_array[index -1]; /*TODO See if last input was an operator; debugging*/
        // ** See if more than one operator is being pressed in a row
        if(previous_input == "+" || previous_input == "-" || previous_input == "x" || previous_input == "/"){
            equation_string_array[index -1] = last_input.value;
            return; // ** No more need for the operator
        }
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
// ** Seperate from function display in the case just the array updates
var display_log = function(){
    display_array = equation_string_array.slice(0); // ** Used slice to copy the array
    for(element in display_array){ // ** Searching through the array
        if(display_array[element] == "/"){
            display_array[element] = String.fromCharCode("247"); // ** Replace it with the division symbol
        }
    };
    log_to_display = display_array.join(" "); // ** Add space between each number and operator;
    $("#display_equation_log").html(log_to_display); // ** display the array seperated by spaces
}
var clear_display_log = function(){
    $("#display_equation_log").html("");
}
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
    if(num2 == 0){ // ** Handle division by zero. Ex: 1/0
        return "Error";
    }else{
        return Number(num1) / Number(num2);
    }
}
var clear_all = function(){
    solution = null;
    index = 0;
    was_last_button_operator = null;
}