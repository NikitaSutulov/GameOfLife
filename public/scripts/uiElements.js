'use strict';

const uiElements = {
  statsParagraph: document.getElementById('statsPar'),
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

uiElements.canvasContext = uiElements.canvas.getContext('2d');

export { uiElements };
