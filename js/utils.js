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

    // Деактивация элементов
    disableElements: function (arr, flag) {
      if (flag === true) {
        arr.forEach(function (element) {
          element.disabled = true;
        });
      }
      if (flag === false) {
        arr.forEach(function (element) {
          element.disabled = false;
        });
      }
    }
  };
})();
