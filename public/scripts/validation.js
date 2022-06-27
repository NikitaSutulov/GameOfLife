'use strict';
import { Tile } from './tile.js';

const validateFieldLength = (fieldLength) => {
  if (typeof fieldLength !== 'number') {
    throw new Error('Error: fieldLength is expected to be a number, ' +
      `but was actually a ${typeof fieldLength}`);
  }
};
const validateTile = (tile) => {
  if (!(tile instanceof Tile)) {
    throw new Error('Error: tile is expected to be instance of Tile class.');
  }
};
const validateGameField = (gameField) => {
  if (!(gameField instanceof Array)) {
    throw new Error('Error: gameField must be an array.');
  }
  for (const row of gameField) {
    if (!(row instanceof Array)) {
      throw new Error('Error: gameField must be a matrix');
    }
    for (const tile of row) {
      validateTile(tile);
    }
  }
};
const validateIsGamePaused = (isGamePaused) => {
  if (typeof isGamePaused !== 'boolean') {
    throw new Error('Error! isGamePaused is expected ' +
      `to be a boolean, but its type is ${typeof isGamePaused}`);
  }
};
const validateCoords = (x, y) => {
  if (typeof x !== 'number') {
    throw new Error(`Error: x must be a number but its type is ${typeof x}.`);
  }
  if (typeof y !== 'number') {
    throw new Error(`Error: x must be a number but its type is ${typeof y}.`);
  }
};

export { validateFieldLength, validateTile, validateGameField,
        validateIsGamePaused, validateCoords };
