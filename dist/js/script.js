const cityOpen = document.querySelector('.js-city-open');
const city = document.querySelector('.city');

cityOpen.addEventListener('click', () => {
  city.classList.add('city_open')
});

city.addEventListener('click', (e) => {
  e.preventDefault();
  const target = e.target.closest('.city__choice');
  if (target) {
    cityOpen.textContent = target.textContent;
    city.classList.remove('city_open');
  }
});


$('.header__burger').on('click', function () {

  $('.navigation').animate({
    left: 0,
  }, 500, function () {
    $('.navigation__close').animate({
      opacity: 1,
    }, 300);
  });
});

$('.navigation__close').on('click', function () {
  $('.navigation__close').animate({
    opacity: 0,
  }, 300, function () {
    $('.navigation').animate({
      left: '-400px',
    }, 500);
  });
});


$('.present__btn').on('click', function () {
  $('.modal-order').show(300);
})

$('.modal-order__close').on('click', function () {
  $('.modal-order').hide(300);
})


$('.header__sign, .header__sign2').click(() => {
  $('.alert').attr("role", "alert");

  $('.alert').addClass('visible');
  setTimeout(() => {
    $('.alert').removeClass('visible');

    $('.alert').removeAttr("role", "alert");

  }, 3000)
})

const characteristicsListElem = document.querySelector('.characteristics__list');
const characteristicsItemElems = document.querySelectorAll('.characteristics__item');

characteristicsItemElems.forEach(elem => {
  if (elem.children[1].classList.contains('active')) {
    elem.children[1].style.height = `${elem.children[1].scrollHeight}px`;
  }
})

const open = (button, dropDown) => {
  closeAllDrops(button, dropDown);
  button.ariaExpanded = true;

  dropDown.style.height = `${dropDown.scrollHeight}px`;
  button.classList.add('active');
  dropDown.classList.add('active');
};

const close = (button, dropDown) => {
  button.ariaExpanded = false;
  button.classList.remove('active');
  dropDown.classList.remove('active');
  dropDown.style.height = '';
};

const closeAllDrops = (button, dropDown) => {
  characteristicsItemElems.forEach((elem) => {
    if (elem.children[0] !== button && elem.children[1] !== dropDown) {
      close(elem.children[0], elem.children[1]);
    }
  });
};

characteristicsListElem.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('characteristics__title')) {
    const parent = target.closest('.characteristics__item');
    const description = parent.querySelector('.characteristics__description');
    description.classList.contains('active')
      ? close(target, description)
      : open(target, description);
  }
});

const modalOrderFielfset = document.querySelector('.modal-order__fielfset');
const modalOrderTitle = document.querySelector('.modal-order__title');
const cookieAlert = document.querySelector('.alert-cookie');
const cookieButton = document.querySelector('.alert-cookie__button');

cookieButton.addEventListener('click', () => {
  cookieAlert.classList.remove('alert-cookie_no-ready');
  Cookies.set('dom-ready-cookie', 'true', {
    expires: 10,
  })
});

if (!Cookies.get('dom-ready-cookie', 'true')) {
  cookieAlert.classList.add('alert-cookie_no-ready');
};

const inputTel = document.querySelector('.modal-order__input_tel');
const telMask = new Inputmask('+7 (999)-999-99-99');
telMask.mask(inputTel);

const justValidate = new JustValidate('.modal-order__form');

justValidate
  .addField('.modal-order__input', [
    {
      rule: 'required',
      errorMessage: 'Укажите ваше имя',
    },
    {
      rule: 'minLength',
      value: 3,
      errorMessage: 'Не короче 3-х символов',
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Не длинее 30-и символов',
    },
  ])
  .addField('.modal-order__input_email', [
    {
      rule: 'required',
      errorMessage: 'Укажите ваш email',
    },
    {
      rule: 'email',
      errorMessage: 'email не корректный!',
    },
  ])
  .addField('.modal-order__input_tel', [
    {
      rule: 'required',
      errorMessage: 'Укажите ваш телефон',
    },
    {
      validator(value) {
        const phone = inputTel.inputmask.unmaskedvalue();
        console.log(phone);
        return !!(Number(phone) && phone.length === 10);
      },
      errorMessage: 'Телефон не корректный!'
    },
  ])
  .onSuccess(eve => {
    const target = eve.target;
    axios.post('https://jsonplaceholder.typicode.com/posts', {
      name: target.name.value,
      tel: inputTel.inputmask.unmaskedvalue(),
      // tel: target.tel.value,
      email: target.email.value,
    })
      .then(response => {
        target.reset();
        modalOrderFielfset.disabled = true;
        modalOrderTitle.textContent = `Спасибо, ваша заявка принята. Номер заявки ${response.data.id}`
      })
      .catch(err => {
        console.error(err);
        modalOrderFielfset.disabled = false;
        modalOrderTitle.textContent = `Что-то пошло не так, попробуйте позже`
      });
  });

const swiper = new Swiper('.swiper', {
  // Optional parameters
  slidesPerView: 3,
  loop: true,
  // autoplay: {
  //   delay: 2000,
  // },
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    // nextEl: '.swiper-button-next',
    // prevEl: '.swiper-button-prev',
    nextEl: '.slider__button-right',
    prevEl: '.slider__button-left',
  },
  mousewheel: true,
  keyboard: true,
  // And if we need scrollbar
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },
  breakpoints: {
    // when window width is >= 320px
    320: {
      direction: 'vertical',
      slidesPerView: 1,
      spaceBetween: 5
    },
    // when window width is >= 480px
    480: {
      direction: 'horizontal',
      slidesPerView: 2,
      spaceBetween: 10
    },
    // when window width is >= 640px
    678: {
      slidesPerView: 3,
      spaceBetween: 20
    }
  }
});

$('.acc__list').accordion({
  active: true,
  collapsible: true,
  heightStyle: 'content',
  icons: {
    header: 'acc__accord',
    activeHeader: 'acc__accord acc__accord-active',
  }
});

ymaps.ready(init);
function init() {
  const myMap = new ymaps.Map("map_kant", {
    center: [54.706259, 20.511145],
    zoom: 17
  });

  const mark = new ymaps.Placemark([54.706259, 20.511145], {}, {
    iconLayout: 'default#image',
    iconImageHref: 'img/pin.svg',
    iconImageSize: [60, 60],
    iconImageOffset: [-25, -60],
  });
  const bridge = new ymaps.Placemark([54.706006, 20.513785], {
    hintContent: 'Медовый мост',
    balloonContent: '<div class="acc__title">Середина моста</div>'
  }, {
    iconLayout: 'default#image',
    iconImageHref: 'img/pin.svg',
    iconImageSize: [50, 50],
    iconImageOffset: [-25, -10],
  });

  myMap.geoObjects.add(mark).add(bridge);

  /* myMap.behaviors.disable('scrollZoom'); // запрещает зум колёсиком мыши
   myMap.behaviors.disable('drag'); // запрещает скролл свайпом
   myMap.controls.remove('geolocationControl'); // удаляет геолокацию (мое местоположение)
   myMap.controls.remove('searchControl'); //  удаляет поиск
   myMap.controls.remove('trafficControl'); //  удаляет контроль трафика
   myMap.controls.remove('typeSelector'); //  удаляет тип
   myMap.controls.remove('fullscreenControl'); // удаляет переход в полноэкранный режим
   myMap.controls.remove('zoomControl'); // удаляет контроль зума
   myMap.controls.remove('rulerControl'); // удаляет контроль правил
   */
}