const color = {
    none: 'none',
    white: 'white',
    black: 'black'
}

const figure = {
    none: 'none',
    whiteKing: 'K',
    whiteQueen: 'Q',
    whiteRook: 'R',
    whiteBishop: 'B',
    whiteKnight: 'N',
    whitePawn: 'P',
    blackKing: 'k',
    blackQueen: 'q',
    blackRook: 'r',
    blackBishop: 'b',
    blackKnight: 'n',
    blackPawn: 'p'
}

/**
 * @description Меняет ход игрока
 * @param {string} moveColor Текущий ход
 */
function flipColor(moveColor) {
    if (moveColor == color.white) return color.black;
    if (moveColor == color.black) return color.white;
    return color.none;
}

/**
 * Преобразование всех позиций на доске в строку FEN
 * @param {Array} boardFigures Массив 8х8 с фигурами
 */
function toFEN(boardFigures) {
    let fen = '';

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++)
            fen += boardFigures[x, y] == figure.none ? '1' : BoardFigures[x, y];
        if (x != 7) fen += '/';
    }

    for (let i = 8; i >= 2; i--)
        fen.replace('11111111'.substr(0, i), i.toString());

    return fen;
}

/**
 * @class Ячейка в шахматной доске
 */
class Square {
    /**
     * @property Позиция ячейки 1 <= x <= 8
     */
    x = undefined;

    /**
     * @property Позиция ячейки a <= x <= h
     */
    y = undefined;

    /**
     * @property Шахматная позиция ячейки
     */
    name = String.fromCharCode('a'.charCodeAt() + y) + (8 - x);

    constructor() {
        this.x = -1;
        this.y = -1;
    }

    /**
     * @description Устанавливает ячейку в позиции e2
     * @param {string} e2 Шахматная позиция ячейки (например a5, f1 и т. д.)
     */
    setChessPostion(e2) {
        if (e2.length == 2 
            && e2[0] >= 'a' && e2[0] <= 'h' 
            && e2[1] >= '1' && e2[1] <= '8') {
            this.x = '8'.charCodeAt() - e2[1].charCodeAt();
            this.y = e2[0] - 'a'.charCodeAt();
        } else this = new Square();
    }

    /**
     * @description Устанавливает позицию ячейки по x и y
     * @param {number} x Позиция ячейки по x
     * @param {number} y Позиция ячейки по y
     */
    setXYPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @description Проверяет находятся ли данные ячейки на одном и том же месте
     * @param {square} from Выбранная ячейка
     * @param {square} to Ячейка назначения
     */
    isSameSquare(from, to) {
        return from.x == to.x && from.y == to.y;
    }

    /**
     * Проверяет находится ли данная ячейка на доске
     */
    isOnBoard() {
        return (this.x >= 0 && this.x < 8) && (this.y >= 0 && this.y < 8);
    }
}

class Board {
    figures = undefined;

    fen = undefined;
    
    moveColor = undefined;

    moveNumber = undefined;

    constructor(fen) {
        this.fen = fen;
        
    }
}

let game = {
    init: function () {
        this.createBoard();
    },

    createBoard: function () {
        let gameBoard = document.querySelector('.board');
        let gameField = document.createElement('div');
        let cell = document.createElement('div');
        let topPanel = this.createAlphaPanel();
        let bottomPanel = this.createAlphaPanel();
        let leftPanel = this.createNumericPanel();
        let rightPanel = this.createNumericPanel();
        let flag = true;

        // Прорисовка ячейки шахматной доски, левой и правой границы в div
        gameField.className = 'game-field';

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                cell = document.createElement('div');
                cell.className = flag ? 'cell light-orange' 
                                      : 'cell dark-orange';
                flag = !flag;
                gameField.appendChild(cell);
            }
            flag = !flag;
        }
        
        let mid = document.createElement('div');
        mid.appendChild(leftPanel);
        mid.appendChild(gameField);
        mid.appendChild(rightPanel);
        gameBoard.appendChild(topPanel);
        gameBoard.appendChild(mid);
        gameBoard.appendChild(bottomPanel);
    },
    
    /**
     * @description Создаёт алфавитную панель от А до Н
     * @returns Блок с алфавитными элементами
     */
    createAlphaPanel: function() {
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
    },

    /**
     * @description Создаёт числовую панель от 1 до 8
     * @returns Блок с числовыми элементами
     */
    createNumericPanel: function() {
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
}

game.init();