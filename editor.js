const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const hexRadius = 40;
const lineWidth = 2;
const backgroundImage = new Image();
backgroundImage.src = "fog_of_war.png";


//Terrain
const grassImg = new Image();
grassImg.src = 'hex_grass.png';

const sandImg = new Image();
sandImg.src = 'hex_sand.png';

const waterImg = new Image();
waterImg.src = 'hex_water.png';

const snowImg = new Image();
snowImg.src = 'hex_snow.png';

const swampImg = new Image();
swampImg.src = 'hex_swamp.png';

const lavaImg = new Image();
lavaImg.src = 'hex_lava.png';

const dirtImg = new Image();
dirtImg.src = 'hex_dirt.png';

const roughImg = new Image();
roughImg.src = 'hex_rough.png';

const subterrareanImg = new Image();
subterrareanImg.src = 'hex_subterranean.png';

//Castles
const necroImg = new Image();
necroImg.src = 'hex_necro.png';

const towerImg = new Image();
towerImg.src = 'hex_tower.png';

const castleImg = new Image();
castleImg.src = 'hex_castle.png';

const dungeonImg = new Image();
dungeonImg.src = 'hex_dungeon.png';

const fortressImg = new Image();
fortressImg.src = 'hex_fortress.png';

const infernoImg = new Image();
infernoImg.src = 'hex_inferno.png';

const rampartImg = new Image();
rampartImg.src = 'hex_rampart.png';

let horizontalSpacing = -10;
let verticalSpacing = -10;
let rowOffset = 37;
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

const stateImages = {
  //Terrain
  grass: grassImg,
  sand: sandImg,
  water: waterImg,
  snow: snowImg,
  swamp: swampImg,
  lava: lavaImg,
  dirt: dirtImg,
  rough: roughImg,
  subterrarean: subterrareanImg,
  //Castles
  necro: necroImg,
  tower: towerImg,
  castle: castleImg,
  dungeon: dungeonImg,
  fortress: fortressImg,
  inferno: infernoImg,
  rampart: rampartImg,
};

function drawHexWithStateImage(x, y, radius, state, highlight = false) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i + Math.PI / 6;
    const hx = x + radius * Math.cos(angle);
    const hy = y + radius * Math.sin(angle);
    ctx.lineTo(hx, hy);
  }
  ctx.closePath();

  if (highlight) {
    ctx.save();
    ctx.strokeStyle = '#e6b02e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  } else {
    const pattern = ctx.createPattern(backgroundImage, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fill();

    if (stateImages[state]) {
      drawHexWithImage(x, y, radius, stateImages[state]);
    }

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
    drawHexWithStateImage(hex.x, hex.y, hex.radius, hex.state);
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
  //Terrain
  const grassButton = document.getElementById('grassButton');
  const sandButton = document.getElementById('sandButton');
  grassButton.style.display = 'none';
  sandButton.style.display = 'none';
  const waterButton = document.getElementById('waterButton');
  waterButton.style.display = 'none'; 
  const snowButton = document.getElementById('snowButton');
  snowButton.style.display = 'none'; 
  const swampButton = document.getElementById('swampButton');
  swampButton.style.display = 'none'; 
  const lavaButton = document.getElementById('lavaButton');
  lavaButton.style.display = 'none'; 
  const dirtButton = document.getElementById('dirtButton');
  dirtButton.style.display = 'none'; 
  const roughButton = document.getElementById('roughButton');
  roughButton.style.display = 'none';
  const subterrareanButton = document.getElementById('subterrareanButton');
  subterrareanButton.style.display = 'none'; 
  //Castles
  const necroButton = document.getElementById('necroButton');
  necroButton.style.display = 'none'; 
  const towerButton = document.getElementById('towerButton');
  towerButton.style.display = 'none'; 
  const castleButton = document.getElementById('castleButton');
  castleButton.style.display = 'none'; 
  const dungeonButton = document.getElementById('dungeonButton');
  dungeonButton.style.display = 'none'; 
  const fortressButton = document.getElementById('fortressButton');
  fortressButton.style.display = 'none'; 
  const infernoButton = document.getElementById('infernoButton');
  infernoButton.style.display = 'none';
  const rampartButton = document.getElementById('rampartButton');
  rampartButton.style.display = 'none'; 

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

swampButton.addEventListener('click', () => {
  currentState = 'swamp';
});

lavaButton.addEventListener('click', () => {
  currentState = 'lava';
});

dirtButton.addEventListener('click', () => {
  currentState = 'dirt';
});

roughButton.addEventListener('click', () => {
  currentState = 'rough';
});

subterrareanButton.addEventListener('click', () => {
  currentState = 'subterrarean';
});

//Castles
necroButton.addEventListener('click', () => {
  currentState = 'necro';
});

towerButton.addEventListener('click', () => {
  currentState = 'tower';
});

castleButton.addEventListener('click', () => {
  currentState = 'castle';
});

dungeonButton.addEventListener('click', () => {
  currentState = 'dungeon';
});

fortressButton.addEventListener('click', () => {
  currentState = 'fortress';
});

infernoButton.addEventListener('click', () => {
  currentState = 'inferno';
});

rampartButton.addEventListener('click', () => {
  currentState = 'rampart';
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
    const terrainButtons = ['grassButton', 'sandButton', 'waterButton', 'snowButton', 'swampButton', 'lavaButton', 'dirtButton', 'roughButton', 'subterrareanButton'];
    const necroButton = document.getElementById('necroButton');
    const towerButton = document.getElementById('towerButton');
    const castleButton = document.getElementById('castleButton');
    const dungeonButton = document.getElementById('dungeonButton');
    const fortressButton = document.getElementById('fortressButton');
    const infernoButton = document.getElementById('infernoButton');
    const rampartButton = document.getElementById('rampartButton');
  
    if (selectedTile === 'castles') {
      terrainButtons.forEach(buttonId => {
        document.getElementById(buttonId).style.display = 'none'; // Hide terrain buttons
      });
      necroButton.style.display = 'inline-block'; 
      towerButton.style.display = 'inline-block'; 
      castleButton.style.display = 'inline-block'; 
      dungeonButton.style.display = 'inline-block'; 
      fortressButton.style.display = 'inline-block'; 
      infernoButton.style.display = 'inline-block'; 
      rampartButton.style.display = 'inline-block'; 
    } else if (selectedTile === 'terrain') {
      terrainButtons.forEach(buttonId => {
        document.getElementById(buttonId).style.display = 'inline-block'; // Show terrain buttons
      });
      necroButton.style.display = 'none'; 
      towerButton.style.display = 'none'; 
      castleButton.style.display = 'none';
      dungeonButton.style.display = 'none'; 
      fortressButton.style.display = 'none'; 
      infernoButton.style.display = 'none'; 
      rampartButton.style.display = 'none'; 
    } else {
      terrainButtons.forEach(buttonId => {
        document.getElementById(buttonId).style.display = 'none'; 
      });
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

function changeToSwamp() {
  currentState = 'swamp';
}

function changeToLava() {
  currentState = 'lava';
}

function changeToDirt() {
  currentState = 'dirt';
}

function changeToRough() {
  currentState = 'rough';
}

function changeToSubterrarean() {
  currentState = 'subterrarean';
}

function changeToNecro() {
  currentState = 'necro';
}

function changeToTower() {
  currentState = 'tower';
}

function changeToCastle() {
  currentState = 'castle';
}

function changeToDungeon() {
  currentState = 'dungeon';
}

function changeToFortress() {
  currentState = 'fortress';
}

function changeToInferno() {
  currentState = 'inferno';
}

function changeToRampart() {
  currentState = 'rampart';
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
      drawHexWithStateImage(hex.x, hex.y, hex.radius, hex.state, true);
      break;
    }
  }
}
