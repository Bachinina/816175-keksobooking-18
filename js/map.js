'use strict';

// Работа карты: активация/деактивация, отрисовка и поведение пинов и карточек

(function () {
  // Количество объявлений, которое нужно отрисовать
  var ADS_AMOUNT = 8;
  // Высота метки главного пина (для правильного вычисления его координат)
  var HEIGHT_OF_THE_TIP = 22;

  // Инфо о типе жилья (для отрисовки карточки)
  var typeOfHabitation = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var map = document.querySelector('.map');
  var mapPinsBlock = document.querySelector('.map__pins');
  var filterContainer = document.querySelector('.map__filters-container');

  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  // Генерация объявлений
  var ads = window.ads.generateAds(ADS_AMOUNT);


  // Отрисовка объявления по шаблону
  var renderAd = function (element) {
    var ad = adTemplate.cloneNode(true);

    ad.style.left = element.location.x - ad.offsetWidth / 2 + 'px';
    ad.style.top = element.location.y - ad.offsetHeight + 'px';
    ad.querySelector('img').src = element.author.avatar;
    ad.querySelector('img').alt = element.offer.title;

    // Добавление обработчиков событий
    var onCardEscPress = function (evt) {
      window.utils.isEscKeyCode(evt, closeCard);
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
      window.utils.isEnterKeyCode(evt, openCard);
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
      window.utils.isEnterKeyCode(evt, removeActiveCard);
    });

    return map.insertBefore(fragment, filterContainer);
  };

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

  // Деактивация страницы
  var adForm = document.querySelector('.ad-form');
  var formsFieldsets = document.querySelectorAll('fieldset');

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

    window.utils.disableElements(formsFieldsets, boolean);
  };


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
    window.utils.isEnterKeyCode(evt, disablePage(false));
  });

  // Вызов функции деактивации при загрузке страницы
  disablePage(true);
})();
