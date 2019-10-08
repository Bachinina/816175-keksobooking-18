'use strict';

// Данные для создания объявлений.
// Экспорт функции, которая их генерирует.

(function () {
  // Общие данные для генерации объявлений
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var titles = ['Большая квартира', 'Маленькая квартирка', 'Хоромы', 'Бабушкина хата', 'Коробка под мостом'];
  var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 4;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 6;

  // Данные о координатах для вычисления адреса
  var X_COORDS_MIN = 0;
  var Y_COORDS_MIN = 130;
  var Y_COORDS_MAX = 630;

  var map = document.querySelector('.map');
  var X_COORDS_MAX = map.offsetWidth;

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
      x: window.utils.generateRandomNumber(X_COORDS_MIN, X_COORDS_MAX),
      y: window.utils.generateRandomNumber(Y_COORDS_MIN, Y_COORDS_MAX)
    };
  };

  window.ads = {
    coords: {
      xMin: X_COORDS_MIN,
      xMax: X_COORDS_MAX,
      yMin: Y_COORDS_MIN,
      yMax: Y_COORDS_MAX,
    },

    // Генерация объявлений
    generateAds: function (quantity) {
      var adsArray = [];
      var avatars = generateUserAvatars(quantity);

      for (var i = 0; i < quantity; i++) {
        var computedAddress = computeAddress();

        adsArray[i] = {
          author: {
            avatar: avatars[i]
          },

          offer: {
            title: window.utils.selectRandomElement(titles),
            address: computedAddress.x + ', ' + computedAddress.y,
            price: window.utils.generateRandomNumber(MIN_PRICE, MAX_PRICE),
            type: window.utils.selectRandomElement(TYPES),
            rooms: window.utils.generateRandomNumber(MIN_ROOMS, MAX_ROOMS),
            guests: window.utils.generateRandomNumber(MIN_GUESTS, MAX_GUESTS),
            checkin: window.utils.selectRandomElement(CHECKIN),
            checkout: window.utils.selectRandomElement(CHECKOUT),
            features: window.utils.generateRandomArray(FEATURES),
            description: '',
            photos: window.utils.generateRandomArray(photos)
          },

          location: computedAddress
        };
      }
      return adsArray;
    }
  };
}());
