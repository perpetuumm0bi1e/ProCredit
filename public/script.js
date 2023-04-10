let tableCells = document.getElementsByClassName('tableCell');

for (let i = 0; i < tableCells.length; i++) {
    tableCells[i].onmouseover = function() {
        tableCells[i].parentNode.style.background = 'rgba(235, 235, 235, 0.25)';
    }
    tableCells[i].onmouseleave = function() {
        tableCells[i].parentNode.style.background = 'none';}

}

(function(){
var modal = document.querySelector('.modal-addApplication');
var closeModalButton = document.querySelector('.closeModalButton');
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
