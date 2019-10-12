'use strict';

(function () {
  window.backend = {
    xhRequest: function (method, url, onLoad, onError, data) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('cтатус ответа - ' + xhr.status + ' ' + xhr.statusText, method, url, onLoad, data);
        }
      });

      xhr.addEventListener('error', function () {
        onError('неполадки с соединением :(', method, url, onLoad, data);
      });

      xhr.addEventListener('timeout', function () {
        onError('запрос не успел выполниться за ' + xhr.timeout + 'мс', method, url, onLoad, data);
      });

      xhr.timeout = 10000;
      xhr.open(method, url);
      xhr.send(data);
    }
  };
})();
