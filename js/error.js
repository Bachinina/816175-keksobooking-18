'use strict';

(function () {
  window.error = function (error, method, url, onLoad, data) {
    // Шаблон, копирование
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorLayout = errorTemplate.cloneNode(true);

    // Вывод текста ошибка
    errorLayout.querySelector('.error__message').textContent = 'Произошла ошибка: ' + error;

    // Кнопка повторного запроса серверу
    var reloadButton = errorLayout.querySelector('.error__button');
    reloadButton.addEventListener('click', function () {
      document.body.removeChild(document.body.querySelector('.error'));
      window.backend.xhRequest(method, url, onLoad, window.error, data);
    });

    document.body.append(errorLayout);
  };
})();
