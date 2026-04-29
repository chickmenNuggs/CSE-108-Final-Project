const in_to_px = 600;
const cm_to_px = 236;
const in_to_cm = 2.54;
let prevUnitW;
let prevUnitH;
let brushSize = 10;
let brushType = 'brush';
let brushColor;
let isDrawing = false;



canvas = document.getElementById('myCanvas');
ctx = canvas.getContext('2d')
create = document.getElementsByClassName('create-new')[0];
w = document.getElementById('width');
h = document.getElementById('height');         
width = document.getElementById('w-measure');
height = document.getElementById('h-measure');
var x, y;
// syncBrushSize();

/* Canvas Js Start*/
function canvasInit(){
   if(width.value == 'px'){
      console.log(w.value)
      console.log(canvas.width)
      canvas.width = w.value;
   }
   else if(width.value== 'in'){
      w.value = (w.value*600);
      let t = Math.round(w.value)
      w.value = t
      canvas.width = w.value;  
   }
   else if(width.value== 'cm'){
      w.value = (w.value*236);
      let t = Math.round(w.value)
      w.value = t
      canvas.width = w.value
   }

   if( height.value == 'px'){
      canvas.height = h.value;
   }
   else if(height.value== 'in'){
      h.value = (h.value*600);
      let t = Math.round(h.value)
      h.value = t
      canvas.height = h.value;
   }
   else if(height.value== 'cm'){
      h.value = (h.value*236);
      let t = Math.round(h.value)
      h.value = t
      canvas.height = h.value
   }

   create.classList.add('hidden');
   canvas.classList.remove('hidden');
   
   window.onbeforeunload = function() {
   return "Data will be lost if you leave the page, are you sure?";
};
}
function backWarn(){ window.onbeforeunload = function() { return "Data will be lost if you leave the page, are you sure?"; }; }

function startDraw(){
   isDrawing = true;
   console.log(isDrawing)
}
function endDraw(){
   isDrawing = false;
   console.log(isDrawing)
}

canvas.addEventListener('mousemove', (e) =>{
   const rect = canvas.getBoundingClientRect();

   const scaleX = canvas.width / rect.width;
   const scaleY = canvas.height / rect.height;

   x = (e.clientX - rect.left) * scaleX;
   y = (e.clientY - rect.top) * scaleY;

   x = Math.round(x);
   y = Math.round(y);
   
   if(isDrawing){
      draw(x,y);
   }
})


function draw (x, y) {
   canvas = document.getElementById('myCanvas');
   let ctx = canvas.getContext('2d');
   syncColor();
   if(!isDrawing){ return; }
   console.log(x,y)
   drawPencil(x,y,brushSize,brushColor)
   
};

function drawPencil(x,y,rad, color){
   ctx.beginPath();
   ctx.arc(x,y,rad,0,Math.PI * 2);
   ctx.fillStyle = color;
   ctx.fill();
   ctx.stroke();
   ctx.closePath();
}

/* Color Selecter Js*/

/* Color Selecter Js End*/

function syncColor(){
   brushColor = document.getElementById('selected-color').value;
}

function syncBrushSize(el1, el2){
   el_1 = document.getElementById(el1);
   el_2 = document.getElementById(el2);
   
   el_2.value = el_1.value;
   brushSize = el_2.value;
}

function setBrush(){
   brushType = 'brush';
}

function setErase(){
   brushType = 'eraser'
}

function setPan(){
   brushType = 'pan';
}

function setTri(){
   brushType = 'tri';
}

function setSquare(){
   brushType = 'sqr';
}

function setCircle(){
   brushType = 'circ';
}




/* Canvas Js End*/

function swapWidthHeight(){
   const el1 = document.getElementById('width');
   const el2 = document.getElementById('height');

   const un1 = document.getElementById('w-measure');
   const un2 = document.getElementById('h-measure');

   let t1 = el2.value;
   el2.value = el1.value;
   el1.value = t1;
   
   let t2 = un2.value;
   un2.value = un1.value;
   un1.value = t2;
}

function getprevUnit(el){
    var unit = document.getElementById(el);
    if (el == 'w-measure'){
      if(prevUnitW == el.value){
      }
        prevUnitW = unit.value;
    } 
    else if (el == 'h-measure'){
      if(prevUnitH == el.value){
      }
        prevUnitH = unit.value;

    }
}

function unitConversion(el){
   unit = document.getElementById(el);
   if(unit.id =='w-measure'){
      w = document.getElementById('width');
      if(prevUnitW == 'px'){
         if(unit.value == 'in'){
            w.value = (w.value/600)
            if(w.value < 1){
               w.value = 1;
              }
               let t = Math.round(w.value  * 100) / 100
               w.value = t
            }
            else if(unit.value == 'cm'){
               w.value = (w.value/236);
               if(w.value < 1){
                  w.value = 1;
               }
               let t = Math.round(w.value  * 100) / 100
               w.value = t
            }
         }
         else if(prevUnitW == 'in'){
            if(unit.value == 'px'){
               w.value = (w.value*600);
               let t = Math.round(w.value)
               w.value = t
            }
            else if(unit.value == 'cm'){
               w.value = (w.value*in_to_cm)
               let t = Math.round(w.value)
               w.value = t
            }
         }  
         else if(prevUnitW == 'cm'){
            if(unit.value == 'px'){
               w.value = (w.value*236);
               let t = Math.round(w.value)
               w.value = t
               
            }
            else if(unit.value == 'in'){
               w.value = (w.value/in_to_cm)
               if(w.value < 1){
                  w.value = 1;
               }
               let t = Math.round(w.value  * 100) / 100
               w.value = t
            }
         }  
   }
   else if(unit.id == 'h-measure'){
      h = document.getElementById('height');
         if(prevUnitH == 'px'){
         if(unit.value == 'in'){
            h.value = (h.value/600)
            if(h.value < 1){
               h.value = 1;
            }
            let t = Math.round(h.value  * 100) / 100
            h.value = t
         }
         else if(unit.value == 'cm'){
            h.value = (h.value/236);
            if(h.value < 1){
               h.value = 1;
            }
            let t = Math.round(h.value  * 100) / 100
            h.value = t
         }
      }
      else if(prevUnitH == 'in'){
         if(unit.value == 'px'){
            h.value = (h.value*600);
            let t = Math.round(h.value)
            h.value = t
         }
         else if(unit.value == 'cm'){
            h.value = (h.value*in_to_cm)
            let t = Math.round(h.value)
            h.value = t
         }
      }  
      else if(prevUnitH == 'cm'){
         if(unit.value == 'px'){
            h.value = (h.value*236);
            let t = Math.round(h.value)
            h.value = t

         }
         else if(unit.value == 'in'){
            h.value = (h.value/in_to_cm)
            if(h.value < 1){
               h.value = 1;
            }
            let t = Math.round(h.value  * 100) / 100
            h.value = t

         }
      }  
   }
   getprevUnit(el)
}
