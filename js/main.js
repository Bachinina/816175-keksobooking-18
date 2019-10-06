'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

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

var Y_COORDS_MIN = 130;
var Y_COORDS_MAX = 630;
var HEIGHT_OF_THE_TIP = 22;

var ADS_AMOUNT = 8;

var titles = ['Большая квартира', 'Маленькая квартирка', 'Хоромы', 'Бабушкина хата', 'Коробка под мостом'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');
var X_COORDS_MAX = map.offsetWidth;
var mapPinsBlock = document.querySelector('.map__pins');
var filterContainer = document.querySelector('.map__filters-container');

var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');


// Выбор случайного элемента массива
var selectRandomElement = function (arr) {
  var randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

// Генерация случайного числа в заданном диапазоне
var generateRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Генерация массива случайной длины с набором элементов в случайном порядке
var generateRandomArray = function (arr) {
  var j;
  var temp;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr.slice(0, generateRandomNumber(1, arr.length + 1));
};

// Генерация аватаров
var generateUserAvatars = function (quantity) {
  var userAvatars = [];

  for (var i = 0; i < quantity; i++) {
    var img = i < 9 ? 'user0' + (i + 1) : 'user' + (i + 1);
    var imgSrc = 'img/avatars/' + img + '.png';
    userAvatars[i] = imgSrc;
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

// Отрисовка объявления по шаблону
var renderAd = function (element) {
  var ad = adTemplate.cloneNode(true);

  ad.style.left = element.location.x - ad.offsetWidth / 2 + 'px';
  ad.style.top = element.location.y - ad.offsetHeight + 'px';
  ad.querySelector('img').src = element.author.avatar;
  ad.querySelector('img').alt = element.offer.title;

  // Добавление обработчиков событий
  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeCard();
    }
  };

  // Открыть карточку: удалить предыдущую, если она есть; отрисовать новую
  var openCard = function () {
    removeActiveCard();
    showCard(element);
    // При нажатии на ESC закрыть карточку
    document.addEventListener('keydown', onCardEscPress);
  };

  // Закрыть карточку: удалить текущую
  var closeCard = function () {
    removeActiveCard();
    // Удаление обработчика нажатия на ESC
    document.removeEventListener('keydown', onCardEscPress);
  };

  // Открытие карточки
  ad.addEventListener('click', function () {
    openCard();
  });
  ad.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openCard();
    }
  });

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
var typeOfHabitation = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

// Добавление удобств жилья
var addFeaturesOfHabitation = function (arr) {
  var featuresOfHabitation = document.createDocumentFragment();

  arr.forEach(function (feature) {
    var featureOfHabitation = document.createElement('li');
    featureOfHabitation.classList.add('popup__feature', 'popup__feature--' + feature);

    featuresOfHabitation.appendChild(featureOfHabitation);
  });
  return featuresOfHabitation;
};


// Отрисовка карточки с подробностями объявления по шаблону
var renderCard = function (element) {
  var card = cardTemplate.cloneNode(true);
  var cardPhotoTemplate = card.querySelector('.popup__photo');

  card.querySelector('.popup__title').textContent = element.offer.title;
  card.querySelector('.popup__text--address').textContent = element.offer.address;
  card.querySelector('.popup__text--price ').textContent = element.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = typeOfHabitation[element.offer.type];
  card.querySelector('.popup__text--capacity').textContent = element.offer.rooms + ' комнаты для ' + element.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = ' Заезд после ' + element.offer.checkin + ', выезд до ' + element.offer.checkout;
  card.querySelector('.popup__description').textContent = element.offer.description;
  card.querySelector('.popup__avatar').src = element.author.avatar;

  // Удобства жилья
  card.querySelector('.popup__features').innerHTML = '';
  card.querySelector('.popup__features').appendChild(addFeaturesOfHabitation(element.offer.features));

  // Фото жилья
  card.querySelector('.popup__photos').innerHTML = '';

  element.offer.photos.forEach(function (photoSrc) {
    var photo = cardPhotoTemplate.cloneNode(true);
    photo.src = photoSrc;
    card.querySelector('.popup__photos').appendChild(photo);
  });

  return card;
};

// Добавление в разметку карточки с подробностями объявления
var showCard = function (element) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderCard(element));

  // Добавление обработчика событий (закрытие карточки при клике на крестик)
  var cardCloseButton = fragment.querySelector('.popup__close');

  cardCloseButton.addEventListener('click', function () {
    removeActiveCard();
  });
  cardCloseButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      removeActiveCard();
    }
  });

  return map.insertBefore(fragment, filterContainer);
};

// Генерация заданного количества объявлений
var ads = generateAds(ADS_AMOUNT);


// Удаление активных пинов
var removeActivePins = function () {
  // Находим все пины на странице
  var activeAds = mapPinsBlock.querySelectorAll('.map__pin');

  // Удаляем пины, начиная со второго, т.к. первый - главный пин для активации страницы
  if (activeAds.length > 1) {
    for (var i = 1; i < activeAds.length; i++) {
      mapPinsBlock.removeChild(activeAds[i]);
    }
  }
};

// Удаление активной карточки
var removeActiveCard = function () {
  // Находим активную карточку
  var activeCard = map.querySelector('.map__card');

  // Проверяем, есть ли карточка на странице, если да - удаляем
  if (activeCard !== null) {
    map.removeChild(activeCard);
  }
};


// Деактивация элементов
var disableElements = function (arr, boolean) {
  if (boolean === true) {
    arr.forEach(function (element) {
      element.setAttribute('disabled', true);
    });
  }
  if (boolean === false) {
    arr.forEach(function (element) {
      element.removeAttribute('disabled');
    });
  }
};

// Деактивация страницы
var adForm = document.querySelector('.ad-form');
var formsFieldsets = document.querySelectorAll('fieldset');
var filtersSelects = filterContainer.querySelectorAll('select');

var disablePage = function (boolean) {
  if (boolean) {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    // Удаление объявлений и активной карточки
    removeActivePins();
    removeActiveCard();

  } else {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    // Отрисовка объявлений после активации страницы
    renderAds(ads);
  }

  disableElements(formsFieldsets, boolean);
  disableElements(filtersSelects, boolean);
};

// Вызов функции деактивации при загрузке страницы
disablePage(true);


// Активация страницы
var mapPinMain = document.querySelector('.map__pin--main');
var addressInput = document.querySelector('#address');

var setElementsCoords = function (element) {
  var coordX = Math.floor(element.offsetLeft - element.offsetWidth / 2);
  var coordY = Math.floor(element.offsetTop - element.offsetHeight - HEIGHT_OF_THE_TIP);
  addressInput.value = coordX + ', ' + coordY;
};

mapPinMain.addEventListener('mousedown', function () {
  disablePage(false);
  setElementsCoords(mapPinMain);
});

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    disablePage(false);
  }
});

// Валидация
// Соответствие количества комнат количеству гостей
var roomNumber = document.querySelector('#room_number');
var capacity = document.querySelector('#capacity');

var accordanceOfRoomsAndGuests = {
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0']
};

var resetAllValues = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].removeAttribute('disabled');
    arr[i].removeAttribute('selected');
  }
};

var onRoomNumberInput = function (evt) {
  var selectedvalue = parseInt(evt.target.value, 10);
  var possibleNumberOfGuests = accordanceOfRoomsAndGuests[selectedvalue];

  var capacityValues = capacity.options;

  resetAllValues(capacityValues);

  for (var i = 0; i < capacityValues.length; i++) {
    if (!possibleNumberOfGuests.includes(capacityValues[i].value)) {
      capacityValues[i].disabled = 'true';
    } else {
      capacityValues[i].selected = 'true';
    }
  }
};

roomNumber.addEventListener('input', onRoomNumberInput);

// Заголовок объявления
var title = document.querySelector('#title');
title.addEventListener('invalid', function () {
  if (title.validity.tooShort) {
    title.setCustomValidity('Слишком короткий заголовок :(');
  } else if (title.validity.tooLong) {
    title.setCustomValidity('Краткость-сестра таланта! Поменьше слов!');
  } else if (title.validity.valueMissing) {
    title.setCustomValidity('Как же без названия? :(');
  } else {
    title.setCustomValidity('');
  }
});

// Цена
var price = document.querySelector('#price');
price.addEventListener('invalid', function () {
  if (price.validity.rangeOverflow) {
    price.setCustomValidity('Не жадничай. Дороговато');
  } else if (price.validity.rangeUnderflow) {
    price.setCustomValidity('Слишком дёшево за такое предложение');
  } else if (price.validity.valueMissing) {
    price.setCustomValidity('Благотворитетельность - это хорошо, но хоть немного денег придётся взять');
  } else {
    price.setCustomValidity('');
  }
});

// Соответствие типа жилья и минимальной цены
var type = document.querySelector('#type');
var accordanceOfHousingTypeAndMinPrice = {
  flat: '1000',
  bungalo: '0',
  house: '5000',
  palace: '10000'
};

var onHousingTypeInput = function (evt) {
  var selectedType = evt.target.value;
  var minPrice = parseInt(accordanceOfHousingTypeAndMinPrice[selectedType], 10);

  price.setAttribute('min', minPrice);
  price.setAttribute('placeholder', minPrice);
};

type.addEventListener('click', onHousingTypeInput);

// Соответствие времение заезда и выезда
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');

var onTimeInAndOutInput = function (evt) {
  resetAllValues(timeIn.options);
  resetAllValues(timeOut.options);

  var selectedTime = evt.target.value;

  var correlateTimeInAndTimeOut = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value === selectedTime) {
        arr[i].selected = true;
      }
    }
  };

  if (evt.target === timeIn) {
    correlateTimeInAndTimeOut(timeOut.options);
  } else {
    correlateTimeInAndTimeOut(timeIn.options);
  }
};

timeIn.addEventListener('input', onTimeInAndOutInput);
timeOut.addEventListener('input', onTimeInAndOutInput);
