'use strict';

// Общедоступные, служебные функции

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.utils = {
    isEscKeyCode: function (evt, func) {
      if (evt.keyCode === ESC_KEYCODE) {
        func();
      }
    },

    isEnterKeyCode: function (evt, func) {
      if (evt.keyCode === ENTER_KEYCODE) {
        func();
      }
    },

    // Выбор случайного элемента массива
    selectRandomElement: function (arr) {
      var randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    },

    // Генерация случайного числа в заданном диапазоне
    generateRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    // Генерация массива случайной длины с набором элементов в случайном порядке
    generateRandomArray: function (arr) {
      var j;
      var temp;
      for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
      }
      return arr.slice(0, window.utils.generateRandomNumber(1, arr.length + 1));
    },
    // Деактивация элементов
    disableElements: function (arr, boolean) {
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
    }
  };
})();
