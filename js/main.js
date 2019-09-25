'use strict';

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var mapPinsBlock = document.querySelector('.map__pins');
var filter = document.querySelector('.map__filters-container');

var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');


var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var MIN_PRICE = 1000;
var MAX_PRICE = 10000;

var MIN_ROOMS = 1;
var MAX_ROOMS = 4;

var MIN_GUESTS = 1;
var MAX_GUESTS = 6;

var X_COORDS_MIN = 0;
var X_COORDS_MAX = map.offsetWidth;
var Y_COORDS_MIN = 130;
var Y_COORDS_MAX = 630;

var ADS_AMOUNT = 8;


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

// Генерация аватаров
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

// Генерация объявлений
var generateAds = function (quantity) {
  var adsArray = [];
  var avatars = generateUserAvatars(quantity);

  for (var i = 0; i < quantity; i++) {
    var computedAddress = computeAddress(avatars);

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


var ads = generateAds(ADS_AMOUNT);

// Отрисовка объявления по шаблону
var renderAd = function (element) {
  var ad = adTemplate.cloneNode(true);

  ad.style.left = element.location.x - ad.offsetWidth / 2 + 'px';
  ad.style.top = element.location.y - ad.offsetHeight + 'px';
  ad.querySelector('img').src = element.author.avatar;
  ad.querySelector('img').alt = element.offer.title;

  return ad;
};

// Добавление объявлений в разметку
var renderAds = function (arr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderAd(arr[i]));
  }
  return mapPinsBlock.appendChild(fragment);
};

// Определение типа жилья
var selectTypeOfHabitation = function (type) {
  switch (type) {
    case 'flat': return 'Квартира';

    case 'bungalo': return 'Бунгало';

    case 'house': return 'Дом';

    case 'palace': return 'Дворец';

    default: return '';
  }
};

// Добавление удобств жилья
var addFeaturesOfHabitation = function (arr) {
  var featuresOfHabitation = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var featureOfHabitation = document.createElement('li');
    featureOfHabitation.classList.add('popup__feature', 'popup__feature--' + arr[i]);

    featuresOfHabitation.appendChild(featureOfHabitation);
  }
  return featuresOfHabitation;
};


// Отрисовка карточки с подробностями объявления по шаблону
var renderCard = function (element) {
  var card = cardTemplate.cloneNode(true);
  var cardPhotoTemplate = card.querySelector('.popup__photo');

  card.querySelector('.popup__title').textContent = element.offer.title;
  card.querySelector('.popup__text--address').textContent = element.offer.address;
  card.querySelector('.popup__text--price ').textContent = element.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = selectTypeOfHabitation(element.offer.type);
  card.querySelector('.popup__text--capacity').textContent = element.offer.rooms + ' комнаты для ' + element.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = ' Заезд после ' + element.offer.checkin + ', выезд до ' + element.offer.checkout;
  card.querySelector('.popup__description').textContent = element.offer.description;
  card.querySelector('.popup__avatar').src = element.author.avatar;

  // Удобства жилья
  card.querySelector('.popup__features').innerHTML = '';
  card.querySelector('.popup__features').appendChild(addFeaturesOfHabitation(element.offer.features));

  // Фото жилья
  card.querySelector('.popup__photos').innerHTML = '';

  for (var i = 0; i < element.offer.photos.length; i++) {
    var photo = cardPhotoTemplate.cloneNode(true);
    photo.src = element.offer.photos[i];
    card.querySelector('.popup__photos').appendChild(photo);
  }

  return card;
};

// Добавление карточки с подробностями объявления
var renderCards = function (arr) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderCard(arr[0]));

  return map.insertBefore(fragment, filter);
};

renderAds(ads);
renderCards(ads);
