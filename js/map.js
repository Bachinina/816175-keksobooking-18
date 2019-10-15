'use strict';

// Работа карты: отрисовка и поведение пинов и карточек

(function () {
  // Количество пинов на странице
  var NUMBER_OF_PINS = 5;

  // Данные о координатах для вычисления адреса
  var X_COORDS_MIN = 0;
  var Y_COORDS_MIN = 130;
  var Y_COORDS_MAX = 630;

  var map = document.querySelector('.map');
  var X_COORDS_MAX = map.offsetWidth;

  // Инфо о типе жилья (для отрисовки карточки)
  var typeOfHabitation = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var mapPinsBlock = document.querySelector('.map__pins');
  var filterContainer = document.querySelector('.map__filters-container');

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var mapPinMain = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');


  // Отрисовка объявления по шаблону
  var renderPin = function (element) {
    var pin = pinTemplate.cloneNode(true);

    pin.style.left = element.location.x - pin.offsetWidth / 2 + 'px';
    pin.style.top = element.location.y - pin.offsetHeight + 'px';
    pin.querySelector('img').src = element.author.avatar;
    pin.querySelector('img').alt = element.offer.title;

    // Добавление обработчиков событий
    var onCardEscPress = function (evt) {
      window.utils.isEscKeyCode(evt, closeCard);
    };

    // Открыть карточку: удалить предыдущую, если она есть; отрисовать новую
    var openCard = function () {
      window.map.removeActiveCard();
      window.map.showCard(element);
      // При нажатии на ESC закрыть карточку
      document.addEventListener('keydown', onCardEscPress);
    };

    // Закрыть карточку: удалить текущую
    var closeCard = function () {
      window.map.removeActiveCard();
      // Удаление обработчика нажатия на ESC
      document.removeEventListener('keydown', onCardEscPress);
    };

    // Открытие карточки
    pin.addEventListener('click', function () {
      openCard();
    });
    pin.addEventListener('keydown', function (evt) {
      window.utils.isEnterKeyCode(evt, openCard);
    });

    return pin;
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
    card
      .querySelector('.popup__features')
      .appendChild(addFeaturesOfHabitation(element.offer.features));

    // Фото жилья
    card.querySelector('.popup__photos').innerHTML = '';

    element.offer.photos.forEach(function (photoSrc) {
      var photo = cardPhotoTemplate.cloneNode(true);
      photo.src = photoSrc;
      card.querySelector('.popup__photos').appendChild(photo);
    });

    return card;
  };

  // Перемещение главного пина на карте
  var onmapPinMainMousedown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var isOnlyMouseClick = true;

    var onmapPinMainMousemove = function (moveEvt) {
      moveEvt.preventDefault();

      isOnlyMouseClick = false;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentX = mapPinMain.offsetLeft - shift.x;
      var currentY = mapPinMain.offsetTop - shift.y;

      if (currentX >= X_COORDS_MIN - mapPinMain.offsetWidth / 2 && currentX <= X_COORDS_MAX - mapPinMain.offsetWidth / 2) {
        mapPinMain.style.left = currentX + 'px';
      }
      if (currentY >= Y_COORDS_MIN && currentY <= Y_COORDS_MAX) {
        mapPinMain.style.top = currentY + 'px';
      }
      window.map.setMapMainPinCoords();
    };

    var onmapPinMainMouseup = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onmapPinMainMousemove);
      document.removeEventListener('mouseup', onmapPinMainMouseup);

      if (isOnlyMouseClick) {
        window.map.setMapMainPinCoords();
      }
    };

    document.addEventListener('mousemove', onmapPinMainMousemove);
    document.addEventListener('mouseup', onmapPinMainMouseup);
  };

  mapPinMain.addEventListener('mousedown', onmapPinMainMousedown);


  window.map = {
    // Добавление пинов в разметку
    renderPins: function (arr) {
      window.map.removeActivePins();
      var fragment = document.createDocumentFragment();

      arr.slice(0, NUMBER_OF_PINS).forEach(function (pin) {
        fragment.appendChild(renderPin(pin));
      });
      return mapPinsBlock.appendChild(fragment);
    },

    // Добавление в разметку карточки с подробностями объявления
    showCard: function (element) {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(renderCard(element));

      // Добавление обработчика событий (закрытие карточки при клике на крестик)
      var cardCloseButton = fragment.querySelector('.popup__close');

      cardCloseButton.addEventListener('click', function () {
        window.map.removeActiveCard();
      });
      cardCloseButton.addEventListener('keydown', function (evt) {
        window.utils.isEnterKeyCode(evt, window.map.removeActiveCard);
      });

      return map.insertBefore(fragment, filterContainer);
    },

    // Удаление активных пинов (объявлений)
    removeActivePins: function () {
      // Находим все пины на странице
      var activeAds = mapPinsBlock.querySelectorAll('.map__pin');

      // Удаляем пины, начиная со второго, т.к. первый - главный пин для активации страницы
      if (activeAds.length > 1) {
        for (var i = 1; i < activeAds.length; i++) {
          mapPinsBlock.removeChild(activeAds[i]);
        }
      }
    },

    // Удаление активной карточки
    removeActiveCard: function () {
      // Находим активную карточку
      var activeCard = map.querySelector('.map__card');

      // Проверяем, есть ли карточка на странице, если да - удаляем
      if (activeCard !== null) {
        map.removeChild(activeCard);
      }
    },

    // Расчет координат главного пина
    setMapMainPinCoords: function (isDefaultPage) {
      // Высота метки главного пина
      var HEIGHT_OF_THE_TIP = 22;
      if (isDefaultPage) {
        HEIGHT_OF_THE_TIP = 0;
      }

      var coordX = Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2);
      var coordY = Math.round(mapPinMain.offsetTop + mapPinMain.offsetHeight + HEIGHT_OF_THE_TIP);
      addressInput.value = coordX + ', ' + coordY;
    }
  };
})();
