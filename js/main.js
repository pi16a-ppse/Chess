/**
 * @type {Object} Массив, хранящий расположения картинки фигур
 */
const imgSrc = {
    /**
     * @property Белый король
     */
    wk: 'img/wk.png',
    /**
     * @property Белая ферзь
     */
    wq: 'img/wq.png',
    /**
     * @property Белая ладья
     */
    wr: 'img/wr.png',
    /**
     * @property Белый слон
     */
    wb: 'img/wb.png',
    /**
     * @property Белый конь
     */
    wn: 'img/wn.png',
    /**
     * @property Белая пешка
     */
    wp: 'img/wp.png',
    
    /**
     * @property Чёрный король
     */
    bk: 'img/bk.png',
    /**
     * @property Чёрная ферзь
     */
    bq: 'img/bq.png',
    /**
     * @property Чёрная ладья
     */
    br: 'img/br.png',
    /**
     * @property Чёрный слон
     */
    bb: 'img/bb.png',
    /**
     * @property Чёрный конь
     */
    bn: 'img/bn.png',
    /**
     * @property Чёрная пешка
     */
    bp: 'img/bp.png',
}

/**
 * @type {Object} Состояние отрисовки шахматных фигур
 */
const renderState = {
    /**
     * @property Состояние отображения при помощи спец символов
     */
    text: 'text',
    /**
     * @property Состояние отображения при помощи картин
     */
    img: 'img'
}

/**
 * @type {Array} Массив доски
 */
let map = new Array();

/**
 * @type {Array} Массив возможных ходов фигуры
 */
let info = new Array();

/**
 * @type {Object} Координаты выбранной фигуры
 */
let fromFigure;

/**
 * @type {object} Координаты назначения фигуры
 */
let toFigure;

/**
 * @type {Number} Количество фозможных ходов
 */
let possibleMoves;

/**
 * @type {Object} Информация о сохранённой пешке
 */
let savedPawn = {
    /**
     * @property Старая фигура
     */
    figure: ' ',
    /**
     * @property Координата по x
     */
    x: -1,
    /**
     * @property Координата по y
     */
    y: -1
};

/**
 * @type {Object} Координаты предыдущей ячейки
 */
let movingFrom = {
    /**
     * @property Координата по x
     */
    x: 0,
    /**
     * @property Координата по y
     */
    y: 0
};

/**
 * @type {Object} Координаты битой пешки
 */
let pawnAttack = {
    /**
     * @property Координата по x
     */
    x: -1,
    /**
     * @property Координата по y
     */
    y: -1
};

/**
 * @type {String} Определяет каким методом отображать фигуры (text, img)
 */
const renderer = renderState.img;

/**
 * @type {String} Определяет ход белых или чёрных фигур
 */
let moveColor = 'white';

/**
 * Обработчик события рестарт игры
 * @returns {void}
 */
$('#restart').click(function (e) { 
    e.preventDefault();
    if (confirm('Вы уверены что хотите начать заново?')) {
        moveColor = 'white';
        start();
    }
});

/**
 * Инициализирует доску с фигурами
 * @returns {void}
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
 * Обновляет карту возможных ходов фигуры
 * @returns {void}
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
 * @returns {void} 
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
 * @returns {void}
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
 * Проверка может ли данная фигура на данной ячейке ходить
 * @param {Object} from Координаты выбранной ячейки
 * @param {Object} to Координаты назначения ячейки
 * @returns {Boolean}
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
 * Проверяет шах после хода
 * @param {Object} from Координаты выбранной ячейки
 * @param {Object} to Координаты назначения ячейки
 * @returns {Boolean}
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
 * Проверяет шах
 * @returns {Boolean}
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
 * Проверяет мат
 * @returns {Boolean}
 */
function isCheckMate() {
    if (!isCheck()) {
        return false;
    } else {
        return possibleMoves == 0;
    }
}

/**
 * Проверяет пат
 * @returns {Boolean}
 */
function isStaleMate() {
    if (isCheck()) {
        return false;
    } else {
        return possibleMoves == 0;
    }
}

/**
 * Находит координаты данной фигуры
 * @param {String} figure Выбранная фигура
 * @returns {Object}
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
 * Проверяет корректность хода
 * @param {Object} from Координаты начальной ячейки
 * @param {Object} to Координаты конечной ячейки
 * @returns {Boolean}
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
 * Проверяет является ли эта фигура королём
 * @param {String} figure Выбранная фигура
 * @returns {Boolean}
 */
function isKing(figure) {
    return figure.toUpperCase() == 'K';
}

/**
 * Проверяет является ли эта фигура ферзёй
 * @param {String} figure Выбранная фигура
 * @returns {Boolean}
 */
function isQueen(figure) {
    return figure.toUpperCase() == 'Q';
}

/**
 * Проверяет является ли эта фигура слоном
 * @param {String} figure Выбранная фигура
 * @returns {Boolean}
 */
function isBishop(figure) {
    return figure.toUpperCase() == 'B';
}

/**
 * Проверяет является ли эта фигура конём
 * @param {String} figure Выбранная фигура
 * @returns {Boolean}
 */
function isKnight(figure) {
    return figure.toUpperCase() == 'N';
}

/**
 * Проверяет является ли эта фигура ладьёй
 * @param {String} figure Выбранная фигура
 * @returns {Boolean}
 */
function isRook(figure) {
    return figure.toUpperCase() == 'R';
}

/**
 * Проверяет является ли эта фигура пешкой
 * @param {String} figure Выбранная фигура
 * @returns {Boolean}
 */
function isPawn(figure) {
    return figure.toUpperCase() == 'P';
}

/**
 * Проверяет ход короля
 * @param {Object} from Координаты начальной ячейки
 * @param {Object} to Координаты конечной ячейки
 * @returns {Boolean}
 */
function isCorrectKingMove(from, to) {
    return Math.abs(to.x - from.x) <= 1 && Math.abs(to.y - from.y) <= 1;
}

/**
 * Проверяет ход ферзя
 * @param {Object} from Координаты начальной ячейки
 * @param {Object} to Координаты конечной ячейки
 * @returns {Boolean}
 */
function isCorrectQueenMove(from, to) {
    return isLineMove(from, to, 'Q');
}

/**
 * Проверяет ход слона
 * @param {Object} from Координаты начальной ячейки
 * @param {Object} to Координаты конечной ячейки
 * @returns {Boolean}
 */
function isCorrectBishopMove(from, to) {
    return isLineMove(from, to, 'B');
}

/**
 * Проверяет ход коня
 * @param {Object} from Координаты начальной ячейки
 * @param {Object} to Координаты конечной ячейки
 * @returns {Boolean}
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
 * Проверяет ход ладьи
 * @param {Object} from Координаты начальной ячейки
 * @param {Object} to Координаты конечной ячейки
 * @returns {Boolean}
 */
function isCorrectRookMove(from, to) {
    return isLineMove(from, to, 'R');
}

/**
 * Проверяет ход пешки
 * @param {Object} from Координаты начальной ячейки
 * @param {Object} to Координаты конечной ячейки
 * @returns {Boolean}
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
 * Проверяет ход пешки с учётом цвета
 * @param {Object} from Координаты начальной ячейки
 * @param {Object} to Координаты конечной ячейки
 * @param {*} sign 
 * @returns {Boolean}
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
 * Проверяет ход пешки взятие на проходе
 * @param {Object} from Координаты начальной ячейки
 * @param {Object} to Координаты конечной ячейки
 * @param {Number} sign 
 * @returns {Boolean}
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
 * Проверяет ходов, которые идут по прямой (queen, bishop, rook)
 * @param {Object} from Координаты начальной ячейки
 * @param {Object} to Координаты конечной ячейки
 * @param {String} figure Выбранная фигура
 * @returns {Boolean}
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
 * Проверяет ход фигуры (ферзь, слон, ладья)
 * @param {Number} deltaX Разница между координатами начала и конца x
 * @param {Number} deltaY Разница между координатами начала и конца x
 * @param {String} figure Выбранная фигура
 * @returns {Boolean}
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
 * Проверяет направление хода ферзя
 * @param {Number} deltaX Разница между координатами начала и конца x
 * @param {Number} deltaY Разница между координатами начала и конца y
 * @returns {Boolean}
 */
function isQueenDelta(deltaX, deltaY) {
    return true;
}

/**
 * Проверяет направление хода слона
 * @param {Number} deltaX Разница между координатами начала и конца x
 * @param {Number} deltaY Разница между координатами начала и конца y
 * @returns {Boolean}
 */
function isBishopDelta(deltaX, deltaY) {
    return Math.abs(deltaX) + Math.abs(deltaY) == 2;
}

/**
 * Проверяет направление хода ладьи
 * @param {Number} deltaX Разница между координатами начала и конца x
 * @param {Number} deltaY Разница между координатами начала и конца y
 * @returns {Boolean}
 */
function isRookDelta(deltaX, deltaY) {
    return Math.abs(deltaX) + Math.abs(deltaY) == 1;
}

/**
 * Проверяет не пустая ли ячейка
 * @param {Number} x Координата x ячейки
 * @param {Number} y Координата y ячейки
 * @returns {Boolean}
 */
function isEmpty(x, y) {
    if (!isOnMap(x, y)) {
        return false;
    } else {
        return map[x][y] == ' ';
    }
}

/**
 * Проверяет выход границу доски
 * @param {Number} x Координата x ячейки
 * @param {Number} y Координата y ячейки
 * @returns {Boolean}
 */
function isOnMap(x, y) {
    return (x >= 0 && x < 8) && (y >= 0 && y < 8);
}

/**
 * Проверяет корректность координат выбранной ячейки в зависимости от цвета
 * @param {Number} x Координата x ячейки
 * @param {Number} y Координата y ячейки
 * @returns {Boolean}
 */
function canMoveFrom(x, y) {
    if (!isOnMap(x, y)) {
        return false;
    } else {
        return getColor(x, y) == moveColor;
    }
}

/**
 * Проверяет корректность координат выбранной ячейки в зависимости от цвета
 * @param {Number} x Координата x ячейки
 * @param {Number} y Координата y ячейки
 * @returns {Boolean}
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
 * Получает цвет фигуры
 * @param {Number} x Координата x ячейки
 * @param {Number} y Координата y ячейки
 * @returns {String}
 */
function getColor(x, y) {
    if (map[x][y] == ' ') {
        return '';
    }

    return (map[x][y].toUpperCase() == map[x][y]) ? 'white' : 'black';
}

/**
 * Обработчик события нажатие на ячейку
 * @param {Number} x Координата x ячейки
 * @param {Number} y Координата y ячейки
 * @returns {void}
 */
function clickCell(x, y) {
    if (info[x][y] == 1) {
        clickCellFrom(x, y);
    } else if (info[x][y] == 2) {
        clickCellTo(x, y);
    }
}

/**
 * Обработчик события нажатие на ячейку при выборе фигуры
 * @param {Number} x Координата x выбранной ячейки
 * @param {Number} y Координата y выбранной ячейки
 * @returns {void}
 */
function clickCellFrom(x, y) {
    movingFrom.x = x;
    movingFrom.y = y;
    markMovesTo();
    update();
}

/**
 * Обработчик события нажатие на ячейку назначения
 * @returns {void}
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
 * Передвигает выбранную фигуру
 * @param {Object} from Координаты выбранной фигуры
 * @param {Object} to Координаты ячейки назначения
 * @returns {void}
 */
function moveFigure(from, to) {
    fromFigure = map[from.x][from.y];
    toFigure = map[to.x][to.y];
    map[to.x][to.y] = fromFigure;
    map[from.x][from.y] = ' ';
    movePawnAttack(fromFigure, to.x, to.y);
}

/**
 * Возвращает пешку обратно
 * @param {Object} from Координаты выбранной фигуры
 * @param {Object} to Координаты ячейки назначения
 * @returns {void}
 */
function returnFigure(from, to) {
    map[from.x][from.y] = fromFigure;
    map[to.x][to.y] = toFigure;
    returnPawnAttack(fromFigure, to.x, to.y);
}

/**
 * Превращение пешки
 * @param {Object} fromFigure Координаты выбранной фигуры
 * @param {Object} to Координаты ячейки назначения
 * @returns {void}
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
 * Передвигает атакующую на проходе пешку
 * @param {Object} fromFigure Координаты выбранной фигуры
 * @param {Number} toX Координата ячейки назначения x
 * @param {Number} toY Координата ячейки назначения y
 * @returns {void}
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
 * Возвращает пешку при взятии на проходе
 * @returns {void}
 */
function returnPawnAttack() {
    if (savedPawn.figure == ' ') {
        return;
    } else {
        map[savedPawn.x][savedPawn.y] = savedPawn.figure;
    }
}

/**
 * Проверяет атаку пешки на проходе
 * @param {Object} fromFigure Координаты выбранной фигуры
 * @param {Number} toX Координата ячейки назначения x
 * @param {Number} toY Координата ячейки назначения y
 * @returns {void}
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
 * Меняет цвет хода
 * @returns {void}
 */
function changeMove() {
    moveColor = moveColor == 'white' ? 'black' : 'white';
}

/**
 * Возвращает отображение фигур
 * @param {String} figure Фигура
 * @param {String} render Состояние отображения фигур
 * @returns {String}
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
 * Возвращает расположение картинки для фигуры
 * @param {String} figure 
 * @returns {String}
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
 * Обновляет доску
 * @returns {void}
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
 * @returns {void}
 */
function start() {
    initMap();
    markMovesFrom();
    update();
}

start();