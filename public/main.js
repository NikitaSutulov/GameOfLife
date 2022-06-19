'use strict';

const uiElements = {
  statsParagraph: document.getElementById('statsPar'),
  buttons: document.getElementsByClassName('button'),
  canvas: document.getElementById('canvas'),
  speedParagraph: document.getElementById('speedPar'),
  speedSlider: document.getElementById('speedSlider'),
  tileSizeSelector: document.getElementById('tileSizeSelector')
};

const updateGameSpeed = (frameInterval, callback) => {
  let gameSpeed = uiElements.speedSlider.value;
  const checkInterval = () => {
    setInterval(() => {
      const newGameSpeed = uiElements.speedSlider.value;
      if (gameSpeed !== newGameSpeed) {
        clearInterval(frameInterval);
        frameInterval = setInterval(callback, 100 * newGameSpeed);
        gameSpeed = newGameSpeed;
      }
    }, 50);
  };
  checkInterval();
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
      if (tile.posX + j === tile.posY + i && j === 0) {
        continue;
      }
      const currentNeighborX = tile.posX + j;
      const currentNeighborY = tile.posY + i;

      if (!(currentNeighborX === -1) || !(currentNeighborX === fieldLength)) {
        coordsX.push(currentNeighborX);
      } else if (currentNeighborX === -1) {
        coordsX.push(fieldLength - 1);
      } else {
        coordsX.push(0);
      }

      if (!(currentNeighborY === -1) || !(currentNeighborY === fieldLength)) {
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
};

const killDyingTiles = (field) => {
  for (const row of field) {
    for (const tile of row) {
      if (tile.isAboutToDie) {
        tile.isAlive = false;
        tile.isAboutToDie = false;
      }
    }
  }
};

const giveBirthToNewTiles = (field) => {
  for (const row of field) {
    for (const tile of row) {
      if (tile.isBeingBorn) {
        tile.isAlive = true;
        tile.isBeingBorn = false;
      }
    }
  }
};

const simulate = () => {
  console.log(uiElements.speedSlider.value);
};

const frameInterval = setInterval(simulate, 100 * uiElements.speedSlider.value);

updateGameSpeed(frameInterval, simulate);
