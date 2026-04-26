
var brushSize;
var brushType;


function toggleHiddenLobby(page1, page2, page3) {

    b1 = document.getElementById(page1);
    b2 = document.getElementById(page2);
    b3 = document.getElementById(page3);
    p1 = document.getElementsByClassName(page1)[0];
    p2 = document.getElementsByClassName(page2)[0];
    p3 = document.getElementsByClassName(page3)[0];
    
    b1.classList.add('nav-active');
    b2.classList.remove('nav-active');
    b3.classList.remove('nav-active');

    p1.classList.toggle('hidden');
    p2.classList.add('hidden');
    p3.classList.add('hidden');
}

function syncBrushSize(el1, el2){
    el_1 = document.getElementById(el1);
    el_2 = document.getElementById(el2);

    el_2.value = el_1.value;
}
function getBrushSize(){
    brushSize = document.getElementById('brush-range').value
}

/* Canvas Js Start*/

/* Color Selecter Js*/

/* Color Selecter Js End*/



/* Canvas Js End*/
