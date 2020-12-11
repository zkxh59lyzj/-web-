const orientations = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];//八个方向


class Game {
    constructor(rowSize, colSize, ratio) {
        this.rowSize = rowSize;
        this.colSize = colSize;
        this.ratio = ratio;
        let cells = [];
        this.seconds=0;

        for (let i = 0; i < this.rowSize; i++) {
            let row = [];
            for (let j = 0; j < this.colSize; j++) {
                row.push({
                    el: null,
                    value: null,
                    clear:false,
                    
                });
            }
            cells.push(row);
        }
        this.cells = cells;
    }
    shuffle() {
        let mines = [];
        for (let i = 0; i < this.rowSize; i++) {

            for (let j = 0; j < this.colSize; j++) {
                let cell = this.cells[i][j];
                if (Math.random() <= this.ratio) {
                    cell.value = -1;
                    mines.push([i, j]);
                } else {
                    cell.value = 0;
                }
            }
        }
        this.mines=mines;
        for (let [i0, j0] of mines) {
            for (let [rowoffset, coloffset] of orientations) {
                let i1 = i0 + rowoffset, j1 = j0 + coloffset;
                if (i1 < 0 || i1 >= this.rowSize || j1 < 0 || j1 >= this.colSize) {
                    continue;
                }
                let cell = this.cells[i1][j1];
                if (cell.value === -1) {
                    continue;
                }
                
                cell.value += 1;
            }

        }
    }
    getCellValue(row, col) {
        return this.cells[row][col].value;
    }
    getCellElement(row,col){
        return this.cells[row][col].el;
    }
    setCellElement(row,col,element){
        this.cells[row][col].el=element;

    }
    isCellClear(row,col){
        return this.cells[row][col].clear;
    }
    setCellClear(row,col){
        this.cells[row][col].clear=true;
    }

}




 function    renderTable(game) {

    let gameEl=document.querySelector('#game');
    gameEl.innerHTML='';

    let bannerEl=document.createElement('div');
    bannerEl.className='banner';
    gameEl.append(bannerEl);
    
    let secondsEl=document.createElement('div');
    secondsEl.className='seconds';
   
    bannerEl.append(secondsEl);

    game.timer=setInterval(()=>{
    game.seconds+=1;
    secondsEl.innerText=game.seconds;},1000);

    let boradEl=document.createElement('div');
    boradEl.className='game-borad';
    //let headerEl=document.createElement('div');没啥用了！！三句
     //headerEl.className='header';
    let tableEl=document.createElement('table');
     //boradEl.append(headerEl);
    boradEl.append(tableEl);
    gameEl.append(boradEl);

    // let tableEl = document.querySelector('.game-borad table');

    for (let i = 0; i < game.rowSize; i++) {
        let rowEl = document.createElement('tr');
        for (let j = 0; j < game.colSize; j++) {
            let tdEl = document.createElement('td');
            let cellEl = document.createElement('div');
            cellEl.className = 'cell';


            let value = game.getCellValue(i, j);

            if (value === -1) {                                                                                                                                                 
                cellEl.innerText = '*';
            } else if (value >= 1) {
                cellEl.innerText = value;
            }
            game.setCellElement(i, j, cellEl);

            cellEl.onclick = (e) => {
                handleClearAction(i,j,game,cellEl,tableEl);
            };
            tdEl.append(cellEl);
            rowEl.append(tdEl);
        }
        tableEl.append(rowEl);
    }
}
function checkwin(row,col,game,cellEl,tableEl){ 
    for (let [i0,j0] of game.mines) {
    for (let [rowoffset, coloffset] of orientations) {
        let i1 = i0 + rowoffset, j1 = j0 + coloffset;
        if (i1 < 0 || i1 >= game.rowSize || j1 < 0 || j1 >= game.colSize) {
            continue;
        }
        if(game.getCellValue(i1,j1)===-1){
            continue;
        }

        if (!game.isCellClear(i1,j1)){
            return false;

        }
        
    }

}
return true;
}


function handleExplodeAction(row,col,game,cellEl,tableEl){
    let value = game.getCellValue(row, col);
    cellEl.classList.add('exploded');
    tableEl.classList.add('exploded');
    let gameEl=document.querySelector('#game');
    let panelEl=document.createElement('div');
    panelEl.className='loser';
    gameEl.append(panelEl);
    panelEl.innerHTML=` <h3>很遗憾，游戏失败。总用时为：${game.seconds}秒</h3>`;
    

    clearInterval(game.timer)

}
function handleWin(row,col,game,cellEl,tableEl){
    let value = game.getCellValue(row, col);
    // cellEl.classList.add('exploded');
    // tableEl.classList.add('exploded');
    let gameEl=document.querySelector('#game');
    let panelEl=document.createElement('div');
    panelEl.className='winner';
    gameEl.append(panelEl);
    panelEl.innerHTML=` <h3>你太棒啦~游戏成功啦！总用时为：${game.seconds}秒</h3>`;
    

    clearInterval(game.timer)


}
function handleClearAction(row,col,game,cellEl,tableEl){
    let value = game.getCellValue(row, col);
    if (value === -1) {
    handleExplodeAction(row,col,game,cellEl,tableEl)
    return;
    }
    if (value === 0) {
    clearcells(row, col, game, {});

    } else {
        cellEl.classList.add('clear');
        game.setCellClear(row,col);
    }
    if (checkwin(row,col,game,cellEl,tableEl)){
        handleWin(row,col,game,cellEl,tableEl);
       
    }
}


function clearcells(row, col,game, cleared) {
    cleared[`${row},${col}`] = true;
    game.getCellElement(row,col).classList.add('clear');
    game.setCellClear(row,col);

    for (let [rowoffset, coloffset] of orientations) {
        let i1 = row + rowoffset, j1 = col + coloffset;
        if (i1 < 0 || i1 >= game.rowSize|| j1 < 0 || j1 >= game.colSize) {
            continue;
        }
        

        let value = game.getCellValue(i1, j1);
        if (value===-1) {
            continue;
        }
        if (value >= 1) {
            game.getCellElement(i1,j1).classList.add('clear');
            game.setCellClear(i1,j1);
            continue;
        }
        if (cleared[`${i1},${j1}`]) {
            continue;
        }

        clearcells(i1, j1, game, cleared);


    }


}
function renderWelcome(){
    let gameEl=document.querySelector('#game');
    gameEl.innerHTML=`
    <div class='welcome'>
    <button id='level0'>&nbsp&nbsp初级模式</button>
    <button id='middle'>&nbsp&nbsp中级模式</button>
    <button id='advance'>&nbsp&nbsp高级模式</button>
    </div>
    `;
    let buttonEl=gameEl.querySelector('button#level0');
    buttonEl.onclick=()=>{    
        let game = new Game(8, 6, 0.15);
    game.shuffle();
    renderTable(game);
 
    }
    buttonEl=gameEl.querySelector('button#advance');
    buttonEl.onclick=()=>{
    let game = new Game(16, 30, 0.15);
    game.shuffle();
    renderTable(game);
    }
    buttonEl=gameEl.querySelector('button#middle');
    buttonEl.onclick=()=>{
    let game = new Game(10, 15, 0.15);
    game.shuffle();
    renderTable(game);
    }
}

renderWelcome();