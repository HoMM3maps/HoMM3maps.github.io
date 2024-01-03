const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const hexRadius = 60;
const lineWidth = 2;
const backgroundImage = new Image();
backgroundImage.src = "fog_of_war.png";

const grassImg = new Image();
grassImg.src = 'hex_grass.png';

const sandImg = new Image();
sandImg.src = 'hex_sand.png';

const waterImg = new Image();
waterImg.src = 'hex_water.png';

const snowImg = new Image();
snowImg.src = 'hex_snow.png';

let horizontalSpacing = -16;
let verticalSpacing = -14;
let rowOffset = 51;
let hexagons = [];

backgroundImage.onload = function () {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initializeHexGrid(10, 10);
}

function drawHexWithImage(x, y, radius, image) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i + Math.PI / 6;
    const hx = x + radius * Math.cos(angle);
    const hy = y + radius * Math.sin(angle);
    ctx.lineTo(hx, hy);
  }
  ctx.closePath();

  ctx.drawImage(image, x - radius, y - radius, radius * 2, radius * 2);
}

function drawHex(x, y, radius, state, highlight = false) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i + Math.PI / 6;
    const hx = x + radius * Math.cos(angle);
    const hy = y + radius * Math.sin(angle);
    ctx.lineTo(hx, hy);
  }
  ctx.closePath();

  const pattern = ctx.createPattern(backgroundImage, 'repeat');
  ctx.fillStyle = pattern;
  ctx.fill();

  if (state === 'grass') {
    drawHexWithImage(x, y, hexRadius, grassImg);
  } else if (state === 'sand') {
    drawHexWithImage(x, y, hexRadius, sandImg);
  } else if (state === 'water') {
    drawHexWithImage(x, y, hexRadius, waterImg); 
  } else if (state === 'snow') {
    drawHexWithImage(x, y, hexRadius, snowImg); 
  }

  if (highlight) {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i + Math.PI / 6;
      const hx = x + radius * Math.cos(angle);
      const hy = y + radius * Math.sin(angle);
      ctx.lineTo(hx, hy);
    }
    ctx.closePath();

    ctx.strokeStyle = '#e6b02e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i + Math.PI / 6;
      const hx = x + radius * Math.cos(angle);
      const hy = y + radius * Math.sin(angle);
      ctx.lineTo(hx, hy);
    }
    ctx.closePath();

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function initializeHexGrid(rows, cols) {
  const savedHexagons = localStorage.getItem('hexagons');

  if (!savedHexagons) {
    hexagons = [];
    for (let q = 0; q * (2 * hexRadius + horizontalSpacing) <= canvas.width; q++) {
      for (let r = 0; r * (Math.sqrt(3) * hexRadius + verticalSpacing) <= canvas.height; r++) {
        const x = q * (2 * hexRadius + horizontalSpacing) + (r % 2) * rowOffset;
        const y = r * (Math.sqrt(3) * hexRadius + verticalSpacing);
        hexagons.push({ x, y, radius: hexRadius, state: 'empty' });
      }
    }
  } else {
    hexagons = JSON.parse(savedHexagons);
  }
  redraw();
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = lineWidth;

  for (let i = 0; i < hexagons.length; i++) {
    let hex = hexagons[i];
    drawHex(hex.x, hex.y, hex.radius, hex.state);
  }
}

function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (let i = 0; i < hexagons.length; i++) {
    let hex = hexagons[i];
    const distance = Math.sqrt(Math.pow(mouseX - hex.x, 2) + Math.pow(mouseY - hex.y, 2));
    if (distance <= hex.radius) {
      hex.state = currentState;
      redraw();
      break;
    }
  }
  saveHexagonsToLocalStorage();
}

function saveHexagonsToLocalStorage() {
  localStorage.setItem('hexagons', JSON.stringify(hexagons));
}

window.addEventListener('load', () => {
  initializeHexGrid(10, 10);
});

function toggleTerrainButtons(visible) {
  const grassButton = document.getElementById('grassButton');
  const sandButton = document.getElementById('sandButton');
  grassButton.style.display = visible ? 'inline-block' : 'none';
  sandButton.style.display = visible ? 'inline-block' : 'none';
}

// Event listener for toggling terrain buttons
document.getElementById('tileType').addEventListener('change', (event) => {
  const selectedTile = event.target.value;
  if (selectedTile === 'terrain') {
    toggleTerrainButtons(true);
  } else {
    toggleTerrainButtons(false);
  }
});

function clearHighlight() {
  redraw();
}

window.addEventListener('DOMContentLoaded', () => {
  const grassButton = document.getElementById('grassButton');
  const sandButton = document.getElementById('sandButton');
  grassButton.style.display = 'none';
  sandButton.style.display = 'none';
  const waterButton = document.getElementById('waterButton');
  waterButton.style.display = 'none'; 
  const snowButton = document.getElementById('snowButton');
  snowButton.style.display = 'none'; 

  document.getElementById('tileType').addEventListener('change', (event) => {
    const selectedTile = event.target.value;
    if (selectedTile === 'terrain') {
      grassButton.style.display = 'inline-block';
      sandButton.style.display = 'inline-block';
    } else {
      grassButton.style.display = 'none';
      sandButton.style.display = 'none';
    }
  });

  grassButton.addEventListener('click', () => {
    currentState = 'grass';
  });

  sandButton.addEventListener('click', () => {
    currentState = 'sand';
  });
});

waterButton.addEventListener('click', () => {
  currentState = 'water';
});

snowButton.addEventListener('click', () => {
  currentState = 'snow';
});

function toggleTerrainButtons(visible) {
  const grassButton = document.getElementById('grassButton');
  const sandButton = document.getElementById('sandButton');
  grassButton.style.display = visible ? 'inline-block' : 'none';
  sandButton.style.display = visible ? 'inline-block' : 'none';
}

window.addEventListener('DOMContentLoaded', () => {
  const grassButton = document.getElementById('grassButton');
  const sandButton = document.getElementById('sandButton');
  grassButton.style.display = 'none';
  sandButton.style.display = 'none';

  document.getElementById('tileType').addEventListener('change', (event) => {
    const selectedTile = event.target.value;
    if (selectedTile === 'terrain') {
      grassButton.style.display = 'inline-block';
      sandButton.style.display = 'inline-block';
      waterButton.style.display = 'inline-block';
      snowButton.style.display = 'inline-block';
    } else {
      grassButton.style.display = 'none';
      sandButton.style.display = 'none';
      waterButton.style.display = 'none';
      snowButton.style.display = 'none';
    }
  });

  grassButton.addEventListener('click', () => {
    currentState = 'grass';
  });

  sandButton.addEventListener('click', () => {
    currentState = 'sand';
  });
});

document.getElementById('tileType').addEventListener('change', (event) => {
  const selectedTile = event.target.value;
  if (selectedTile === 'terrain') {
    toggleTerrainButtons(true);
  } else {
    toggleTerrainButtons(false);
  }
});

document.getElementById('grassButton').addEventListener('click', () => {
  currentState = 'grass';
});

document.getElementById('sandButton').addEventListener('click', () => {
  currentState = 'sand';
});

document.getElementById('clearHexButton').addEventListener('click', () => {
  currentState = 'empty';
  redraw();
});

canvas.addEventListener('mousemove', handleMouseHover);
canvas.addEventListener('mouseleave', clearHighlight);
canvas.addEventListener('click', handleCanvasClick);

window.addEventListener('load', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initializeHexGrid(10, 10);
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initializeHexGrid(10, 10);
});

let currentState = 'empty';

function changeToGrass() {
  currentState = 'grass';
}

function changeToSand() {
  currentState = 'sand';
}

function changeToWater() {
  currentState = 'water';
}

function changeToSnow() {
  currentState = 'snow';
}

function clearHex() {
  currentState = 'empty';
  redraw();
}

function clearGrid() {
  hexagons.forEach(hex => {
    hex.state = 'empty';
  });
  redraw();
  localStorage.removeItem('hexagons'); // This line clears the local storage data
}


function handleMouseHover(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  redraw();

  for (let i = 0; i < hexagons.length; i++) {
    let hex = hexagons[i];
    const distance = Math.sqrt(Math.pow(mouseX - hex.x, 2) + Math.pow(mouseY - hex.y, 2));
    if (distance <= hex.radius) {
      drawHex(hex.x, hex.y, hex.radius, hex.state, true);
      break;
    }
  }
}

