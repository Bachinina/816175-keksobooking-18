'use strict';

// Общая настройка страницы: активация/ деактивация; настройка объявлений

(function () {

  // Количество объявлений, которое нужно отрисовать
  var ADS_AMOUNT = 8;

  // Генерация объявлений
  var ads = window.ads.generateAds(ADS_AMOUNT);

  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var formsFieldsets = document.querySelectorAll('fieldset');
  var mapPinMain = document.querySelector('.map__pin--main');

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
      // Отрисовка объявлений после активации страницы
      window.map.renderPins(ads);
    }

    window.utils.disableElements(formsFieldsets, boolean);
  };


  // Активация страницы
  mapPinMain.addEventListener('mousedown', function () {
    disablePage(false);
  });

  mapPinMain.addEventListener('keydown', function (evt) {
    window.utils.isEnterKeyCode(evt, disablePage(false));
  });

  // Вызов функции деактивации при загрузке страницы
  disablePage(true);
})();
