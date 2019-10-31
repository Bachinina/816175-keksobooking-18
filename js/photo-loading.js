'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  window.photoLoading = function (fileChooser, previewBlock, updateImg) {
    fileChooser.addEventListener('change', function () {
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (type) {
        return fileName.endsWith(type);
      });

      if (matches) {
        var reader = new FileReader();
        var onImgLoad = function (evt) {
          if (updateImg) {
            var updatedImg = previewBlock.querySelector('img');
            updatedImg.src = evt.target.result;
          } else {
            previewBlock.innerHTML = '';
            var loadedImg = document.createElement('img');
            loadedImg.src = evt.target.result;
            loadedImg.style = 'max-width: 100%;';
            previewBlock.appendChild(loadedImg);
          }
        };
        reader.readAsDataURL(file);
        reader.addEventListener('load', onImgLoad);
      }
    });
  };
})();
