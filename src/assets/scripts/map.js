const template = require('../templates/popup/comment.hbs');

ymaps.ready(init);

export default function init() {
    const popup = document.querySelector('.geo-popup');
    const popupClose = document.querySelector('.geo-popup__btn-close');
    const sendButton = document.querySelector('.geo-popup__form__btn-send');
    const nameInput = document.querySelector('#name-input');
    const placeInput = document.querySelector('#place-input');
    const textarea = document.querySelector('#text-textarea');
    const commentList = document.querySelector('.geo-popup__comment-list');

    let storage = localStorage;

    var myPlacemark,
        myMap = new ymaps.Map('map', {
            center: [55.753994, 37.622093],
            zoom: 12,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Добавим на карту ползунок масштаба.    
    myMap.controls.add('zoomControl');

    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        


        var coords = e.get('coords');

        // Создаем метку.
        myPlacemark = createPlacemark(coords);
        myMap.geoObjects.add(myPlacemark);
        getAddress(coords);
        
        popup.style.position = 'absolute';
        popup.classList.add('is-active');
        // console.log(storage.data);
        const sumCoords = Math.round(sumArr(coords));

        console.log(sumCoords);

    });


    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#redDotIconWithCaption',
            draggable: false,
            visible: true
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()
                });
        });
    }

    popupClose.addEventListener('click', () =>{
        popup.classList.remove('is-active');
    })

    sendButton.addEventListener('click', (e) => {
        e.preventDefault();

        // const date = new Date();
        // const day = date.getDay();
        // const mounth = date.getMonth();
        // const year = date.getFullYear();
        // const time = day + "." + mounth + "." + year;

        // storage.data = JSON.stringify({
        //     list: [
        //         {
        //             name: nameInput.value,
        //             place: placeInput.value,
        //             comment: textarea.value,
        //             date: time
        //         }
        //     ]
        // });

        commentList.innerHTML = template(JSON.parse(localStorage.data));

        nameInput.value = '';
        placeInput.value = '';
        textarea.value = '';   
    })

    function sumArr(arr) {
        let sum = 0;

        for (let i = 0; i < arr.length; i++) {
            sum += arr[i]
        }

        return sum;
    }
}
