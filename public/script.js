// анимация хедера
document.addEventListener('DOMContentLoaded', () => {
    const onScrollHeader = () => {
        const header = document.querySelector('.header');
        let prevScroll = window.pageYOffset;
        let currentScroll;

        window.addEventListener('scroll', () => {
            currentScroll = window.pageYOffset;

            const headerHidden = () => header.classList.contains('header_hidden');

            if (currentScroll > prevScroll && !headerHidden()) {
                header.classList.add('header_hidden');
            }
            if (currentScroll < prevScroll && headerHidden()) {
                header.classList.remove('header_hidden');
            }

            prevScroll = currentScroll;
        })
    }
    onScrollHeader();
});
// анимация появления боксов
function onEntry(entry) {
    entry.forEach(change => {
      if (change.isIntersecting) {
        change.target.classList.add('box-animation-show');
      }
    });
  }
  let options = { threshold: [0.5] };
  let observer = new IntersectionObserver(onEntry, options);
  let elements = document.querySelectorAll('.box-animation');
  for (let elm of elements) {
    observer.observe(elm);
  }

// подсветка строк таблицы
let tableCells = document.getElementsByClassName('table-cell');


for (let i = 0; i < tableCells.length; i++) {
    tableCells[i].onmouseover = function() {
        tableCells[i].parentNode.style.background = 'rgba(235, 235, 235, 0.4)';
    }
    tableCells[i].onmouseleave = function() {
        tableCells[i].parentNode.style.background = 'none';
    }
}

// модальное окно
(function(){
var modal = document.querySelector('.modal-add-application');
var closeModalButton = document.querySelector('.close-modal-button');
var modalTriggers = document.querySelectorAll('[data-trigger]');

var isModalOpen = false;
var pageYOffset = 0;

var openModal = function() {
    pageYOffset = window.pageYOffset;
    modal.classList.add('is-open');
    isModalOpen = true;
}

var closeModal = function() {
    modal.classList.remove('is-open');
    isModalOpen = false;
}

var onScroll = function(e) {
    if (isModalOpen) {
        e.preventDefault();
        window.scrollTo(0, pageYOffset);
    }
}

 modalTriggers.forEach(function(item) {
    item.addEventListener('click', openModal);
})

document.addEventListener('scroll', onScroll);

closeModalButton.addEventListener('click', closeModal);
})();

