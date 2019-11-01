'use strict';

// Работа формы и валидация

(function () {

  // Соответствие количества комнат количеству гостей
  var form = document.querySelector('.ad-form');
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');
  var resetButton = document.querySelector('.ad-form__reset');

  var accordanceOfRoomsAndGuests = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  var resetAllValues = function (arr) {
    Array.prototype.slice.call(arr).forEach(function (element) {
      element.disabled = false;
      element.selected = false;
    });
  };

  window.form = {
    onRoomNumberInput: function (evt) {
      var selectedvalue;

      if (evt !== undefined) {
        selectedvalue = parseInt(evt.target.value, 10);
      } else {
        selectedvalue = 1;
      }
      var possibleNumberOfGuests = accordanceOfRoomsAndGuests[selectedvalue];
      var capacityValues = capacity.options;

      resetAllValues(capacityValues);

      for (var i = 0; i < capacityValues.length; i++) {
        if (!possibleNumberOfGuests.includes(capacityValues[i].value)) {
          capacityValues[i].disabled = 'true';
        } else {
          capacityValues[i].selected = 'true';
        }
      }
    }
  };

  roomNumber.addEventListener('input', window.form.onRoomNumberInput);

  // Заголовок объявления
  var title = document.querySelector('#title');
  title.addEventListener('input', function () {
    title.style.border = '1px solid red';
    if (title.validity.tooShort) {
      title.setCustomValidity('Слишком короткий заголовок :(');
    } else if (title.validity.tooLong) {
      title.setCustomValidity('Краткость-сестра таланта! Поменьше слов!');
    } else if (title.validity.valueMissing) {
      title.setCustomValidity('Как же без названия? :(');
    } else {
      title.style.border = 'none';
      title.setCustomValidity('');
    }
  });

  // Цена
  var price = document.querySelector('#price');
  price.addEventListener('input', function () {
    price.style.border = '1px solid red';
    if (price.validity.rangeOverflow) {
      price.setCustomValidity('Не жадничай. Дороговато');
    } else if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Слишком дёшево за такое предложение');
    } else if (price.validity.valueMissing) {
      price.setCustomValidity('Благотворитетельность - это хорошо, но хоть немного денег придётся взять');
    } else {
      price.style.border = 'none';
      price.setCustomValidity('');
    }
  });

  // Соответствие типа жилья и минимальной цены
  var type = document.querySelector('#type');
  var accordanceOfHousingTypeAndMinPrice = {
    flat: '1000',
    bungalo: '0',
    house: '5000',
    palace: '10000'
  };


  var onHousingTypeInput = function (evt) {
    var selectedType = evt.target.value;
    var minPrice = parseInt(accordanceOfHousingTypeAndMinPrice[selectedType], 10);

    price.setAttribute('min', minPrice);
    price.setAttribute('placeholder', minPrice);
  };

  type.addEventListener('click', onHousingTypeInput);

  // Соответствие времени заезда и выезда
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');

  var onTimeInInput = function (e) {
    timeOut.value = e.target.value;
  };

  var onTimeOutInput = function (e) {
    timeIn.value = e.target.value;
  };

  timeIn.addEventListener('input', onTimeInInput);
  timeOut.addEventListener('input', onTimeOutInput);

  // Загрузка аватара
  var avatarChooser = form.querySelector('.ad-form__field input[type="file"]');
  var avatar = form.querySelector('.ad-form-header__preview');
  var defaultAvatar = avatar.querySelector('img').src;
  window.photoLoading(avatarChooser, avatar, true);

  // Загрузка фото
  var photoChooser = form.querySelector('.ad-form__upload input[type="file"]');
  var photo = form.querySelector('.ad-form__photo');
  window.photoLoading(photoChooser, photo, false);

  // Сброс данных
  var filter = document.querySelector('.map__filters');
  var resetAllPageValues = function () {
    form.reset();
    filter.reset();
    window.settings.disablePage(true);
    title.style.border = 'none';
    price.style.border = 'none';
    avatar.querySelector('img').src = defaultAvatar;
    photo.innerHTML = '';
  };

  resetButton.addEventListener('click', function () {
    resetAllPageValues();
  });

  // Отправка формы на сервер
  var onLoad = function () {
    resetAllPageValues();
    window.success();
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.xhRequest(form.method, form.action, onLoad, window.error, new FormData(form));
  });
})();
