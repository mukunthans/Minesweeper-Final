// Display/UI

import { TILE_STATUSES,createBoard ,markTile ,revealTile ,checkWin,checkLose} from "./minesweeper.js";

let boardSize = 7;
let numberOfMines = 10;  
let timerId;

const resetButton = document.querySelector(".reset");
const emoji = document.querySelector(".emoji");
const messageText = document.querySelector(".subtext");
const boardElement = document.querySelector(".board");
const easyBtn = document.querySelector(".easy");
const medBtn = document.querySelector(".medium");
const hardBtn = document.querySelector(".hard");
const timer = document.querySelector(".timer");

//event Listeners


easyBtn.addEventListener('click',easyStart);
medBtn.addEventListener('click',mediumStart);
hardBtn.addEventListener('click',hardStart);
resetButton.addEventListener("click",easyStart);


function easyStart(){
    resetValues();
    boardSize=7;
    numberOfMines=10;

    newGame(boardSize,numberOfMines,301);

}
function mediumStart(){
    resetValues();
    boardSize=10;
    numberOfMines=30;


    newGame(boardSize,numberOfMines,601);

}
function hardStart(){
    resetValues();
    boardSize=15;
    numberOfMines=75;


    newGame(boardSize,numberOfMines,1201);

}










function newGame(BOARD_SIZE,NUMBER_OF_MINES,time){


    
   const board = createBoard(BOARD_SIZE,NUMBER_OF_MINES);
   messageText.textContent = "Mines Left : ";
   const span = document.createElement("span");

   messageText.appendChild(span);

   span.textContent = NUMBER_OF_MINES;
   boardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, ${100 / BOARD_SIZE}%)`;
   boardElement.style.gridTemplateRows = `repeat(${BOARD_SIZE}, ${100 / BOARD_SIZE}%)`;




    board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
          tile.element.addEventListener('click',() => {

            revealTile(board,tile);
            checkGameEnd();


           })
          tile.element.addEventListener('contextmenu', (e) => {
             e.preventDefault();
             if(listMinesLeft()>0 || tile.status===TILE_STATUSES.MARKED)
             markTile(tile);
             listMinesLeft();

            })
        })
    })

    startTimer(time);

  function listMinesLeft(){
    const markedTilesCount = board.reduce((count,row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length;
    },0);

    span.textContent = NUMBER_OF_MINES - markedTilesCount;

    return NUMBER_OF_MINES - markedTilesCount;

  }


  function checkGameEnd(){
    const win = checkWin(board);
    const lose  = checkLose(board);

    if(win || lose){
        boardElement.addEventListener('click',stopProp,{capture:true});
        boardElement.addEventListener('contextmenu',stopProp,{capture:true});
    }

    if(win){
        messageText.textContent = "You Win";
        emoji.textContent = "😎";
        clearInterval(timerId); 
    }
    if(lose){
        messageText.textContent = "You Lost";
        emoji.textContent = "😭"
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status === TILE_STATUSES.MARKED) markTile(tile);
                if(tile.mine) revealTile(board,tile);
            })
        })
        clearInterval(timerId); 
    }
     
  }

//Timer methods


    function startTimer(seconds)
    {
    if(seconds===0) return;

    timerId = setInterval(() => {
        seconds--;
        updateTimeUI(seconds);
        if(seconds===0)
        {
            endGame();
        }

    },1000);

    }

    function updateTimeUI(seconds)
    {
    const minutes = Math.floor(seconds/60).toString().padStart(2,"0");
    const sec = Math.floor(seconds%60).toString().padStart(2,"0");

    timer.textContent = `${minutes}:${sec}`;

    }

    function endGame(){
        boardElement.addEventListener('click',stopProp,{capture:true});
        boardElement.addEventListener('contextmenu',stopProp,{capture:true});
        

        clearInterval(timerId); 

        messageText.textContent = "Time Up ,You Lost ";
        emoji.textContent = "😭"
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status === TILE_STATUSES.MARKED) markTile(tile);
                if(tile.mine) revealTile(board,tile);
            })
        })

    }





}

function stopProp(e) {
    e.stopImmediatePropagation();
}



function resetValues(){

    boardElement.innerHTML="";

    messageText.innerHTML="";

    emoji.textContent = "😄";
    timer.textContent = "00:00";

    boardElement.removeEventListener('click',stopProp,true);
    boardElement.removeEventListener('contextmenu',stopProp,true);
    clearInterval(timerId);



}


