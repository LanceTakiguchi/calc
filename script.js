/*
Project Name: Calculator version 0.5
File Name: script.js
Author: Lance Takiguchi
Date: 09/01/2016 Time: 11:12
Objective: Aid in connect the calculator to the js to create functionality
Prompt: https://github.com/Learning-Fuze/calculator/tree/v0.5#getting-started
*/
calculator_function = function(type, value, item){
    /*TODO: Take the value and display*/
    if(value == undefined){
        $('#display').html("") /* **Don't display the undefined */
    }else{
        $('#display').html(value);
    }
};

var my_calculator = new calculator(calculator_function);

$(document).ready(function(){
    $('.buttons button').on('click', function () {
        var val = $(this).text();
        if(val == "CE"){ /* **Clear all button */
        my_calculator.allClear();
        }else if(val == "C"){ /* **Just clear last input */
            my_calculator.clear()
        }else if($(this).attr("value") == "/"){ /* **Division operation */
            my_calculator.addItem($(this).attr("value"));
        }else if($(this).attr("value") == "="){ /* **Equals operation */
            my_calculator.addItem("=");
        }else{
            my_calculator.addItem($(this).text());
        }
    });
})