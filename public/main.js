'use strict';


const uiElements = {
  statsParagraph: document.getElementById('statsPar'),
  buttons: document.getElementsByClassName('button'),
  canvas: document.getElementById('canvas'),
  speedParagraph: document.getElementById('speedPar'),
  speedSlider: document.getElementById('speedSlider')
};

const simulate = () => {
  console.log(uiElements.speedSlider.value);
};

let simulationFrameInterval = setInterval(simulate, 100 * uiElements.speedSlider.value);

const updateGameSpeed = (gameFrameInterval, callback) => {
  let currentSpeed = uiElements.speedSlider.value;
  const checkInterval = () => {
    setInterval(() => {
      if (currentSpeed !== uiElements.speedSlider.value)
      {
        clearInterval(gameFrameInterval);
        gameFrameInterval = setInterval(callback, 100 * uiElements.speedSlider.value);
        currentSpeed = uiElements.speedSlider.value;
      }
    }, 50);
  };
  checkInterval();
};

updateGameSpeed(simulationFrameInterval, simulate);
