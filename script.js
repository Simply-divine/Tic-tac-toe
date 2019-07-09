var origboard;
const huplayer = 'O';
const aiplayer = 'X';
const wincombes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
]
const cells = document.querySelectorAll(".cell");

startgame();

function startgame() {
    document.querySelector('.endgame').style.display = "none";
    origboard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);

    }
}
//x represents click event
function turnClick(x) {
    if (typeof origboard[x.target.id] == 'number') {
        turn(x.target.id, huplayer);
        if (!checkTie()) turn(bestSpot(), aiplayer);
    }
}

function checkTie() {
    if (emptysquares().length == 0) {
        for (i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner('Tie Game!!')
        return true;
    }
    return false;
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = 'block';
    document.querySelector(".endgame .text").innerText = who;
}

function emptysquares() {
    return origboard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origboard, aiplayer).index;
}

function turn(id, player) {
    origboard[id] = player;
    document.getElementById(id).innerText = origboard[id];
    let gameWon = checkWin(origboard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e == player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, entries] of wincombes.entries()) {
        if (entries.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of wincombes[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = (gameWon.player == huplayer) ? "blue" : "red"
    }
    for (var i; i < cells.length; i++) {
        cells.removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huplayer ? "You Win!!" : "You Lose");
}

function minimax(newboard, player) {
    var availspots = emptysquares(newboard);
    var moves = [];
    if (checkWin(newboard, huplayer)) {
        return { score: -10 };
    } else if (checkWin(newboard, aiplayer)) {
        return { score: 10 };
    } else if (availspots.length == 0) {
        return { score: 0 };
    }
    for (var i = 0; i < availspots.length; i++) {
        var move = {};
        move.index = newboard[availspots[i]];
        newboard[availspots[i]] = player;
        if (player == aiplayer) {
            var result = minimax(newboard, huplayer);
            move.score = result.score;
        } else {
            var result = minimax(newboard, aiplayer);
            move.score = result.score;
        }
        newboard[availspots[i]] = move.index;
        moves.push(move);
    }
    var bestmove;
    if (player === aiplayer) {
        var bestscore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestscore) {
                bestscore = moves[i].score;
                bestmove = i;
            }
        }
    } else {
        var bestscore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestscore) {
                bestscore = moves[i].score;
                bestmove = i;
            }
        }
    }
    // console.log(bestmove);
    return moves[bestmove];

}