let game = {
    init: function () {
        this.createBoard();
    },

    createBoard: function () {
        let gameBoard = document.querySelector('.board');
        let gameField = document.createElement('div');
        let cell = document.createElement('div');
        let topPanel = undefined;
        let bottomPanel = undefined;
        let leftPanel = undefined;
        let rightPanel = undefined;
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
    }
}

game.init();