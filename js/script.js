window.addEventListener('DOMContentLoaded', () => {

    // ! tabs
    const tab = document.querySelectorAll('.info-header-tab');
    const info = document.querySelector('.info-header');
    const tabContent = document.querySelectorAll('.info-tabcontent');
    
    // ! modals
    const more = document.querySelector('.more');
    const overlay = document.querySelector('.overlay');
    const close = document.querySelector('.popup-close');


    // * tabs
    const hideTabContent = (a) => {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    };

    hideTabContent(1);

    const showTabContent = (b) => {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    };

    info.addEventListener('click', (e) => {
        const target = e.target;
        // console.log(target);
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    // * modal

    more.addEventListener('click', () => {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    overlay.addEventListener('click', (e)=> {
        const target = e.target;
        if (target === close || target === overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // * Timer

    let deadline = '2022-12-31';


    const getTimeRemaining = (endtime) => {
        let t = Date.parse(endtime) - Date.parse(new Date());
        let seconds = Math.floor((t/1000) % 60);
        let minutes = Math.floor((t/1000/60) % 60);
        let hours = Math.floor(t/(1000*60*60));

        return {
            'total': t,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };

    };

    function setClock(id, endtime) {
        const timer = document.getElementById(id);
        const hours = timer.querySelector('.hours');
        const minutes = timer.querySelector('.minutes');
        const seconds = timer.querySelector('.seconds');
        let timeInterval = setInterval(updateClock, 1000);

        function updateClock()  {
            let t = getTimeRemaining(endtime);

            function addZero(num) {
                if (num <=9) {
                    return '0'+num;
                } else {
                    return num;
                }
            };

            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    };

    setClock('timer', deadline);

    // * slider 

    let slideIndex = 1;
    const slides = document.querySelectorAll('.slider-item');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    const dotsWrap = document.querySelector('.slider-dots');
    const dots = document.querySelectorAll('.dot');

    const showSlides = (n) => {

        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');
        dots.forEach((item) => item.classList.remove('dot-active'));
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    };

    showSlides(slideIndex);

    function plusSlide(n) {
        showSlides(slideIndex += n)
    };

    function currentSlide(n) {
        showSlides(slideIndex = n)
    };

    next.addEventListener('click', ()=> {
        plusSlide(1);
    });
    prev.addEventListener('click', ()=> {
        plusSlide(-1);
    });

    dotsWrap.addEventListener('click', (e)=> {
        for (let i = 0; i < dots.length + 1; i++) {
            if (e.target.classList.contains('dot') && e.target == dots[i-1]) {
                currentSlide(i);
            }
        }
    });


    // ! tab modals

    const descriptionBtn = document.querySelectorAll('.description-btn');
    descriptionBtn.forEach((btn)=> {
        btn.addEventListener('click', ()=> {
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        })
    });

    // ! calc

    const  person = document.querySelectorAll('.counter-block-input')[0];
    const  restdays = document.querySelectorAll('.counter-block-input')[1];
    const  place = document.getElementById('select');
    const  totalValue = document.getElementById('total');
    let personSum = 0;
    let daysSum = 0;
    let total = 0;

    totalValue.textContent = 0;

    person.addEventListener('change', ()=> {
        personSum = +person.value;
        total = (daysSum + personSum) * 4000;

        if (restdays.value == '') {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    restdays.addEventListener('change', ()=> {
        daysSum = +restdays.value;
        total = (daysSum + personSum) * 4000;

        if (person.value == '') {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    place.addEventListener('input', function() {
        if (person.value == '' || restdays.value == '') {
            totalValue.innerHTML = 0;
        } else {
            let a = total;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value;
        }
    });


    // ! form
    const form = document.querySelector('#form');
    const inputs  = form.querySelectorAll('input');
    const statusMessage  = document.createElement('div');
    statusMessage.className = 'status';

    let massege = {
        loading: '????????????????....',
        success: '??????????????! ?????????? ???? ?? ???????? ????????????????',
        failure: '??????-???? ?????????? ???? ??????...'
    };


    form.addEventListener('submit', function(e) {
        e.preventDefault();
        form.append(statusMessage);


        let request = new XMLHttpRequest();
        request.open('POST', '../server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        const data = {
            email: inputs[0].value,
            phone: inputs[1].value
        }

        console.log(data.email);
        console.log(data.phone);

        let json = JSON.stringify(data);

        request.send(json);

        inputs[0].value = '';
        inputs[1].value = '';

        request.addEventListener('readystatechange', function() {
            if (request.readyState < 4) {
                statusMessage.innerHTML = massege.loading;
            } else if (request.readyState === 4 && request.status === 200) {
                statusMessage.innerHTML = massege.success;
            } else {
                statusMessage.innerHTML = massege.failure;
            }
        });

    });

});

