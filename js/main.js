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