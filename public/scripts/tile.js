'use strict';

import { uiElements } from './uiElements.js';

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

export { TILE_SIZES, FIELD_SIZES, Tile };
