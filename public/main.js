'use strict';

const uiElements = {
  statsParagraph: document.getElementById('statsPar'),
  buttons: document.querySelectorAll('.button'),
  canvas: document.getElementById('canvas'),
  speedParagraph: document.getElementById('speedPar'),
  speedSlider: document.getElementById('speedSlider'),
  tileSizeSelector: document.getElementById('tileSizeSelector')
};
uiElements.startButton = uiElements.buttons[0];
uiElements.pauseButton = uiElements.buttons[1];
uiElements.resetButton = uiElements.buttons[2];

const canvasContext = uiElements.canvas.getContext('2d');

const TILE_SIZES = {
  'small': 18,
  'medium': 30,
  'large': 50
};

const FIELD_SIZES = {
  'smallTiles': uiElements.canvas.width / TILE_SIZES['small'],
  'mediumTiles': uiElements.canvas.width / TILE_SIZES['medium'],
  'largeTiles': uiElements.canvas.width / TILE_SIZES['large'],
};

class Tile {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.isAlive = false;
    this.isBeingBorn = false;
    this.isAboutToDie = false;
  }
}

const createGameField = (fieldLength) => {
  const gameField = [];
  for (let i = 0; i < fieldLength; i++) {
    const gameFieldRow = [];
    for (let j = 0; j < fieldLength; j++) {
      gameFieldRow.push(new Tile(j, i));
    }
    gameField.push(gameFieldRow);
  }
  return gameField;
};

const getNeighborsCoords = (tile, fieldLength) => {
  const coordsX = [];
  const coordsY = [];
  const neighborsCoords = [];
  const NEIGHBORS_NUMBER = 8;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      const currentNeighborX = tile.posX + j;
      const currentNeighborY = tile.posY + i;

      if (!(currentNeighborX === -1) && !(currentNeighborX === fieldLength)) {
        coordsX.push(currentNeighborX);
      } else if (currentNeighborX === -1) {
        coordsX.push(fieldLength - 1);
      } else {
        coordsX.push(0);
      }

      if (!(currentNeighborY === -1) && !(currentNeighborY === fieldLength)) {
        coordsY.push(currentNeighborY);
      } else if (currentNeighborY === -1) {
        coordsY.push(fieldLength - 1);
      } else {
        coordsY.push(0);
      }
    }
  }
  for (let i = 0; i < NEIGHBORS_NUMBER; i++) {
    neighborsCoords.push([coordsX[i], coordsY[i]]);
  }
  return neighborsCoords;
};

const countAliveNeighbors = (field) => {
  const fieldLength = field.length;
  for (const row of field) {
    for (const tile of row) {
      let aliveNeighborsCnt = 0;
      const neighborsCoords = getNeighborsCoords(tile, fieldLength);
      for (const neighborCoords of neighborsCoords) {
        const currentNeighbor = field[neighborCoords[1]][neighborCoords[0]];
        if (currentNeighbor.isAlive) {
          aliveNeighborsCnt++;
        }
      }
      if (tile.isAlive && (aliveNeighborsCnt < 2 || aliveNeighborsCnt > 3)) {
        tile.isAboutToDie = true;
      } else if (!tile.isAlive && aliveNeighborsCnt === 3) {
        tile.isBeingBorn = true;
      }
    }
  }
  console.log('Alive members counted!');
};

const killDyingTiles = (field) => {
  for (const row of field) {
    for (const tile of row) {
      if (tile.isAboutToDie) {
        tile.isAlive = false;
        tile.isAboutToDie = false;
        console.log(`Tile killed: x=${tile.posY}, y=${tile.posX}`);
      }
    }
  }
  console.log('Dying tiles killed!');
};

const giveBirthToNewTiles = (field) => {
  let newTilesCnt = 0;
  for (const row of field) {
    for (const tile of row) {
      if (tile.isBeingBorn) {
        tile.isAlive = true;
        tile.isBeingBorn = false;
        console.log(`Tile born: x=${tile.posY}, y=${tile.posX}`);
      }
    }
  }
  console.log('New tiles have been given birth!');
};

const drawField = (gameField, tileSize) => {
  canvasContext.fillStyle = 'rgb(255,0,0)';
  for (const row of gameField) {
    for (const tile of row) {
      if (tile.isAlive) {
        canvasContext.fillRect(tile.posX * tileSize, tile.posY * tileSize, tileSize, tileSize);
      } else if (!tile.isAlive) {
        canvasContext.fillStyle = '#222';
        canvasContext.fillRect(tile.posX * tileSize, tile.posY * tileSize, tileSize, tileSize);
        canvasContext.fillStyle = 'rgb(255,0,0)';
        console.log('TILE DEAD');
      }
    }
  }
  console.log('Field drawn!');
};

const resetField = (gameField) => {
  for (const row of gameField) {
    for (const tile of row) {
      tile.isAlive = false;
      tile.isAboutToDie = false;
      tile.isBeingBorn = false;
    }
  }
};

const simulateOneGameTurn = (gameField, tileSize) => {
  if (!isGamePaused) {
    countAliveNeighbors(gameField);
    killDyingTiles(gameField);
    giveBirthToNewTiles(gameField);
    drawField(gameField, tileSize);
  } else {
    console.log('The game is currently paused');
  }
};

const getFrameTime = () => {
  const TIME_CONSTANT = 1000;
  const frameTime = Math.floor(TIME_CONSTANT / uiElements.speedSlider.value);
  return frameTime;
};

const updateSimulationSpeedDisplaying = () => {
  uiElements.speedParagraph.innerText = 'Simulation speed: ' + Math.floor(1 / getFrameTime() * 1000);
};

const reviveClickedTile = (gameField, x, y) => {
  for (const row of gameField) {
    for (const tile of row) {
      if (x === tile.posX && y === tile.posY) {
        tile.isAlive = true;
        console.log("Revived a tile.");
      }
    }
  }
};

const ongoingIntervals = [];
let isGameStarted = false;
let isGamePaused = true;
updateSimulationSpeedDisplaying();
uiElements.speedSlider.onchange = () => {
  updateSimulationSpeedDisplaying();
};

uiElements.startButton.onclick = () => {
  if (isGamePaused) {
    isGamePaused = false;
  }
  if (!isGameStarted) {
    isGameStarted = true;
    const tileSizeSelectorValue = uiElements.tileSizeSelector.value;
    const tileSize = TILE_SIZES[tileSizeSelectorValue];
    const fieldLength = FIELD_SIZES[tileSizeSelectorValue + 'Tiles'];
    const gameField = createGameField(fieldLength);

    if (ongoingIntervals.length === 1) {
      clearInterval(ongoingIntervals[0]);
      ongoingIntervals.pop();
    }
    isGamePaused = false;
    let frameInterval = setInterval(() => simulateOneGameTurn(gameField, tileSize), getFrameTime());
    ongoingIntervals.push(frameInterval);

    uiElements.speedSlider.onchange = () => {
      clearInterval(frameInterval);
      ongoingIntervals.pop();
      frameInterval = setInterval(() => simulateOneGameTurn(gameField, tileSize), getFrameTime());
      ongoingIntervals.push(frameInterval);
      updateSimulationSpeedDisplaying();
    };

    uiElements.pauseButton.onclick = () => {
      isGamePaused = true;
      console.log('Game is paused!');
    };

    uiElements.resetButton.onclick = () => {
      isGameStarted = false;
      resetField(gameField);
      simulateOneGameTurn(gameField, tileSize);
      isGamePaused = true;
      console.log('Game has been reset!');
    };

    uiElements.canvas.onmousedown = (event) => {
      const canvasRect = uiElements.canvas.getBoundingClientRect();
      const offsetX = -10 - canvasRect.left;
      const offsetY = -10 - canvasRect.top;
      const canvasClickX = event.clientX + offsetX;
      const canvasClickY = event.clientY + offsetY;
      console.log(`Canvas click: x=${canvasClickX}, y=${canvasClickY}`);
      const tileX = Math.floor((canvasClickX) / tileSize);
      const tileY = Math.floor((canvasClickY) / tileSize);
      console.log(`Tile x=${tileX}, y=${tileY}`);
      reviveClickedTile(gameField, tileX, tileY);
      drawField(gameField, tileSize);
    };
  }
};



