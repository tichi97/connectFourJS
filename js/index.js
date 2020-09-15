const HUMAN = 0;
const COMP = 1;


const EMPTY = 0;
const HUMAN_PIECE = 1;
const COMP_PIECE = 2;


const ROWS=6;
const COLUMNS=7;
const SQUARESIZE=100;

var board = new Array(ROWS);
for (var i = 0; i < board.length; i++) {
    board[i] = new Array(COLUMNS);
}
for (var i = 0; i < ROWS; i++) {
    for (var j = 0; j < COLUMNS; j++) {
        board[i][j] = 0;
    }
}

const BLACK = document.createElement('div');
const RED = document.createElement('div');
const YELLOW = document.createElement('div');

BLACK.classList.add('piece');
BLACK.classList.add('bg-black');

YELLOW.classList.add('piece');
YELLOW.classList.add('bg-yellow');

RED.classList.add('piece');
RED.classList.add('bg-red');
draw_board(board);

console.log(board);

function drop_piece(board,row,col,piece){
    board[row][col]=piece;
}

function win(board,piece){
    // horizontal wins
    for (var c = 0; c < COLUMNS-3; c++){
        for (var r = 0; r<ROWS;r++){
            if (board[r][c]==piece && board[r][c+1]==piece && board[r][c+2] == piece && board[r][c+3] == piece){
                return true;
            }
        }
    }

    // vertical win
    for (var c = 0; c<COLUMNS; c++){
        for (var r = 0; r<ROWS-3;r++){
            if (board[r][c] == piece && board[r+1][c] == piece && board[r+2][c] == piece && board[r+3][c] == piece){
                return true;
            }
        }
    }

    // positive slope win
    for (var c = 0; c<COLUMNS-3; c++){
        for (var r = 0; r<ROWS-3;r++){
            if (board[r][c] == piece && board[r+1][c+1] == piece && board[r+2][c+2] == piece && board[r+3][c+3] == piece){
                return true;
            }
        }
    }

    // negative slope win
    for (var c = 3; c<COLUMNS-3; c++){
        for (var r = 3; r<ROWS;r++){
            if (board[r][c] == piece && board[r-1][c+1] == piece && board[r-2][c+2] == piece && board[r-3][c+3] == piece){
                return true;
            }
        }
    }
}


function game_over(board){
    if(win(board,HUMAN_PIECE) || win(board,COMP_PIECE) || get_valid_moves(board).length==0){
        return true;
    }else{
        return false;
    }
}



function get_valid_moves(board){
    var valid_locations=[];
    for(var col =0;col<COLUMNS;col++){
        if (is_valid_location(board,col)){
            valid_locations.push(col);
        }
    }
    return valid_locations;
}

function is_valid_location(board,col){
    return board[ROWS-1][col]==0;
}

function next_free_pos(board,col){
    for(var r=0;r<ROWS;r++){
        if (board[r][col]==0){
            return r;
        }
    }
}

function draw_board(board){
    var doc_board = document.getElementById('board');
    doc_board.innerHTML='';

    for(var r=0; r<ROWS;r++){
        for(var c=0;c<COLUMNS;c++){
            if(board[r][c]==EMPTY){
                doc_board.appendChild(BLACK.cloneNode(true));
                console.log('black');

            }else if(board[r][c]==HUMAN_PIECE){
                doc_board.appendChild(RED.cloneNode(true));
            }else if(board[r][c]==COMP_PIECE){
                doc_board.appendChild(YELLOW.cloneNode(true));
            }
        }
    }

}

function human_turn(board,pos){
    var turn =HUMAN;
    // var posx = event.offsetX;
    var play_game=true;
    col = Math.floor(Number(pos)/SQUARESIZE);
    console.log(pos)


    if (is_valid_location(board,col)){
        var row = next_free_pos(board,col);
        drop_piece(board,row,col,HUMAN_PIECE);

        if (win(board,HUMAN_PIECE)){
            play_game=false;
            winner="RED";
        }

        turn=COMP;
        draw_board(board);
    }

    return [turn,play_game];

}
function human2_turn(board,pos){
    var turn =COMP;
    var play_game=true;
    col = Math.floor(pos/SQUARESIZE);

    if (is_valid_location(board,col)){
        var row = next_free_pos(board,col);
        drop_piece(board,row,col,COMP_PIECE);

        if (win(board,COMP_PIECE)){
            play_game=false;
            winner="YELLOW";
        }

        turn=HUMAN;
        draw_board(board);
    }

    return [turn,play_game];

}



function getPos(event){

}
var play_game=true;
var pos;
var winner;
var turn=HUMAN;
var screenOffset = (screen.width-700)/2;


function play_turn(event){
    pos=event.clientX-screenOffset;

    if (turn==HUMAN){
        var all =human_turn(board,pos);
        turn=all[0];
        play_game=all[1];
    }
    else if(turn==COMP){
        var all = human2_turn(board,pos);
        turn=all[0];
        play_game=all[1]
    }
    if (!play_game){

        popup();
    }
}
function popup(){

    var p = document.getElementById('winner');
    var tiptxt=document.createTextNode(winner + ' wins!');
    p.appendChild(tiptxt);

    var pop=document.getElementById('pop');
    pop.classList.remove('dn');
}
function hide(){
    window.location.href = './index.html';
}
