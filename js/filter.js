'use strict';

(function () {
  window.filter = function (data) {
    // Данные, полученные с сервера
    var ads = data;

    // Вспомогательные переменные
    var type;

    // Фильтры
    var housingType = document.querySelector('#housing-type');

    // Фильтрация
    var filterByHousingType = function () {
      window.map.renderPins(ads.slice().filter(function (ad) {
        return ad.offer.type === type;
      }));
    };

    // Обработка событий
    housingType.addEventListener('input', function (evt) {
      type = evt.target.value;
      if (type === 'any') {
        window.map.renderPins(ads);
      } else {
        filterByHousingType();
      }
    });
  };
})();
