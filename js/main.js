'use strict';

var map = document.querySelector('.map');
map.classList.remove('map--faded');


var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var MIN_PRICE = 1000;
var MAX_PRICE = 20000;

var MIN_ROOMS = 1;
var MAX_ROOMS = 5;

var MIN_GUESTS = 1;
var MAX_GUESTS = 6;

var X_COORDS_MIN = 0;
var X_COORDS_MAX = map.offsetWidth;
var Y_COORDS_MIN = 130;
var Y_COORDS_MAX = 630;

var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;

var titles = ['Большая квартира', 'Маленькая квартирка', 'Хоромы', 'Бабушкина хата', 'Коробка под мостом'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// Выбор случайного элемента массива
var selectRandomElement = function (arr) {
  var randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

// Генерация случайного числа в заданном диапазоне
var generateRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Генерация массива случайной длины
var generateRandomArray = function (arr) {
  var randomArray = [];

  if (arr.length !== 0) {
    var randomArrayLength = generateRandomNumber(1, (arr.length + 1));

    for (var i = 0; i < randomArrayLength; i++) {
      var randomElement = selectRandomElement(arr);
      if (randomArray.indexOf(randomElement) !== -1) {
        i--;
      } else {
        randomArray[i] = randomElement;
      }
    }
  }
  return randomArray;
};

// Генерация аваторов
var generateUserAvatars = function (quantity) {
  var userAvatars = [];

  for (var i = 0; i < quantity; i++) {
    if (i <= 9) {
      userAvatars[i] = 'img/avatars/user0' + (i + 1) + '.png';
    }
    if (i > 9) {
      userAvatars[i] = 'img/avatars/user' + (i + 1) + '.png';
    }
  }
  return userAvatars;
};

// Вычисление адреса
var computeAddress = function () {
  return {
    x: generateRandomNumber(X_COORDS_MIN, X_COORDS_MAX),
    y: generateRandomNumber(Y_COORDS_MIN, Y_COORDS_MAX)
  };
};

var generateAds = function (quantity) {
  var adsArray = [];
  var avatars = generateUserAvatars(quantity);

  for (var i = 0; i < quantity; i++) {
    var computedAddress = computeAddress();

    adsArray[i] = {
      author: {
        avatar: avatars[i]
      },

      offer: {
        title: selectRandomElement(titles),
        address: computedAddress.x + ', ' + computedAddress.y,
        price: generateRandomNumber(MIN_PRICE, MAX_PRICE),
        type: selectRandomElement(TYPES),
        rooms: generateRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: generateRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: selectRandomElement(CHECKIN),
        checkout: selectRandomElement(CHECKOUT),
        features: generateRandomArray(FEATURES),
        description: '',
        photos: generateRandomArray(photos)
      },

      location: computedAddress
    };
  }
  return adsArray;
};


var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// Отрисовка объявления по шаблону
var renderAd = function (element) {
  var ad = adTemplate.cloneNode(true);

  ad.style.left = element.location.x - MAP_PIN_WIDTH / 2 + 'px';
  ad.style.top = element.location.y - MAP_PIN_HEIGHT + 'px';
  ad.querySelector('img').src = element.author.avatar;
  ad.querySelector('img').alt = element.offer.title;

  return ad;
};

// Добавление объявлений в разметку
var renderAds = function (quantity) {
  var fragment = document.createDocumentFragment();
  var ads = generateAds(quantity);

  for (var i = 0; i < quantity; i++) {
    fragment.appendChild(renderAd(ads[i]));
  }
  return document.querySelector('.map__pins').appendChild(fragment);
};

renderAds(8);
