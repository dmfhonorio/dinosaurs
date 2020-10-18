
// Create Dino Constructor

function Dino(dino) {
  const { species, weight, height, diet, where, when, fact } = dino;
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
}

// Create Dino Objects
let dinosList;
fetch('dino.json')
  .then(res => res.json())
  .then(json => {
    const { Dinos } = json;
    dinosList = Dinos.map(dino => (new Dino(dino)));
  });


// Create Human Object

// Use IIFE to get human data from form

const human = (function () {
  const dinoForm = document.getElementById('dino-compare');
  const nameForm = dinoForm.querySelector('#name');
  const feetForm = dinoForm.querySelector('#feet');
  const inchesForm = dinoForm.querySelector('#inches');
  const heightMetricForm = dinoForm.querySelector('#height-metric');
  const weightForm = dinoForm.querySelector('#weight');
  const weightMetricForm = dinoForm.querySelector('#weight-metric');
  const dietForm = dinoForm.querySelector('#diet');
  const measurementSystem = dinoForm.querySelector('#measurement-system');

  const convertKgsToPounds = (kgs) => {
    return kgs * 2.2046;
  }

  const convertCmsToFeet = (cms) => {
    return cms * 0.032808;
  }

  return {
    getInfo: () => {
      let name = nameForm.value;
      let diet = dietForm.value;
      let height;
      let weight;
      if (measurementSystem.value === 'imperial') {
        height = parseInt(feetForm.value) + parseInt(inchesForm.value) * 0.083333;
        weight = parseInt(weightForm.value);
      } else {
        height = convertCmsToFeet(heightMetricForm.value);
        weight = parseInt(convertKgsToPounds(weightMetricForm.value));
      }

      return { name, height, weight, diet }
    }
  }
})();

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches. 

Dino.prototype.compareWeight = function (weight) {
  if (this.weight > weight) {
    return (this.weight / weight).toFixed(2) + 'x heavier';
  } else {
    return (weight / this.weight).toFixed(2) + 'x lighter';
  }
}

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.

Dino.prototype.compareHeight = function (height) {
  if (this.height > height) {
    return (this.height / height).toFixed(2) + 'x higher';
  } else {
    return (height / this.height).toFixed(2) + 'x smaller';
  }
}


// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.

// Generate Tiles for each Dino in Array
// Add tiles to DOM

function generateTiles(dinos) {
  const generateTileNode = (name, imgName, description = null) => {
    let node = document.createElement('div');
    node.className = 'grid-item';
    let nodeName = document.createElement('h3');
    nodeName.appendChild(document.createTextNode(name));
    node.appendChild(nodeName);
    let nodeImg = document.createElement('img');
    nodeImg.src = `/images/${imgName}.png`;
    node.appendChild(nodeImg);
    if (description) {
      let nodeDescription = document.createElement('p');
      nodeDescription.appendChild(document.createTextNode(description));
      node.appendChild(nodeDescription);
    }
    return node;
  }
  const generateDinoTile = (dino) => {
    return generateTileNode(dino.species, dino.species.toLowerCase(), dino.fact);
  }
  const generateHumanTile = () => {
    const { name } = human.getInfo();
    return generateTileNode(name, 'human');
  }
  const dinoNodes = [];
  dinos.forEach(dino => {
    let dinoNode = generateDinoTile(dino);
    dinoNodes.push(dinoNode);
  });
  const middleIndex = Math.floor(dinos.length / 2);
  const humanNode = generateHumanTile();
  dinoNodes.splice(middleIndex, 0, humanNode)
  removeForm();
  let grid = document.getElementById('grid');
  dinoNodes.forEach(node => {
    grid.appendChild(node);
  })
}


// Remove form from screen
const removeForm = () => {
  let form = document.getElementById('dino-compare');
  form.style = "display:none;"
}


// On button click, prepare and display infographic

const dinoCompare = (event) => {
  event.preventDefault();
  console.log(human.getInfo());
  const humanInfo = human.getInfo();
  let dinos = dinosList.map(dino => {
    return {
      ...dino,
      fact1: dino.compareWeight(humanInfo.weight),
      fact2: dino.compareHeight(humanInfo.height)
    }
  })
  generateTiles(dinos);
}

const dinoForm = document.getElementById('dino-compare');
dinoForm.addEventListener('submit', dinoCompare);

// Add Measurement System Change
const measurementSystemSelector = document.getElementById('measurement-system');
measurementSystemSelector.addEventListener('change', function (event) {
  const { value } = event.target;
  const imperialSystem = document.getElementById('imperial-system');
  const metricSystem = document.getElementById('metric-system');
  imperialSystem.style.display = 'none';
  metricSystem.style.display = 'none';
  if (value == 'metric') {
    metricSystem.style.display = 'block';
  } else {
    imperialSystem.style.display = 'block';
  }
})