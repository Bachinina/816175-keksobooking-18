'use strict';

// Общая настройка страницы: активация/ деактивация; настройка объявлений

(function () {

  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var formsFieldsets = document.querySelectorAll('fieldset');
  var mapPinMain = document.querySelector('.map__pin--main');


  // Загрузка данных с сервера
  var URL = 'https://js.dump.academy/keksobooking/data';

  var onLoad = function (response) {
    window.map.renderPins(response);
  };

  // Деактивация страницы
  var disablePage = function (boolean) {
    if (boolean) {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      // Удаление объявлений и активной карточки
      window.map.removeActivePins();
      window.map.removeActiveCard();
    } else {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
    }

    window.utils.disableElements(formsFieldsets, boolean);
  };

  // Активация страницы
  mapPinMain.addEventListener('mousedown', function () {
    disablePage(false);
    window.backend.xhRequest('GET', URL, onLoad, window.error, null);

  });

  mapPinMain.addEventListener('keydown', function (evt) {
    window.utils.isEnterKeyCode(evt, disablePage(false));
  });

  // Вызов функции деактивации при загрузке страницы
  disablePage(true);
})();
