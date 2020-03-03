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

function calculate_score(slide,piece){
    var score = 0;
    var opp_piece = HUMAN_PIECE;
    var count=0;
    var countEmpty=0;
    var countOpp = 0;

    if(piece==HUMAN_PIECE){
        opp_piece = COMP_PIECE;
    }

    for (var i = 0; i<slide.length;++i){
        if(slide[i]==piece){
            count++;
        }
        if(slide[i]==EMPTY){
            countEmpty++;
        }
        if(slide[i]==opp_piece){
            countOpp++;
        }
    }

    if (count==4){
        score+=10000000;
    }else if(count==3 && countEmpty==1){
        score+=10;
    }else if(count==2 && countEmpty==2){
        score+=2;
    }

    if (countOpp==3 && countEmpty==1){
        score-=10;
    }
    return score
}

function score_position(board,piece){
    var score=0;

    // horizontal
    for (var r=0;r<ROWS;r++){
        var rows = board[r];
        for(var c=0;c<COLUMNS-3;c++){
            var slide = rows.slice(c,c+4);
            score+=calculate_score(slide,piece);
        }
    }

    // vertical
    for (var c=0;c<COLUMNS;c++){
        var cols=[];
        for(var row=0;row<ROWS;row++){
            cols.push(board[row][c]);
        }

        for(var r=0;r<ROWS-3;r++){
            var slide = cols.slice(r,r+4);
            score+=calculate_score(slide,piece);
        }
    }

    // positive
    for (var r=0;r<ROWS-3;r++){
        for(var c=0;c<COLUMNS-3;c++){
            var slide=[];
            for(var i=0;i<4;i++){
                slide.append(board[r+i][c+i]);
            }
            score+=calculate_score(slide,piece);
        }
    }

    // negative
    for (var r=0;r<ROWS;r++){
        for(var c=0;c<COLUMNS-3;c++){
            var slide=[];
            for(var i=0;i<4;i++){
                slide.append(board[r-i][c+i]);
            }
            score+=calculate_score(slide,piece);
        }
    }

    return score;
}

function game_over(board){
    if(win(board,HUMAN_PIECE) || win(board,COMP_PIECE) || len(get_valid_moves(board))==0){
        return true;
    }else{
        return false;
    }
}

function minimax(board,depth,maximizingPlayer){
    var valid_locations = get_valid_moves(board);
    var gameover=game_over(board);

    if (depth==0){
        return false,score_position(board,COMP_PIECE);
    }

    if(gameover){
        if (win(board,COMP_PIECE)){
            return [false, Infinity];
        }else if(win(board,HUMAN_PIECE)){
            return [false,-Infinity];
        }else{
            return [false,0];
        }
    }
//  comp is maximizing player
    if (maximizingPlayer){
        var max_score = -Infinity;
        var index = Math.floor(Math.random() * valid_locations.length);
        var column=valid_locations[index];
        for(var col=0;col<valid_locations.length;col++){
            var row=next_free_pos(board,valid_locations[col]);
            let b_copy = JSON.parse(JSON.stringify(board));
            drop_piece(b_copy,row,col,COMP_PIECE);
            var new_score=minimax(b_copy,depth-1,false)[0];
            if (new_score > max_score){
                max_score = new_score;
                column = col;
            }
        }
        return [column, max_score];
    }else{
        var min_score = Infinity;
        var index = Math.floor(Math.random() * valid_locations.length);
        var column=valid_locations[index];
        for(var col=0;col<valid_locations.length;col++){
            var row=next_free_pos(board,valid_locations[col]);
            let b_copy = JSON.parse(JSON.stringify(board));
            drop_piece(b_copy,row,col,COMP_PIECE);
            var new_score=minimax(b_copy,depth-1,true)[0];
            if (new_score > max_score){
                max_score = new_score;
                column = col;
            }
        }
        return [column,min_score];
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

}

function human_turn(board){
    var turn =HUMAN;
    var play_game=true;
    var posx = event.clientX;
    col = Math.floor(posx/SQUARESIZE);

    if (is_valid_location(board,col)){
        var row = next_free_pos(board,col);
        drop_piece(board,row,col,HUMAN_PIECE);

        if (win(board,HUMAN_PIECE)){
            play_game=false;
        }

        turn=COMP;
        draw_board(board);
    }

    return [turn,play_game];

}

function comp_turn(board){
    var turn=COMP;
    var play_game=true;
    col = minimax(board,4,true);

    if (is_valid_location(board,col)){
        var row = next_free_pos(board,col);
        drop_piece(board,row,col,COMP_PIECE);

        if (win(board,COMP_PIECE)){
            play_game=false;
        }

        turn=HUMAN;
        draw_board(board);
    }

}
