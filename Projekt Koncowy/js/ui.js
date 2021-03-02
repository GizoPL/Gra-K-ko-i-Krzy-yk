//elements and listeners 
element = (id) => document.getElementById(id);

element('player1-name').addEventListener('change', () => onNameChanged(true));
let p2 = element('player2-name');
p2.addEventListener('change', () => onNameChanged(false));
let [p1Score, p2Score] = [element('player1-score'), element('player2-score')];
let [result, currentTurn] = [element('result'), element('current')];

let board = element('board');
let resetPopUp = element('reset-popup');
element('dismiss-btn').addEventListener('click', () => resetPopUp.style.display = 'none');
element('newgame-btn').addEventListener('click', resetBoard);

let helpPop = element('help-popup');
element('instructions').addEventListener('click', () => helpPop.style.display = 'block');
element('dismiss-help').addEventListener('click', () => helpPop.style.display = 'none');

element('reset').addEventListener('click', resetGame);

let [p1Name, p2Name] = ['P1', 'P2'];
// let p2Old = p2Name;


let clickSound = new Audio('../sound/ttt_click.mp3');
let victorySound = new Audio('../sound/victory.mp3');

function onSquareClicked(id) {
  clickSound.play();
  let outcome = GameModel.processMove(id);
  let [player, row, col] = GameModel.moves.slice(-1)[0];
  let el = getDiv(id);

  if (outcome === StatusCodes.VALID) {
    makeMove(player, el);
  } else if (outcome === StatusCodes.COMPLETE) {
    resetPopUp.style.display = 'block';
  } else if (outcome !== StatusCodes.INVALID) {
    makeFinishingMove(player, el, outcome);
  }
}

function makeMove(player, el) {
  el.classList.remove('free');
  player ? el.classList.add('p-one') : el.classList.add('p-two');
  player ? currentTurn.innerText = p2Name : currentTurn.innerText = p1Name;
}

function makeFinishingMove(player, el, outcome) {
  let squares = document.querySelectorAll('section > div');
  squares.forEach(x => x.classList.remove('free'));
  player ? el.classList.add('p-one') : el.classList.add('p-two');
  result.style.display = 'none';
  if (outcome === true || outcome === false) {
    outcome ? currentTurn.innerText = `${p1Name} wins!` : currentTurn.innerText = `${p2Name} wins!`;
    updateScore(...GameModel.score);
    victorySound.play();
    animateWin()
  } else {
    currentTurn.innerText = 'Draw!'
  }
}

function onNameChanged(name) {
  let val = event.target.value;
  if ((name && GameModel.player) || (!name && !GameModel.player)) { 
    currentTurn.innerText = val;
  }
  name ? p1Name = val : p2Name = val;
  p2Old = p2Name;
}


getDiv = (id) => element(`sq${id}`);

updateScore = (s1, s2) => [p1Score.innerText, p2Score.innerText] = [s1, s2];

animateWin = () => GameModel.boardID[GameModel.winAxis].forEach(id => getDiv(id).classList.add('highlight'));

function updateBoard(side = GameModel.board.length) {
  GameModel.reset(side);
  board.style.cssText = `grid-template: repeat(${side}, 1fr) /repeat(${side}, 1fr)`;
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  let frag = document.createDocumentFragment();
  for (let i = 0; i < side * side; i++) {
    let el = document.createElement('div');
    el.className = 'free';
    el.id = `sq${i}`;
    el.addEventListener('click', () => onSquareClicked(i));
    frag.appendChild(el);
  }
  board.appendChild(frag);
}

function resetGame() {
  GameModel.resetGame()
  updateBoard();
  updateScore(...GameModel.score);
  this.resetStyles();
}

function resetBoard() {
  updateBoard();
  resetStyles();
}

function resetStyles(){
  result.style.display = 'block';
  resetPopUp.style.display = 'none';
  current.innerText = p1Name;
}

updateBoard(10);
