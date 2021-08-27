const BATTLE_JSON = "../json/battle.json";
const IMG_RED_BLOCK = "../image/red_block.png";
const IMG_GREEN_BLOCK = "../image/green_block.png";
const IMG_FIRE_BLOCK = "../image/fire_block.png";
const IMG_NO_BLOCK = "../image/no_block.png";
const RED_CANNON = 1;
const GREEN_CANNON = 2;
const FIRE_BLOCK = 3;
const NO_BLOCK = 0;
const NULL_BLOCK = -1;
class Battle{
    constructor(data){
            this.player_hp = data.player_hp;
            this.enemy_hp = data.enemy_hp;
            this.table_row = data.table_row;
            this.player_column = data.player_column;
            this.enemy_column = data.enemy_column;

            let player_table = [];
            for (let i=0;i<this.table_row;i++){
                let array = [];
                for (let j=0;j<this.player_column;j++){
                    array.push(parseInt(data.player_block[i*this.player_column+j]));
                }
                player_table.push(array);
            }
            this.player_block = player_table;

            let player_cannon = [];
            for (let i=0;i<this.table_row;i++){
                player_cannon.push(parseInt(data.player_cannon[i]));
            }
            this.player_cannon = player_cannon;

            this.enemy_table = [];
            for (let i=0;i<this.table_row;i++){
                this.enemy_table.push(parseInt(data.enemy_table[i]));
            }
    }
    //create function for data

    //get
    getPlayerHp(){
        return this.player_hp;
    }
    getEnemyHp(){
        return this.enemy_hp;
    }
    getTableRow(){
        return this.table_row;
    }
    getPlayerColumn(){
        return this.player_column;
    }
    getEnemyColumn(){
        return this.enemy_column;
    }
    getBlockById(row,column){
        return this.player_block[row][column];
    }
    getPlayerCannonByRow(row){
        return this.player_cannon[row];
    }
    getEnemyCannonCount(row){
        return this.enemy_table[row];
    }

    // set/modify
    setPlayerHp(value){
        this.player_hp = value;
    }
    setEnemyHp(value){
        this.enemy_hp = value;
    }
    setBlockById(row,column,value){
        this.player_block[row][column] = value;
    }
    setPlayerCannonByRow(row,value){
        this.player_cannon[row] = value;
    }
    setEnemyCannonCount(row,value){
        this.enemy_table[row] = value;
    }

    //some function
    checkCannonConnectById(row,column){
        if (column == (this.getPlayerColumn() - 1)) {
            if (this.getBlockById(row,column) == this.getPlayerCannonByRow(row) )
                return true;
        } else if (this.getBlockById(row,column) == this.getBlockById(row,parseInt(column)+1) && 
                this.checkCannonConnectById(row,parseInt(column)+1)) 
                    return true;
        return false;
    }
    checkExchangeAvailable(first_row,first_column,second_row,second_column){
        if (Math.abs(first_column-second_column) + Math.abs(first_row-second_row) != 1) return false;
        return true;
    }
    checkSelectAvalable(row,column){
        if (this.checkCannonConnectById(row,column)) return false;
        return true;
    }
    switchTwoBlock(first_row,first_column,second_row,second_column){
        let temp = this.getBlockById(first_row,first_column);
        this.setBlockById(first_row,first_column,this.getBlockById(second_row,second_column));
        this.setBlockById(second_row,second_column,temp);
    }
    addEnemyBlockByRow(fire,row){
        if (fire){
            this.setEnemyCannonCount(row,this.getEnemyColumn());
            return false;
        }
        else if (this.getEnemyCannonCount(row) > 1){
            this.setEnemyCannonCount(row,this.getEnemyCannonCount(row) - 1);
            return false;
        } else if (this.getEnemyCannonCount(row) == 1){
            this.setEnemyCannonCount(row,this.getEnemyColumn());
            console.log("true");
            return true;
        }
    }
}

var selected = false;
var first_column = null;
var first_row = null;
var battle_data;
var c_battle;


$(document).ready(function(){
    $.getJSON(BATTLE_JSON, function(data){
        c_battle = new Battle(data);
        drawData();
    }).fail(function(){
        console.log("An error has occurred.");
    });
});

function drawData(){
    $("#player_hp").text(c_battle.getPlayerHp());
    $("#enemy_hp").text(c_battle.getEnemyHp());

    $("#player_cannon").html(draw_player_table());
    $("#enemy_cannon").html(draw_enemy_table());
}
function draw_player_table(){
    var result = "";
    for (let i=0;i<c_battle.getTableRow();i++){
        result += '<div class="d-flex flex-row pb-1" id="row'+i+'">';
        for (let j=0;j<c_battle.getPlayerColumn();j++){
            var block_type = parseInt(c_battle.getBlockById(i,j));
            switch (block_type){
                case RED_CANNON:
                    result+='<img id="block'+i+j+'" class="block" src="'+IMG_RED_BLOCK+'" / >';
                    break;
                case GREEN_CANNON:
                    result+='<img id="block'+i+j+'" class="block" src="'+IMG_GREEN_BLOCK+'" / >';
                    break;
                case FIRE_BLOCK:
                    result+='<img id="block'+i+j+'" class="block" src="'+IMG_FIRE_BLOCK+'" / >';
                case NO_BLOCK:
                    result+='<img id="block'+i+j+'" class="block" src="'+IMG_NO_BLOCK+'" / >';
                default:
                    result+='<div class="block" id="block'+i+j+'"></div>';
            }
        }
        var cannon_type = parseInt(c_battle.getPlayerCannonByRow(i));
        switch (cannon_type){
            case RED_CANNON:
                result+='<img class="head_cannon" src="../image/red_head_cannon.png" alt="red_cannon"/ >';
                break;
            case GREEN_CANNON:
                result+='<img class="head_cannon" src="../image/green_head_cannon.png" alt=green_cannon"/>';
                break;
            default:
                break;
        }
        result += '</div>';
    }
    return result;
}

function draw_enemy_table(){
    var result = "";
    for (let i=0;i<c_battle.getTableRow();i++){
        result += '<div class="d-flex flex-row pb-1" id="enemy_row'+i+'">';
        result+='<img class="head_cannon " src="../image/enemy_head_cannon.png" alt="enemy_cannon"/>';
        for (let j=0;j<c_battle.enemy_column;j++){
            var cannon_count = parseInt(c_battle.enemy_table[i]);
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
function redrawBlock(row,column){
    $("#block"+row+column).removeClass("block_selected cannon_connect");
    switch(c_battle.getBlockById(row,column)){
        case GREEN_CANNON:
            $("#block"+row+column).attr("src",IMG_GREEN_BLOCK);
            
            break;
        case RED_CANNON:
            $("#block"+row+column).attr("src",IMG_RED_BLOCK);
            
            break;
        case FIRE_BLOCK:
            $("#block"+row+column).attr("src",IMG_FIRE_BLOCK);
            break;
        case NO_BLOCK:
            $("#block"+row+column).attr("src",IMG_NO_BLOCK);
            break;
        default:
            break;
    }
    let i = column;
    while (i>= 0){
        $("#block"+row+i).removeClass("cannon_connect");
        if (c_battle.checkCannonConnectById(row,i)) $("#block"+row+i).addClass("cannon_connect");
        i--;
    }
    
}

function redrawEnemyRow(row){
    var result = "";
    result+='<img class="head_cannon " src="../image/enemy_head_cannon.png" alt="enemy_cannon"/>';
    for (let j=0;j<c_battle.enemy_column;j++){
        var cannon_count = parseInt(c_battle.enemy_table[row]);
        if (j<cannon_count){
            result += '<div class="block black_block"></div>';
        } else {
            result += '<div class="block red_block"></div>';
        }
    }
    $("#enemy_row"+row).html(result);
}
function setFireBlock(row,column){
    c_battle.setBlockById(row,column,FIRE_BLOCK);
    redrawBlock(row,column);
}
function addEnemyBlockByRow(fire,row){
    var check = c_battle.addEnemyBlockByRow(fire,row);
    redrawEnemyRow(row);
    return check;
}
function enemyTurn(fire){
    for(let i=0;i<c_battle.getTableRow();i++){
        var check_fire = fire && c_battle.checkCannonConnectById(i,c_battle.getPlayerColumn()-1);
        if (addEnemyBlockByRow(check_fire,i)){
            var choose_column = Math.floor(Math.random() * c_battle.getPlayerColumn());
            setFireBlock(i,choose_column);
        }
    }
}
function updateHp(){
    $("#player_hp").text(c_battle.getPlayerHp());
    $("#enemy_hp").text(c_battle.getEnemyHp());

}
function exchangeTwoBlock(first_row,first_column,second_row,second_column){
    c_battle.switchTwoBlock(first_row,first_column,second_row,second_column);
    redrawBlock(first_row,first_column);
    redrawBlock(second_row,second_column);
}
$("#player_cannon").on("click",".block",function(){
    var id = $(this).attr('id').substr(5);  //substr "block"
    if (c_battle.checkSelectAvalable(id[0],id[1])){
        if (!selected){
            $(this).addClass("block_selected");
            selected = true;
            first_column = id[1];
            first_row = id[0];
        }
        else {
            var second_column = id[1];
            var second_row = id[0];
            if (c_battle.checkExchangeAvailable(first_row,first_column,second_row,second_column)){
                exchangeTwoBlock(first_row,first_column,second_row,second_column);
                enemyTurn(false);
            }
            
            $("#block"+first_row+first_column).removeClass("block_selected");
            selected = false;
            first_column = null;
            first_row = null;
        }
    }
});

$("#fire_button").on("click",function(){
    enemyTurn(true);
    for (let i = 0; i < c_battle.getTableRow(); i++){
        let total_damage = 0;
        let j = c_battle.getPlayerColumn()-1;
        while(c_battle.checkCannonConnectById(i,j)){
            total_damage += 1;
            j--;
        }
        if (j >= 0 && c_battle.getBlockById(i,j) == FIRE_BLOCK){
            total_damage *= 2;
        }
        else {
            j++;
        }
        for (;j<c_battle.getPlayerColumn();j++){
            c_battle.setBlockById(i,j,NO_BLOCK);
            redrawBlock(i,j);
        }
        c_battle.setEnemyHp(c_battle.getEnemyHp() - total_damage);
        
    }
    updateHp();
})
