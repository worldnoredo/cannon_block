var selected = false;
var first_column = null;
var first_row = null;
var battle_data;

const RED_CANNON = 1;
const GREEN_CANNON = 2;

$(document).ready(function(){
    $.getJSON("../json/battle.json", function(data){
        battle_data = data;
        loadData(battle_data);
    }).fail(function(){
        console.log("An error has occurred.");
    });
});

function loadData(data){
    $("#player_hp").text(data.player_hp);
    $("#enemy_hp").text(data.enemy_hp);

    $("#player_cannon").html(draw_player_table(data));
    $("#enemy_cannon").html(draw_enemy_table(data));
}
function draw_player_table(data){
    var result = "";
    for (let i=0;i<data.table_row;i++){
        result += '<div class="d-flex flex-row pb-1" id="row'+i+'">';
        for (let j=0;j<data.player_column;j++){
            var block_type = parseInt(data.player_block[i*data.player_column+j]);
            switch (block_type){
                case RED_CANNON:
                    result+='<div class="block red_block" id="block'+i+j+'"></div>';
                    break;
                case GREEN_CANNON:
                    result+='<div class="block green_block" id="block'+i+j+'"></div>';
                    break;
                default:
                    result+='<div class="block" id="block'+i+j+'"></div>';
            }
        }
        var cannon_type = parseInt(data.player_cannon[i]);
        switch (cannon_type){
            case RED_CANNON:
                result+='<img class="head_cannon" src="../image/red_head_cannon.png" alt="red_cannon"/ >';
                break;
            case GREEN_CANNON:
                result+='<img class="head_cannon" src="../image/green_head_cannon.png" alt=green_cannon"/>';
                break;
            default:
                result+='<img class="head_cannon" src="../image/green_head_cannon.png" alt="green_cannon"/>';
        }
        result += '</div>';
    }
    return result;
}

function draw_enemy_table(data){
    var result = "";
    for (let i=0;i<data.table_row;i++){
        result += '<div class="d-flex flex-row pb-1" id="enemy_row'+i+'">';
        result+='<img class="head_cannon " src="../image/enemy_head_cannon.png" alt="enemy_cannon"/>';
        for (let j=0;j<data.enemy_column;j++){
            var cannon_count = parseInt(data.enemy_count[i]);
            if (j<cannon_count){
                result += '<div class="block black_block"></div>';
            } else {
                result += '<div class="block red_block"></div>';
            }
        }
        result += '</div>';
    }
    return result;
}

$("#player_cannon").on("click",".block",function(){
    console.log("click");
    var id = $(this).attr('id').substr(5);  //erase "block" in id
    
    if (!selected){
        $(this).addClass("block_selected");
        selected = true;
        first_column = id[1];
        first_row = id[0];
    }
    else {
        var second_column = id[1];
        var second_row = id[0];
        if ((Math.abs(first_column-second_column) + Math.abs(first_row-second_row) == 1)
            && (($("#block"+first_row+first_column).hasClass("red_block") && !$(this).hasClass("red_block"))
            || ($("#block"+first_row+first_column).hasClass("green_block") && !$(this).hasClass("green_block")))){
            $("#block"+first_row+first_column).toggleClass("red_block");
            $("#block"+first_row+first_column).toggleClass("green_block");
            $(this).toggleClass("red_block");
            $(this).toggleClass("green_block");
            
        }
        $("#block"+first_row+first_column).removeClass("block_selected");
        selected = false;
        first_column = null;
        first_row = null;
    }
});
function after_turn_process(data){
    
}
