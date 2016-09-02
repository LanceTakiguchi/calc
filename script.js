/*
Project Name: Calculator version 1.0
File Name: script.js
Author: Lance Takiguchi
Date: 09/02/2016 Time: 10:42
Objective: Aid in connect the calculator to the js to create functionality
Prompt: https://github.com/Learning-Fuze/calculator/tree/v1.0#getting-started
*/
/* **display function: shows parameter into the calculator's display */
var display = function(display_this){
    /*console.log(display_this);*//*TODO: delete*/
    $("#display").html(display_this);
};
/* **input_string: 1 parameters object with type, value. if it is a number, add to string, if operator, put into next index */
var input_string = function(button){ /*TODO: create string array*/
    if(button.type == "operator"){
        if(button.value == "/"){
            console.log("That's a divide")
        }else if(button.value == "x"){
            console.log("That's a multiply")
        }else if(button.value == "-"){
            console.log("That's a subtract")
        }else{
            console.log("That's addtion")
        }
    }else if(button.type == "clear"){
        if (button.value == "c"){
            console.log("That's a clear")
        }else{
            console.log("That's a clear all")
        }
    }else if(button.type == "decimal"){
        console.log("That's a decimal")
    }else if(button.type == "equals"){
        console.log("that's an equals")
    }else{
        console.log("Its a number")
    }
};
var input_type = function(button){
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
/* ** Run the js functions */
$(document).ready(function(){
    $('.buttons button').on('click', function () {
        var button_input = $(this);
        input_string(input_type(button_input[0]));
        display(button_input.text());
    });
});