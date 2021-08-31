const BATTLE_JSON = "../json/battle.json";
const IMG_RED_BLOCK = "../image/red_block.png";
const IMG_GREEN_BLOCK = "../image/green_block.png";
const IMG_FIRE_BLOCK = "../image/fire_block.png";
const IMG_NO_BLOCK = "../image/no_block.png";
const IMG_RED_HEAD = "../image/red_head_cannon.png";
const IMG_GREEN_HEAD = "../image/green_head_cannon.png";
const IMG_ENEMY_HEAD = "../image/enemy_head_cannon.png";
const RED_CANNON = 1;
const GREEN_CANNON = 2;
const FIRE_BLOCK = 3;
const NO_BLOCK = 0;
const NULL_BLOCK = -1;
const LEFT = "LEFT";
const RIGHT = "RIGHT"
const UP = "UP";
const DOWN = "DOWN";
const block_square = 52;
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
        else if (this.getEnemyCannonCount(row) > 0){
            this.setEnemyCannonCount(row,this.getEnemyCannonCount(row) - 1);
            return false;
        } else if (this.getEnemyCannonCount(row) == 0){
            this.setEnemyCannonCount(row,this.getEnemyColumn());
            return true;
        }
    }
    getDirection(from_row,from_column,to_row,to_column){
        if (from_row - to_row > 0) 
            return UP;
        else if (from_row - to_row < 0)
            return DOWN;
        else if (from_column - to_column > 0)
            return LEFT;
        else return RIGHT;
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

    $("#player_cannon").css("width",c_battle.getPlayerColumn()*block_square + "px").css("height",c_battle.getTableRow()*block_square+"px");
    $("#player_cannon").html(draw_player_table());
    $("#enemy_cannon").html(draw_enemy_table());
}
function draw_player_table(){
    var result = "";
    for (let i=0;i<c_battle.getTableRow();i++){
        for (let j=0;j<c_battle.getPlayerColumn();j++){
            var block_type = parseInt(c_battle.getBlockById(i,j));
            var img = null;
            switch (block_type){
                case RED_CANNON:
                    img = IMG_RED_BLOCK;
                    break;
                case GREEN_CANNON:
                    img = IMG_GREEN_BLOCK;
                    break;
                case FIRE_BLOCK:
                    img = IMG_FIRE_BLOCK;
                case NO_BLOCK:
                    img = IMG_NO_BLOCK;
                default:
                    img = "";
                    break;
            }
            result += '<img id= "block'+i+j+'" class="player_block" style="top:'+i*block_square+'px;left:'+j*block_square+'px;" src='+img+' alt="img" />' ;
        }
        var cannon_type = parseInt(c_battle.getPlayerCannonByRow(i));
        var img;
        switch (cannon_type){
            case RED_CANNON:
                img = IMG_RED_HEAD;
                break;
            case GREEN_CANNON:
                img = IMG_GREEN_HEAD;
                break;
            default:
                break;
        }
        result += '<img class="player_head_cannon" style="top:'+i*block_square+'px;left:'+c_battle.getPlayerColumn()*block_square+'px;" src='+img+ ' />' ;
    }
    return result;
}

function draw_enemy_table(){
    var result = "";
    for (let i=0;i<c_battle.getTableRow();i++){
        result += '<div class="d-flex flex-row pb-1" id="enemy_row'+i+'">';
        result+='<img class="enemy_head_cannon" src='+IMG_ENEMY_HEAD+' alt="enemy_cannon"/>';
        for (let j=0;j<c_battle.enemy_column;j++){
            var cannon_count = parseInt(c_battle.enemy_table[i]);
            if (j<cannon_count){
                result += '<div class="enemy_block black_block"></div>';
            } else {
                result += '<div class="enemy_block red_block"></div>';
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
    result+='<img class="enemy_head_cannon" src='+IMG_ENEMY_HEAD+' alt="enemy_cannon"/>';
    for (let j=0;j<c_battle.enemy_column;j++){
        var cannon_count = parseInt(c_battle.enemy_table[row]);
        if (j<cannon_count){
            result += '<div class="enemy_block black_block"></div>';
        } else {
            result += '<div class="enemy_block red_block"></div>';
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
function takeDamage(){
    let damage = 0;
    for (let i=0;i<c_battle.getTableRow();i++){
        for (let j=0;j<c_battle.getPlayerColumn();j++){
            if (c_battle.getBlockById(i,j) == FIRE_BLOCK){
                damage += 1;
            }
        }
    }
    c_battle.setPlayerHp(c_battle.getPlayerHp() - damage);
}
function swapTwoId(first_row,first_column,second_row,second_column){
    var temp = $("#block"+first_row+first_column); 
    $("#block"+second_row+second_column).attr("id","block"+first_row+first_column); 
    temp.attr("id","block"+second_row+second_column);
}
function exchangeTwoBlock(first_row,first_column,second_row,second_column){
    animateBlock(first_row,first_column,c_battle.getDirection(first_row,first_column,second_row,second_column));
    animateBlock(second_row,second_column,c_battle.getDirection(second_row,second_column,first_row,first_column));

    c_battle.switchTwoBlock(first_row,first_column,second_row,second_column);
    swapTwoId(first_row,first_column,second_row,second_column);

    redrawBlock(first_row,first_column);
    redrawBlock(second_row,second_column);
}
$("#player_cannon").on("click",".player_block",function(){
    var row = parseInt($(this).css("top").replace("px","")) / block_square;
    var column =  parseInt($(this).css("left").replace("px","")) / block_square; //substr "block"
    if (c_battle.checkSelectAvalable(row,column)){
        if (!selected){
            $(this).addClass("block_selected");
            selected = true;
            first_column = column;
            first_row = row;
        }
        else {
            var second_column = column;
            var second_row = row;
            $("#block"+first_row+first_column).removeClass("block_selected");
            if (c_battle.checkExchangeAvailable(first_row,first_column,second_row,second_column)){
                exchangeTwoBlock(first_row,first_column,second_row,second_column);
                takeDamage();
                updateHp();
                enemyTurn(false);
            }
            selected = false;
        }
    }
});
function animateBlock(row,column,direction){
    switch (direction){
        case UP:
            $("#block"+row+column).animate({top:"-=52px"});
            break;
        case DOWN:
            $("#block"+row+column).animate({top:"+=52px"});
            break;
        case LEFT:
            $("#block"+row+column).animate({left:"-=52px"});
            break;
        case RIGHT:
            $("#block"+row+column).animate({left:"+=52px"});
            break;
        default:
            break;
    }
}
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
            if (total_damage == 0) j++;
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
    takeDamage();
    updateHp();
})
