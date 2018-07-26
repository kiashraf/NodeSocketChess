const socket = io();
var board1;
var game;

socket.on('connect', function () {
    console.log('Connected with server!!', socket.id);
})

socket.on('move', function (msg) {
    if (msg) {
        game.move(msg);
        board1.position(game.fen());
    }
})

let initGame = function () {
    let cfg = {
        draggable: true,
        position: 'start',
        onDrop: handleMove
    }

    board1 = new ChessBoard('board1', cfg);
    game = new Chess();

}

var handleMove = function (source, target) {
    var move = game.move({ from: source, to: target });
    if (!move) {
        return 'snapback';
    }
    socket.emit('move', move);
}
initGame();