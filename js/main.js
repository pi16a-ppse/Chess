let game = {
    init: function () {
        let gameBoard = document.querySelector('.board');
        let cell;
        let flag = true;
        
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                cell = document.createElement('div');
                cell.className = flag ? 'cell white' : 'cell dark';
                flag = !flag;
                gameBoard.appendChild(cell);
            }
            flag = !flag;
        }
    }
}

game.init();