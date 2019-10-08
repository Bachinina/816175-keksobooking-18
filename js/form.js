'use strict';

// Работа формы и валидация

(function () {
  // Валидация
  // Соответствие количества комнат количеству гостей
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');

  var accordanceOfRoomsAndGuests = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  var resetAllValues = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].removeAttribute('disabled');
      arr[i].removeAttribute('selected');
    }
  };

  var onRoomNumberInput = function (evt) {
    var selectedvalue = parseInt(evt.target.value, 10);
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
  };

  roomNumber.addEventListener('input', onRoomNumberInput);

  // Заголовок объявления
  var title = document.querySelector('#title');
  title.addEventListener('invalid', function () {
    if (title.validity.tooShort) {
      title.setCustomValidity('Слишком короткий заголовок :(');
    } else if (title.validity.tooLong) {
      title.setCustomValidity('Краткость-сестра таланта! Поменьше слов!');
    } else if (title.validity.valueMissing) {
      title.setCustomValidity('Как же без названия? :(');
    } else {
      title.setCustomValidity('');
    }
  });

  // Цена
  var price = document.querySelector('#price');
  price.addEventListener('invalid', function () {
    if (price.validity.rangeOverflow) {
      price.setCustomValidity('Не жадничай. Дороговато');
    } else if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Слишком дёшево за такое предложение');
    } else if (price.validity.valueMissing) {
      price.setCustomValidity('Благотворитетельность - это хорошо, но хоть немного денег придётся взять');
    } else {
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

  var onTimeInAndOutInput = function (evt) {
    resetAllValues(timeIn.options);
    resetAllValues(timeOut.options);

    var selectedTime = evt.target.value;

    var correlateTimeInAndTimeOut = function (arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].value === selectedTime) {
          arr[i].selected = true;
        }
      }
    };

    if (evt.target === timeIn) {
      correlateTimeInAndTimeOut(timeOut.options);
    } else {
      correlateTimeInAndTimeOut(timeIn.options);
    }
  };

  timeIn.addEventListener('input', onTimeInAndOutInput);
  timeOut.addEventListener('input', onTimeInAndOutInput);
})();
