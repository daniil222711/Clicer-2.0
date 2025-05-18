let count = parseInt(localStorage.getItem('count')) || 0;
let clickPower = 1;
let passiveIncome = parseFloat(localStorage.getItem('passiveIncome')) || 0;
let upgrades = JSON.parse(localStorage.getItem('upgrades')) || {};

const countElem = document.getElementById('count');
const upgradeMenu = document.getElementById('upgradeMenu');

const backgrounds = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg'];
const thresholds = [0, 100, 500, 1000, 5000];

function updateBackground() {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (count >= thresholds[i]) {
      document.body.style.backgroundImage = `url('${backgrounds[i]}')`;
      break;
    }
  }
}

function updateCountDisplay() {
  countElem.textContent = `${count} рублей`;
  updateBackground();
}

function saveProgress() {
  localStorage.setItem('count', count);
  localStorage.setItem('passiveIncome', passiveIncome);
  localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

function clickHandler() {
  count += clickPower;
  updateCountDisplay();
  saveProgress();

  if (count >= 1000 && !upgrades['реклама']) {
    alert("Доступно: разместить рекламу!");
    upgrades['реклама'] = true;
    saveProgress();
  }
}

document.body.addEventListener('click', clickHandler);

const upgradeList = [
  { id: 'boost1', name: 'Запуск Темки', income: 1, baseCost: 100 },
  { id: 'boost2', name: 'Прямая тема', income: 2, baseCost: 300 },
  { id: 'boost3', name: 'Сторис Темки', income: 5, baseCost: 700 },
  { id: 'boost4', name: 'Курс Темщика', income: 10, baseCost: 1500 },
  { id: 'boost5', name: 'Темный запуск', income: 25, baseCost: 4000 },
  { id: 'boost6', name: 'Инфо-империя', income: 50, baseCost: 10000 },
  { id: 'boost7', name: 'Автоворонка', income: 100, baseCost: 25000 },
  { id: 'boost8', name: 'Школа Темок', income: 250, baseCost: 50000 },
  { id: 'boost9', name: 'Медиа Империя', income: 500, baseCost: 120000 },
  { id: 'boost10', name: 'Бог Темок', income: 1000, baseCost: 250000 },
];

function renderUpgrades() {
  upgradeMenu.innerHTML = '<strong>Улучшения</strong><br>';
  upgradeList.forEach((u, index) => {
    const owned = upgrades[u.id]?.count || 0;
    const cost = Math.floor(u.baseCost * Math.pow(1.2, owned));
    const upgradeDiv = document.createElement('div');
    upgradeDiv.className = 'upgrade';
    upgradeDiv.innerHTML = `${u.name}<br>+${u.income}/сек — ${cost} руб. (x${owned})`;
    upgradeDiv.onclick = () => {
      if (count >= cost) {
        count -= cost;
        upgrades[u.id] = {
          count: (upgrades[u.id]?.count || 0) + 1,
          income: u.income,
        };
        passiveIncome += u.income;
        updateCountDisplay();
        renderUpgrades();
        saveProgress();
      }
    };
    upgradeMenu.appendChild(upgradeDiv);
  });
}

function passiveTick() {
  count += passiveIncome / 10;
  updateCountDisplay();
  saveProgress();
}

setInterval(passiveTick, 100); // Каждые 0.1 сек = 10 раз/сек

updateCountDisplay();
renderUpgrades();
