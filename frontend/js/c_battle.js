const path = "../json/battle.json";

export class Battle{
    constructor(){
        $.getJSON(path,function(data){
            this.player_hp = data.player_hp;
            this.enemy_hp = data.enemy_hp;
            this.table_row = data.table_row;
            this.player_column = data.player_column;
            this.enemy_column = data.enemy_column;
            let player_block = [];
            for (let i=0;i<this.table_row;i++){
                let array = [];
                for (let j=0;j<this.player_column;j++){
                    array.push(parseInt(data.player_block[i*this.player_column+j]));
                }
                player_block.push(array);
            }
        }).fail(function(){
            console.log("An error has occurred.");
        });
    }
    getBlockById(row,column){
        return this.player_block[row,column];
    }
}
