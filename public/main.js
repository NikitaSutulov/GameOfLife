'use strict';
import { uiElements, drawField, resetField,
  simulateOneGameTurn, getFrameTime, updateSimulationSpeedDisplaying,
  reviveClickedTile, initField } from './field.js';

uiElements.body.onload = () => {
  const ongoingIntervals = [];
  let isGameStarted = false;
  let isGamePaused = true;

  const fieldParameters = {
    tileSizeSelectorValue: null,
    fieldLength: null,
    tileSize: null,
    gameField: null
  };
  const fieldParamsArray = Object.keys(fieldParameters);

  initField(...fieldParamsArray);

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
      initField(fieldParameters);

      if (ongoingIntervals.length === 1) {
        clearInterval(ongoingIntervals[0]);
        ongoingIntervals.pop();
      }
      isGamePaused = false;
      let frameInterval = setInterval(() => simulateOneGameTurn(fieldParameters, isGamePaused), getFrameTime());
      ongoingIntervals.push(frameInterval);

      uiElements.speedSlider.onchange = () => {
        clearInterval(frameInterval);
        ongoingIntervals.pop();
        frameInterval = setInterval(() => simulateOneGameTurn(fieldParameters, isGamePaused), getFrameTime());
        ongoingIntervals.push(frameInterval);
        updateSimulationSpeedDisplaying();
      };
    }
  };

  uiElements.canvas.onmousedown = (event) => {
    const canvasRect = uiElements.canvas.getBoundingClientRect();
    const offsetX = -10 - canvasRect.left;
    const offsetY = -10 - canvasRect.top;
    const canvasClickX = event.clientX + offsetX;
    const canvasClickY = event.clientY + offsetY;
    console.log(`Canvas click: x=${canvasClickX}, y=${canvasClickY}`);
    const tileX = Math.floor((canvasClickX) / fieldParameters.tileSize);
    const tileY = Math.floor((canvasClickY) / fieldParameters.tileSize);
    console.log(`Tile x=${tileX}, y=${tileY}`);
    reviveClickedTile(fieldParameters, tileX, tileY);
    drawField(fieldParameters);
  };
  uiElements.pauseButton.onclick = () => {
    isGamePaused = true;
    console.log('Game is paused!');
  };

  uiElements.resetButton.onclick = () => {
    isGameStarted = false;
    resetField(fieldParameters);
    simulateOneGameTurn(fieldParameters, isGamePaused);
    initField(fieldParameters);
    isGamePaused = true;
    console.log('Game has been reset!');
  };

  uiElements.tileSizeSelector.onchange = () => {
    initField(fieldParameters);
  };
};
