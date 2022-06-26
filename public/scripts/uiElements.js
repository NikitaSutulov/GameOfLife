'use strict';

const uiElements = {
  statLabels: document.querySelectorAll('.statLabel'),
  buttons: document.querySelectorAll('.button'),
  canvas: document.getElementById('canvas'),
  speedParagraph: document.getElementById('speedPar'),
  speedSlider: document.getElementById('speedSlider'),
  tileSizeSelector: document.getElementById('tileSizeSelector'),
  body: document.querySelector("body")
};
uiElements.startButton = uiElements.buttons[0];
uiElements.pauseButton = uiElements.buttons[1];
uiElements.resetButton = uiElements.buttons[2];

uiElements.aliveTilesLabel = uiElements.statLabels[0];
uiElements.deadTilesLabel = uiElements.statLabels[1];
uiElements.dyingTilesLabel = uiElements.statLabels[2];
uiElements.beingBornTilesLabel = uiElements.statLabels[3];

uiElements.canvasContext = uiElements.canvas.getContext('2d');

export { uiElements };
