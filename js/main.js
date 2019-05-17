const imgSrc = {
    wk: 'img/wk.png',
    wq: 'img/wq.png',
    wr: 'img/wr.png',
    wb: 'img/wb.png',
    wn: 'img/wn.png',
    wp: 'img/wp.png',
    
    bk: 'img/bk.png',
    bq: 'img/bq.png',
    br: 'img/br.png',
    bb: 'img/bb.png',
    bn: 'img/bn.png',
    bp: 'img/bp.png',
}

const renderState = {
    text: 'text',
    img: 'img'
}

let map = new Array();

let info = new Array();

let fromFigure;

let toFigure;

let possibleMoves;

/**
 * Информация о сохранённой пешке
 */
let savedPawn = {
    figure: ' ',
    x: -1,
    y: -1
};

/**
 * Координаты предыдущей ячейки
 */
let movingFrom = {
    x: 0,
    y: 0
};

/**
 * Координаты битой пешки
 */
let pawnAttack = {
    x: -1,
    y: -1
};

const renderer = renderState.img;

let moveColor = 'white';

/**
 * 
 */
const restart = $('#restart').click(function (e) { 
    e.preventDefault();
    if (confirm('Вы уверены что хотите начать заново?')) {
        moveColor = 'white';
        start();
    }
});

/**
 * 
 */
function initMap() {
    map = [
        //y0  y1   y2   y3   y4   y5   y6   y7
        ['R', 'P', ' ', ' ', ' ', ' ', 'p', 'r'],   // x = 0
        ['N', 'P', ' ', ' ', ' ', ' ', 'p', 'n'],   // x = 1
        ['B', 'P', ' ', ' ', ' ', ' ', 'p', 'b'],   // x = 2
        ['Q', 'P', ' ', ' ', ' ', ' ', 'p', 'q'],   // x = 3
        ['K', 'P', ' ', ' ', ' ', ' ', 'p', 'k'],   // x = 4
        ['B', 'P', ' ', ' ', ' ', ' ', 'p', 'b'],   // x = 5
        ['N', 'P', ' ', ' ', ' ', ' ', 'p', 'n'],   // x = 6
        ['R', 'P', ' ', ' ', ' ', ' ', 'p', 'r']    // x = 7
    ];
}

/**
 * 
 */
function initInfo() {
    info = [
        //y0  y1   y2   y3   y4   y5   y6   y7
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],   // x = 0
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],   // x = 1
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],   // x = 2
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],   // x = 3
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],   // x = 4
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],   // x = 5
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],   // x = 6
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']    // x = 7
    ];
}

/**
 * @description Отмечает откуда можно ходить 
 */
function markMovesFrom() {
    possibleMoves = 0;
    initInfo();

    for (let sx = 0; sx < 8; sx++) {
        for (let sy = 0; sy < 8; sy++) {
            for (let dx = 0; dx < 8; dx++) {
                for (let dy = 0; dy < 8; dy++) {
                    let from = {
                        x: sx,
                        y: sy
                    };
                    let to = {
                        x: dx,
                        y: dy
                    };
                    
                    if (canMove(from, to)) {
                        possibleMoves++;
                        info[sx][sy] = 1;
                    }
                }
            }
        }
    }
}

/**
 * @description Отмечает куда можно ходить 
 */
function markMovesTo() {
    initInfo();

    for (let sx = 0; sx < 8; sx++) {
        for (let sy = 0; sy < 8; sy++) {
            let to = {
                x: sx,
                y: sy
            };

            if (canMove(movingFrom, to)) {
                info[sx][sy] = 2;
            }
        }
    }
}

/**
 * 
 * @param {Object} from 
 * @param {Object} to 
 */
function canMove(from, to) {
    if (!canMoveFrom(from.x, from.y)) {
        return false;
    } else if (!canMoveTo(to.x, to.y)) {
        return false;
    } else if (!isCorrectMove(from, to)) {
        return false;
    } else if (!isCheckAfterMove(from, to)) {    // Проверка шаха
        return true;
    } else {
        return false;
    }
}

/**
 * Проверяет шах
 * @param {Object} from Координаты выбранной фигуры
 * @param {Object} to Координаты назначения фигуры
 * @returns {Boolean} Наличие шаха
 */
function isCheckAfterMove(from, to) {
    moveFigure(from, to);   // Сделал ход
    changeMove();   // Меняем ход для перебора чёрых ходов
    
    let check = isCheck();
    
    changeMove();   // Возвращаем обратно действительный ход
    returnFigure(from, to); // После всего возвращаем фигуру обратно
    
    return check;
}

/**
 * 
 */
function isCheck() {
    let king = findFigure(moveColor == 'white' ? 'k' : 'K'); // Находим короля

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            let enemyFigureCoord = {
                x: x, 
                y: y
            };

            if (getColor(x, y) == moveColor) {
                if (isCorrectMove(enemyFigureCoord, king)) {
                    return true;
                }
            }
        }    
    }

    return false;
}

/**
 * 
 */
function isCheckMate() {
    if (!isCheck()) {
        return false;
    } else {
        return possibleMoves == 0;
    }
}

/**
 * 
 */
function isStaleMate() {
    if (isCheck()) {
        return false;
    } else {
        return possibleMoves == 0;
    }
}

/**
 * 
 * @param {*} figure 
 */
function findFigure(figure) {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (map[x][y] == figure) {
                return {x: x, y: y};
            }
        }    
    }

    return {x: -1, y: -1};
}

/**
 * 
 * @param {Object} from 
 * @param {Object} to 
 */
function isCorrectMove(from, to) {
    let figure = map[from.x][from.y];

    if (isKing(figure)) {
        return isCorrectKingMove(from, to);
    } else if (isQueen(figure)) {
        return isCorrectQueenMove(from, to);
    } else if (isBishop(figure)) {
        return isCorrectBishopMove(from, to);
    } else if (isKnight(figure)) {
        return isCorrectKnightMove(from, to);
    } else if (isRook(figure)) {
        return isCorrectRookMove(from, to);
    } else if (isPawn(figure)) {
        return isCorrectPawnMove(from, to);
    } else {
        return false;
    }
}

/**
 * 
 * @param {String} figure 
 */
function isKing(figure) {
    return figure.toUpperCase() == 'K';
}

/**
 * 
 * @param {String} figure 
 */
function isQueen(figure) {
    return figure.toUpperCase() == 'Q';
}

/**
 * 
 * @param {String} figure 
 */
function isBishop(figure) {
    return figure.toUpperCase() == 'B';
}

/**
 * 
 * @param {*} figure 
 */
function isKnight(figure) {
    return figure.toUpperCase() == 'N';
}

/**
 * 
 * @param {*} figure 
 */
function isRook(figure) {
    return figure.toUpperCase() == 'R';
}

/**
 * 
 * @param {*} figure 
 */
function isPawn(figure) {
    return figure.toUpperCase() == 'P';
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 */
function isCorrectKingMove(from, to) {
    return Math.abs(to.x - from.x) <= 1 && Math.abs(to.y - from.y) <= 1;
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 */
function isCorrectQueenMove(from, to) {
    return isLineMove(from, to, 'Q');
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 */
function isCorrectBishopMove(from, to) {
    return isLineMove(from, to, 'B');
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 */
function isCorrectKnightMove(from, to) {
    if (Math.abs(to.x - from.x) == 1 && Math.abs(to.y - from.y) == 2) {
        return true;
    } else if (Math.abs(to.x - from.x) == 2 && Math.abs(to.y - from.y) == 1) {
        return true;
    } else {
        return false;
    }
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 */
function isCorrectRookMove(from, to) {
    return isLineMove(from, to, 'R');
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 */
function isCorrectPawnMove(from, to) {
    if (from.y < 1 || from.y > 6) {
        return false;
    } else if (getColor(from.x, from.y) == 'white') {
        return isSignPawnMove(from, to, 1);
    } else if (getColor(from.x, from.y) == 'black') {
        return isSignPawnMove(from, to, -1);
    } else {
        return false;
    }
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 * @param {*} sign 
 */
function isSignPawnMove(from, to, sign) {
    if (canPawnTakePass(from, to, sign)) {     // Взятие на проходе
        return true;
    } else if (!isEmpty(to.x, to.y)) {  // Не ходим за переделами доски ли?
        if (Math.abs(to.x - from.x) != 1) { // 1 шаг влево / вправо
            return false;
        } else {    // Пешка ходит на одну клетку?
            return (to.y - from.y) == sign;
        }
    } else if (to.x != from.x) {    // Ходим ли мы только прямо вперёд?
        return false;
    } else if (to.y - from.y == sign) {    // Ходим ли мы только на одну клетку?
        return true;
    } else if (to.y - from.y != 2 * sign) {    // Ходим ли на 2 клетки? (можно перепрыгивать)
        return false;
    } else if (from.y != 1 && from.y != 6) {   // Перепрыгиваем только когда на начальной позиции
        return false;
    } else {
        return true;
    }
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 * @param {*} sign 
 */
function canPawnTakePass(from, to, sign) {
    if (!(to.x == pawnAttack.x && to.y == pawnAttack.y)) {
        return false;
    } else if (sign == 1 && from.y != 4) {
        return false;
    } else if (sign == -1 && from.y != 3) {
        return false;
    } else {
        return (Math.abs(to.x - from.x) == 1);
    }
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 * @param {*} figure 
 */
function isLineMove(from, to, figure) {
    let deltaX = Math.sign(to.x - from.x);
    let deltaY = Math.sign(to.y - from.y);
    let move = {
        x: from.x,
        y: from.y
    };

    if (!isCorrectDelta(deltaX, deltaY, figure)) {
        return false;
    }

    do {
        move.x += deltaX;
        move.y += deltaY;
        
        if (move.x == to.x && move.y == to.y) {
            return true;
        }

    } while (isEmpty(move.x, move.y));

    return false;
}

/**
 * 
 * @param {*} deltaX 
 * @param {*} deltaY 
 * @param {*} figure 
 */
function isCorrectDelta(deltaX, deltaY, figure) {
    if (isQueen(figure)) {
        return isQueenDelta(deltaX, deltaY);
    } else if (isBishop(figure)) {
        return isBishopDelta(deltaX, deltaY);
    } else if (isRook(figure)) {
        return isRookDelta(deltaX, deltaY);
    } else {
        return false;
    }
}

/**
 * 
 * @param {*} deltaX 
 * @param {*} deltaY 
 */
function isQueenDelta(deltaX, deltaY) {
    return true;
}

/**
 * 
 * @param {*} deltaX 
 * @param {*} deltaY 
 */
function isBishopDelta(deltaX, deltaY) {
    return Math.abs(deltaX) + Math.abs(deltaY) == 2;
}

/**
 * 
 * @param {*} deltaX 
 * @param {*} deltaY 
 */
function isRookDelta(deltaX, deltaY) {
    return Math.abs(deltaX) + Math.abs(deltaY) == 1;
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function isEmpty(x, y) {
    if (!isOnMap(x, y)) {
        return false;
    } else {
        return map[x][y] == ' ';
    }
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function isOnMap(x, y) {
    return (x >= 0 && x < 8) && (y >= 0 && y < 8);
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function canMoveFrom(x, y) {
    if (!isOnMap(x, y)) {
        return false;
    } else {
        return getColor(x, y) == moveColor;
    }
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function canMoveTo(x, y) {
    if (!isOnMap(x, y)) {
        return false;
    }

    if (map[x][y] == ' ') {
        return true;
    }

    return getColor(x, y) != moveColor;
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function getColor(x, y) {
    if (map[x][y] == ' ') {
        return '';
    }

    return (map[x][y].toUpperCase() == map[x][y]) ? 'white' : 'black';
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function clickCell(x, y) {
    if (info[x][y] == 1) {
        clickCellFrom(x, y);
    } else if (info[x][y] == 2) {
        clickCellTo(x, y);
    }
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function clickCellFrom(x, y) {
    movingFrom.x = x;
    movingFrom.y = y;
    markMovesTo();
    update();
}

/**
 * 
 */
function clickCellTo(toX, toY) {
    let to = {
        x: toX,
        y: toY
    };

    moveFigure(movingFrom, to);
    promotePawn(fromFigure, to);
    checkPawnAttack(fromFigure, toX, toY);
    changeMove();
    markMovesFrom();
    update();
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 */
function moveFigure(from, to) {
    fromFigure = map[from.x][from.y];
    toFigure = map[to.x][to.y];
    map[to.x][to.y] = fromFigure;
    map[from.x][from.y] = ' ';
    movePawnAttack(fromFigure, to.x, to.y);
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 */
function returnFigure(from, to) {
    map[from.x][from.y] = fromFigure;
    map[to.x][to.y] = toFigure;
    returnPawnAttack(fromFigure, to.x, to.y);
}

/**
 * 
 * @param {*} fromFigure 
 * @param {*} to 
 */
function promotePawn(fromFigure, to) {
    if (!isPawn(fromFigure)) {
        return;
    } else if (!(to.y == 7 || to.y == 0)) {
        return;
    } else {
        let figure = ' ';
        try {
            do {
                figure = prompt('Апгрейд!!! Новая фигура: Q B N R', 'Q');
            } while (!(isQueen(figure) 
                    || isBishop(figure) 
                    || isKnight(figure) 
                    || isRook(figure)));    
        } catch (error) {
            figure = 'Q';
        }

        if (moveColor == 'white') {
            map[to.x][to.y] = figure.toUpperCase() 
        } else {
            map[to.x][to.y] = figure.toLowerCase();
        }
    }
}

/**
 * 
 * @param {*} fromFigure 
 * @param {*} toX 
 * @param {*} toY 
 */
function movePawnAttack(fromFigure, toX, toY) {
    if (isPawn(fromFigure)) {
        if (toX == pawnAttack.x && toY == pawnAttack.y) {
            let y = moveColor == 'white' ? toY - 1 : toY + 1;
            savedPawn.figure = map[toX][y];
            savedPawn.x = toX;
            savedPawn.y = y;
            map[toX][y] = ' ';
        }
    }
}

/**
 * 
 */
function returnPawnAttack() {
    if (savedPawn.figure == ' ') {
        return;
    } else {
        map[savedPawn.x][savedPawn.y] = savedPawn.figure;
    }
}

/**
 * 
 * @param {*} fromFigure 
 * @param {*} toX 
 * @param {*} toY 
 */
function checkPawnAttack(fromFigure, toX, toY) {
    pawnAttack.x = -1;
    pawnAttack.y = -1;
    savedPawn.figure = ' ';
    savedPawn.x = -1;
    savedPawn.y = -1;

    if (isPawn(fromFigure)) {
        if (Math.abs(toY - movingFrom.y)) {
            pawnAttack.x = movingFrom.x;
            pawnAttack.y = (movingFrom.y + toY) / 2;
        }
    }
}

/**
 * 
 */
function changeMove() {
    moveColor = moveColor == 'white' ? 'black' : 'white';
}

/**
 * 
 * @param {*} figure 
 * @param {*} render 
 */
function displayFigure(figure, render) {
    render = render || 'text';

    if (render == 'img') {
        let src = '';
        let html = '';
        let img = document.createElement('img');

        src = getImgSrc(figure);
        img.src = src;
        
        if (src == 'undefined') {
            html += '</td>';
        } else {
            html += '<img src="' + img.src + '"></td>';
        }

        return html;
    } else {
        switch (figure) {
            case 'K': return '&#9812';
            case 'k': return '&#9818';
        
            case 'Q': return '&#9813';
            case 'q': return '&#9819';
        
            case 'B': return '&#9815';
            case 'b': return '&#9821';
        
            case 'N': return '&#9816';
            case 'n': return '&#9822';
        
            case 'R': return '&#9814';
            case 'r': return '&#9820';
        
            case 'P': return '&#9817';
            case 'p': return '&#9823';
        
            default: return figure;
        }
    }
}

/**
 * 
 * @param {*} figure 
 */
function getImgSrc(figure) {
    switch (figure) {
        case 'K': return imgSrc.wk;
        case 'k': return imgSrc.bk;
    
        case 'Q': return imgSrc.wq;
        case 'q': return imgSrc.bq;
    
        case 'B': return imgSrc.wb;
        case 'b': return imgSrc.bb;
    
        case 'N': return imgSrc.wn;
        case 'n': return imgSrc.bn;
    
        case 'R': return imgSrc.wr;
        case 'r': return imgSrc.br;
    
        case 'P': return imgSrc.wp;
        case 'p': return imgSrc.bp;
    
        default: return 'undefined';
    }
}

/**
 * 
 */
function update() {
    let topPanel = createAlphaPanel();
    let bottomPanel = createAlphaPanel();
    let leftPanel = createNumericPanel();
    let rightPanel = createNumericPanel();
    let mid = document.createElement('div');
    let board = document.getElementById('board');
    let gameField = document.createElement('table');
    let html = '';

    board.innerHTML = '';
    gameField.className = 'game-field';

    for (let y = 7; y >= 0; y--) {
        html += '<tr>';

        for (let x = 0; x < 8; x++) {
            let color = undefined;

            if (info[x][y] == ' ') {
                color = (x + y) % 2 ? 'light-orange' : 'dark-orange';
            } else {
                color = info[x][y] == '1' ? 'light-green' : 'light-pink selected';
            }

            html += '<td class="cell ' + color + 
                    '" onclick="clickCell(' + x + ', ' + y + ');">';
            html += displayFigure(map[x][y], renderer) + '</td>';
        }

        html += '</tr>';
    }

    gameField.innerHTML = html;
    mid.appendChild(leftPanel);
    mid.appendChild(gameField);
    mid.appendChild(rightPanel);
    board.appendChild(topPanel);
    board.appendChild(mid);
    board.appendChild(bottomPanel);
    showInfo();
}
    
/**
 * @description Создаёт алфавитную панель от А до Н
 * @returns {Object} Блок с алфавитными элементами
 */
function createAlphaPanel() {
    let alphaPanel = document.createElement('div');
    alphaPanel.style.marginLeft = '21.6px';
    const startIndex = 'A'.charCodeAt();
    
    for (let i = startIndex; i < startIndex + 8; i++) {
        const alpha = String.fromCharCode(i);
        let cell = document.createElement('div');
        cell.className = 'alphabetLetter';
        cell.textContent = alpha;
        alphaPanel.appendChild(cell);
    }

    return alphaPanel;
}

/**
 * @description Создаёт числовую панель от 1 до 8
 * @returns {Object} Блок с числовыми элементами
 */
function createNumericPanel() {
    let numericPanel = document.createElement('div');
    numericPanel.style.width = '21.6px';
    numericPanel.style.cssFloat = 'left';
    
    for (let i = 8; i >= 1; i--) {
        let cell = document.createElement('div');
        cell.className = 'numericLetter';
        cell.textContent = i;
        numericPanel.appendChild(cell);
    }

    return numericPanel;
}

/**
 * Вывод информации о игре
 * @returns {void}
 */
function showInfo() {
    let html = 'Ход: ' + ((moveColor == 'white') ? 'Белый' : 'Чёрный');
    html += '<br>';
    changeMove();
    
    if (isCheckMate()) {
        html += 'Шах и мат &#9786;! ';
        html += 'Победитель: ' + (moveColor == 'black' ? 'Чёрный! ' : 'Белый! ');
        html += 'Можно выпить &#9749;'
    } else if (isStaleMate()) {
        html += 'Пат! Ничья!';
    } else if (isCheck()) {
        html += 'Шах!!!'
    }
    
    changeMove();
    document.getElementById('info').innerHTML = html;
}

/**
 * Старт игры
 */
function start() {
    initMap();
    markMovesFrom();
    update();
}

start();