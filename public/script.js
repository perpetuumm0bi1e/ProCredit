let tableCells = document.getElementsByClassName('tableCell');

for (let i = 0; i < tableCells.length; i++) {
    tableCells[i].onmouseover = function() {
        tableCells[i].parentNode.style.background = 'rgba(235, 235, 235, 0.25)';
    }
    tableCells[i].onmouseleave = function() {
        tableCells[i].parentNode.style.background = 'none';}

}