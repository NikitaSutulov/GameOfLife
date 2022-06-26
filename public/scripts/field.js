'use strict';

import { uiElements } from './uiElements.js';
import { TILE_SIZES, FIELD_SIZES, Tile } from './tile.js';

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
        newTilesCnt++;
      }
    }
  }
  console.log('New tiles have been given birth!');

};

const drawField = (fieldParams) => {
  uiElements.canvasContext.fillStyle = 'rgb(255,0,0)';
  const gameField = fieldParams.gameField;
  const TILE_IMAGES_PATHS = {
    'small': '../images/tile_small.jpg',
    'medium': '../images/tile_medium.jpg',
    'large': '..images/tile.large.jpg'
  };
  for (const row of gameField) {
    for (const tile of row) {
      if (tile.isAlive) {
        uiElements.canvasContext.fillRect(
          tile.posX * fieldParams.tileSize,
          tile.posY * fieldParams.tileSize,
          fieldParams.tileSize,
          fieldParams.tileSize
        );
      } else if (!tile.isAlive) {
        const tileImage = new Image(fieldParams.tileSize, fieldParams.tileSize);
        tileImage.src = '../images/tile.jpg';
        uiElements.canvasContext.drawImage(tileImage,
          tile.posX * fieldParams.tileSize,
          tile.posY * fieldParams.tileSize
        );

        console.log('TILE DEAD');
      }
    }
  }
  console.log('Field drawn!');
};

const resetField = (fieldParams) => {
  for (const row of fieldParams.gameField) {
    for (const tile of row) {
      tile.isAlive = false;
      tile.isAboutToDie = false;
      tile.isBeingBorn = false;
    }
  }
};

const simulateOneGameTurn = (fieldParams, isGamePaused) => {
  if (!isGamePaused) {
    countAliveNeighbors(fieldParams.gameField);
    killDyingTiles(fieldParams.gameField);
    giveBirthToNewTiles(fieldParams.gameField);
    drawField(fieldParams);
  } else {
    console.log('The game is currently paused');
  }
};

const getFrameTime = () => {
  const TIME_CONSTANT = 1000;
  return Math.floor(TIME_CONSTANT / uiElements.speedSlider.value);
};

const updateSimulationSpeedDisplaying = () => {
  uiElements.speedParagraph.innerText = 'Simulation speed: ' + Math.floor(1 / getFrameTime() * 1000);
};

const clickOnTile = (fieldParams, x, y) => {
  for (const row of fieldParams.gameField) {
    for (const tile of row) {
      if (x === tile.posX && y === tile.posY) {
        if (!tile.isAlive) {
          tile.isAlive = true;
        }
        else {
          tile.isAlive = false;
        }
        console.log(`Clicked a tile: x=${x}, y=${y}`);
      }
    }
  }
};

const initField = (fieldParams) => {
  fieldParams.tileSizeSelectorValue = uiElements.tileSizeSelector.value;
  fieldParams.tileSize = TILE_SIZES[fieldParams.tileSizeSelectorValue];
  fieldParams.fieldLength = FIELD_SIZES[fieldParams.tileSizeSelectorValue + 'Tiles'];
  fieldParams.gameField = createGameField(fieldParams.fieldLength);
};

export { uiElements, drawField, resetField,
         simulateOneGameTurn, getFrameTime, updateSimulationSpeedDisplaying,
         clickOnTile, initField };
