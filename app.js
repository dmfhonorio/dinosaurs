const CARNIVOR_TYPE = 'carnivor';
const OMNIVOR_TYPE = 'omnivor';
const HERBAVOR_TYPE = 'herbavor';
const PIGEON_TYPE = 'Pigeon';

const COLORS = ["#009687f5", "#dc7657f5", "#4bb3c1fa", "#fac069f9", "#b94169fa", "#7f62b3fa", "#9fc376f9", "#677bcbfa", "#67a866f9"];

const Utils = {
  convertKgsToPounds: (kgs) => {
    return kgs * 2.2046;
  },
  convertCmsToFeet: (cms) => {
    return cms * 0.032808;
  },
  shuffleList: (list) => {
    let newList = [...list];
    for (var i = newList.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = newList[i];
      newList[i] = newList[j];
      newList[j] = temp;
    }
    return newList;
  }
}

// Dino

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

Dino.prototype.compareWeight = function (weight) {
  if (this.weight > weight) {
    return (this.weight / weight).toFixed(2) + 'x heavier than you';
  } else {
    return (weight / this.weight).toFixed(2) + 'x lighter than you';
  }
}

Dino.prototype.compareHeight = function (height) {
  if (this.height > height) {
    return (this.height / height).toFixed(2) + 'x higher than you';
  } else {
    return (height / this.height).toFixed(2) + 'x smaller than you';
  }
}

Dino.prototype.compareDiet = function (diet) {
  if (this.diet === CARNIVOR_TYPE) {
    if (diet === CARNIVOR_TYPE || diet === OMNIVOR_TYPE) {
      return "Hunt it fast or it will eat you";
    } else {
      return "Run for your life";
    }
  } else if (this.diet === HERBAVOR_TYPE) {
    if (diet === CARNIVOR_TYPE) {
      return "No need to worry, it will not eat you";
    } else {
      return "Share a meal with it";
    }
  } else if (this.diet === OMNIVOR_TYPE) {
    if (diet === OMNIVOR_TYPE) {
      return "Share a meal with it";
    } else if (diet === HERBAVOR_TYPE) {
      return "It is best if you stay away";
    } else {
      return "Hunt it or tease it with a delicious fruit";
    }
  }
}

let dinosList;
fetch('dino.json')
  .then(res => res.json())
  .then(json => {
    const { Dinos } = json;
    dinosList = Dinos.map(dino => (new Dino(dino)));
  });


// Create Human Object IIFE

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
        height = Utils.convertCmsToFeet(heightMetricForm.value);
        weight = parseInt(Utils.convertKgsToPounds(weightMetricForm.value));
      }

      return { name, height, weight, diet }
    }
  }
})();

(function addListeners() {

  const createNewInfographicBtn = () => {
    let newBtn = document.createElement('button');
    newBtn.innerText = 'Create new infographic';
    newBtn.className = 'new-infographic-btn';
    newBtn.addEventListener('click', (event) => {
      let form = document.getElementById('dino-compare');
      form.style = "display:block;";
      let tilesWrapper = document.getElementById('dino-tiles');
      tilesWrapper.innerHTML = '';
    })
    return newBtn;
  }

  // Remove form from screen
  const removeForm = () => {
    let form = document.getElementById('dino-compare');
    const nameForm = dinoForm.querySelector('#name');
    const feetForm = dinoForm.querySelector('#feet');
    const inchesForm = dinoForm.querySelector('#inches');
    const heightMetricForm = dinoForm.querySelector('#height-metric');
    const weightForm = dinoForm.querySelector('#weight');
    const weightMetricForm = dinoForm.querySelector('#weight-metric');
    const dietForm = dinoForm.querySelector('#diet');
    const measurementSystem = dinoForm.querySelector('#measurement-system');
    form.style = "display:none;"
    nameForm.value = '';
    feetForm.value = '';
    inchesForm.value = '';
    heightMetricForm.value = '';
    weightForm.value = '';
    weightMetricForm.value = '';
    dietForm.value = 'herbavor';
    measurementSystem.value = 'imperial';
    measurementSystem.dispatchEvent(new Event('change'));
  }

  // Generate Tiles for each Dino in Array
  // Add tiles to DOM
  function generateTiles(dinos) {
    const generateTileNode = (color, name, imgName, description = null, facts = null) => {
      let node = document.createElement('div');
      node.className = 'grid-item';
      node.style.background = color;
      let nodeName = document.createElement('h3');
      nodeName.appendChild(document.createTextNode(name));
      node.appendChild(nodeName);
      let nodeImg = document.createElement('img');
      nodeImg.src = `images/${imgName}.png`;
      node.appendChild(nodeImg);
      if (description) {
        let nodeDescription = document.createElement('p');
        nodeDescription.appendChild(document.createTextNode(description));
        node.appendChild(nodeDescription);
      }
      if (facts) {
        let factsList = document.createElement('ul');
        factsList.className = 'dino-facts-list';
        facts.forEach(fact => {
          let factNode = document.createElement('li');
          factNode.innerText = fact;
          factsList.appendChild(factNode);
        })
        node.appendChild(factsList);
      }
      return node;
    }
    const generateDinoTile = (dino, color) => {
      const randomIndex = parseInt(Math.random() * dino.facts.length);
      return generateTileNode(color, dino.species, dino.species.toLowerCase(), dino.facts[randomIndex], dino.facts);
    }
    const generateHumanTile = () => {
      const { name } = human.getInfo();
      return generateTileNode(COLORS[COLORS.length - 1], name, 'human');
    }
    let dinoNodes = [];
    dinos.forEach((dino, index) => {
      const color = COLORS[index];
      let dinoNode = generateDinoTile(dino, color);
      dinoNodes.push(dinoNode);
    });
    dinoNodes = Utils.shuffleList(dinoNodes);
    const middleIndex = Math.floor(dinos.length / 2);
    const humanNode = generateHumanTile();
    dinoNodes.splice(middleIndex, 0, humanNode)
    removeForm();
    const newInfoButton = createNewInfographicBtn();
    let tilesWrapper = document.getElementById('dino-tiles');
    tilesWrapper.appendChild(newInfoButton);
    const grid = document.createElement('div');
    grid.id = 'grid';
    dinoNodes.forEach(node => {
      grid.appendChild(node);
    })
    tilesWrapper.appendChild(grid);
  }

  // On button click, prepare and display infographic
  const dinoForm = document.getElementById('dino-compare');
  dinoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const humanInfo = human.getInfo();
    let dinos = dinosList.map(dino => {
      const newDino = {
        ...dino,
        facts: [dino.fact]
      }
      if (dino.species != PIGEON_TYPE) {
        newDino.facts = newDino.facts.concat([
          `Weighs ${dino.weight} lbs`,
          `Measures ${dino.height} ft`,
          `${dino.where}, ${dino.when}`,
          dino.compareWeight(humanInfo.weight),
          dino.compareHeight(humanInfo.height),
          dino.compareDiet(humanInfo.diet)
        ])
      }
      return newDino;
    })
    generateTiles(dinos);
  });

  // Add Measurement System Change
  const measurementSystemSelector = document.getElementById('measurement-system');
  measurementSystemSelector.addEventListener('change', function (event) {
    const { value } = event.target;
    const imperialSystem = document.getElementById('imperial-system');
    const metricSystem = document.getElementById('metric-system');
    imperialSystem.style.display = value == 'imperial' ? 'block' : 'none';
    metricSystem.style.display = value == 'metric' ? 'block' : 'none';
    const feetInpt = imperialSystem.querySelector("#feet");
    const inchesInpt = imperialSystem.querySelector("#inches");
    const weightInpt = imperialSystem.querySelector("#weight");
    const heightMetricInpt = metricSystem.querySelector("#height-metric");
    const weightMetricInpt = metricSystem.querySelector("#weight-metric");
    feetInpt.required = value == 'imperial';
    inchesInpt.required = value == 'imperial';
    weightInpt.required = value == 'imperial';
    heightMetricInpt.required = value == 'metric';
    weightMetricInpt.required = value == 'metric';
  });
})();
