'use strict';

// Общая настройка страницы: активация/ деактивация; настройка объявлений

(function () {

  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var formsFieldsets = document.querySelectorAll('fieldset');

  // Главный пин и его координаты по умолчанию
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPinMainDefaultCoords = {
    top: 375,
    left: 570
  };
  var setMapPinMainDefaultCoords = function () {
    mapPinMain.style.top = mapPinMainDefaultCoords.top + 'px';
    mapPinMain.style.left = mapPinMainDefaultCoords.left + 'px';
  };


  // Загрузка данных с сервера
  var URL = 'https://js.dump.academy/keksobooking/data';

  var onLoad = function (response) {
    window.map.renderPins(response);
    window.filter(response);
  };

  window.settings = {
    // Деактивация страницы
    disablePage: function (boolean) {
      if (boolean) {
        map.classList.add('map--faded');
        adForm.classList.add('ad-form--disabled');
        // Удаление объявлений и активной карточки
        window.map.removeActivePins();
        window.map.removeActiveCard();
        window.map.setMapMainPinCoords(true);
        mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);
        mapPinMain.addEventListener('keydown', onMapPinMainKeydown);
        setMapPinMainDefaultCoords();
      } else {
        map.classList.remove('map--faded');
        adForm.classList.remove('ad-form--disabled');
        mapPinMain.removeEventListener('mousedown', onMapPinMainMousedown);
        mapPinMain.removeEventListener('keydown', onMapPinMainKeydown);
      }

      window.utils.disableElements(formsFieldsets, boolean);
    }
  };

  var onMapPinMainMousedown = function () {
    window.settings.disablePage(false);
    window.backend.xhRequest('GET', URL, onLoad, window.error, null);
  };

  var onMapPinMainKeydown = function (evt) {
    window.utils.isEnterKeyCode(evt, window.settings.disablePage(false));
    window.backend.xhRequest('GET', URL, onLoad, window.error, null);
  };

  // Вызов функции деактивации при загрузке страницы
  window.settings.disablePage(true);
})();
