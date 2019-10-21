'use strict';

(function () {
  var RESPONSE_JSON_TYPE = 'json';
  var TIMEOUT = 10000;

  window.backend = {
    xhRequest: function (method, url, onLoad, onError, data) {
      var SUCCESS_CODE = 200;

      var xhr = new XMLHttpRequest();
      xhr.responseType = RESPONSE_JSON_TYPE;

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_CODE) {
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

      xhr.timeout = TIMEOUT;
      xhr.open(method, url);
      xhr.send(data);
    }
  };
})();
