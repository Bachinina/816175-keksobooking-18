'use strict';

(function () {
  window.error = function (error, method, url, onLoad, data) {
    // Шаблон, копирование
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorBlock = errorTemplate.cloneNode(true);

    // Вывод текста ошибки
    errorBlock.querySelector('.error__message').textContent = 'Произошла ошибка: ' + error;


    // Обработчики событий
    var onErrorBlockEscPress = function (evt) {
      window.utils.isEscKeyCode(evt, closeErrorBlock);
    };

    var closeErrorBlock = function () {
      document.body.removeChild(errorBlock);
      document.removeEventListener('keydown', onErrorBlockEscPress);
    };

    document.addEventListener('keydown', onErrorBlockEscPress);
    errorBlock.addEventListener('click', function () {
      closeErrorBlock();
    });


    // Кнопка повторного запроса серверу
    var reloadButton = errorBlock.querySelector('.error__button');
    reloadButton.addEventListener('click', function () {
      closeErrorBlock();
      window.backend.xhRequest(method, url, onLoad, window.error, data);
    });

    document.body.querySelector('main').append(errorBlock);
  };
})();
