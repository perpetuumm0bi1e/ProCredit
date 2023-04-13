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
    modal.classList.add('is-opesssn');
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

let editButton = document.querySelector('#edit-personal-information');
let editButtonClickCounter = 0;

let editedFIO = document.getElementById('edited-fio');
let editedPhoneNumber = document.getElementById('edited-phone-number');
let editedLogin = document.getElementById('edited-login');
let editedPassword = document.getElementById('edited-password');

let editedData = document.getElementsByClassName('profile-input');

editButton.addEventListener('click', function () {
    editButtonClickCounter++;
    if(editButtonClickCounter % 2 != 0){
        editedData.forEach(element => {
            element.readOnly = false;
            element.classList.remove('unchanged');
        });
        editButton.value = 'Сохранить';
    } else if (editButtonClickCounter % 2 == 0){
        editedData.forEach(element => {
        element.readOnly = true;
        element.classList.add('unchanged');
    });
        editButton.value = 'Изменить';
    }
});