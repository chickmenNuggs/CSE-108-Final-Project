var brushSize;
var brushType;
const in_to_px = 600;
const cm_to_px = 236;
const in_to_cm = 2.54;

let prevUnitW;
let prevUnitH;

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


/* Canvas Js Start*/
    function canvasInit(){
         canvas = document.getElementById('myCanvas');
         create = document.getElementsByClassName('create-new')[0];
         w = document.getElementById('width');
         h = document.getElementById('height');         
         width = document.getElementById('w-measure');
         height = document.getElementById('h-measure');

         if(width.value == 'px'){
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


/* Color Selecter Js*/

/* Color Selecter Js End*/


function syncBrushSize(el1, el2){
    el_1 = document.getElementById(el1);
    el_2 = document.getElementById(el2);

    el_2.value = el_1.value;
}
function getBrushSize(){
    brushSize = document.getElementById('brush-range').value
}

/* Canvas Js End*/
