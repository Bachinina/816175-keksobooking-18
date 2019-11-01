'use strict';

(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  window.filter = function (data) {
    // Данные, полученные с сервера
    var ads = data.slice();

    // Вспомогательная переменная
    var currentParameters = {
      type: 'any',
      rooms: 'any',
      guests: 'any',
      price: 'any',
      features: []
    };

    // Фильтры
    var housingType = document.querySelector('#housing-type');
    var housingPrice = document.querySelector('#housing-price');
    var housingRooms = document.querySelector('#housing-rooms');
    var housingGuests = document.querySelector('#housing-guests');
    var housingFeatures = document.querySelector('#housing-features');

    var checkValue = function (ad, value) {
      if (currentParameters[value] !== 'any') {
        return ad.offer[value].toString() === currentParameters[value];
      } else {
        return true;
      }
    };

    var checkPrice = function (ad, price) {
      if (currentParameters[price] !== 'any') {
        var level;

        if (ad.offer[price] <= LOW_PRICE) {
          level = 'low';
        }
        if (ad.offer[price] >= HIGH_PRICE) {
          level = 'high';
        }
        if (ad.offer[price] >= LOW_PRICE && ad.offer.price <= HIGH_PRICE) {
          level = 'middle';
        }
        return level === currentParameters[price];
      } else {
        return true;
      }
    };

    var checkFeatures = function (features) {
      var currentFeatures = currentParameters.features;
      var count = 0;

      currentFeatures.forEach(function (feature) {
        if (features.indexOf(feature) !== -1) {
          count++;
        }
      });
      return currentFeatures.length === count;
    };

    var filter = function () {
      var filtredAds = ads
        .filter(function (ad) {
          return checkValue(ad, 'type');
        })
        .filter(function (ad) {
          return checkValue(ad, 'rooms');
        })
        .filter(function (ad) {
          return checkValue(ad, 'guests');
        })
        .filter(function (ad) {
          return checkPrice(ad, 'price');
        })
        .filter(function (ad) {
          return checkFeatures(ad.offer.features);
        });
      window.map.renderPins(filtredAds);
    };


    // Функции для обработки событий
    var onSelectInput = window.debounce(function (evt, parameter) {
      currentParameters[parameter] = evt.target.value;
      filter();
    });

    var onFeaturesCheck = window.debounce(function () {
      var selectedFeatures = housingFeatures.querySelectorAll('.map__checkbox:checked');
      var features = [];
      selectedFeatures.forEach(function (feature) {
        features.push(feature.value);
      });
      currentParameters.features = features;
      filter();
    });


    // Обработка событий
    housingType.addEventListener('input', function (evt) {
      onSelectInput(evt, 'type');
    });

    housingPrice.addEventListener('input', function (evt) {
      onSelectInput(evt, 'price');
    });

    housingRooms.addEventListener('input', function (evt) {
      onSelectInput(evt, 'rooms');
    });

    housingGuests.addEventListener('input', function (evt) {
      onSelectInput(evt, 'guests');
    });

    housingFeatures.addEventListener('input', onFeaturesCheck);
  };
})();
