'use strict';

(function () {
  window.success = function () {
    // Шаблон, копирование
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successBlock = successTemplate.cloneNode(true);

    // Обработчики событий
    var onSuccessBlockEscPress = function (evt) {
      window.utils.isEscKeyCode(evt, closeSuccessBlock);
    };

    var closeSuccessBlock = function () {
      document.querySelector('main').removeChild(successBlock);
      document.removeEventListener('keydown', onSuccessBlockEscPress);
    };

    document.addEventListener('keydown', onSuccessBlockEscPress);
    successBlock.addEventListener('click', function () {
      closeSuccessBlock();
    });

    document.querySelector('main').append(successBlock);
  };
})();
