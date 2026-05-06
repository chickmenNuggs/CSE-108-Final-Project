const in_to_px = 600;
const cm_to_px = 236;
const in_to_cm = 2.54;
let prevUnitW;
let prevUnitH;
let brushSize = 10;
let brushType;
let brushColor;
let isDrawing = false;
let isSaved = false;
let isShowing = false;
var x, y;


canvas = document.getElementById('myCanvas');
ctx = canvas.getContext('2d')
create = document.getElementsByClassName('create-new')[0];
w = document.getElementById('width');
h = document.getElementById('height');         
width = document.getElementById('w-measure');
height = document.getElementById('h-measure');
   b = document.getElementById('brush');
   e = document.getElementById('eraser');
   p = document.getElementById('e-pan');
 
window.addEventListener('load', (event) => {
   syncBrushSize()
   syncColor()
   brushType = 'brush'
});

document.addEventListener('click', (event) => {
   if(isShowing == false){
      hideMenu();
   }
   isShowing = false;
});


function showMenu(){
   isShowing = true;
   menu = document.getElementById('files');
   files.classList.remove('hidden')
}

function hideMenu(){
   menu = document.getElementById('files');
   files.classList.add('hidden')
}


function clearCanvas(){
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   hideMenu();
}

function newCanvas(){
   if(isSaved == false){
      backWarn();
   }
   clearCanvas()
   canvas.classList.add('hidden') 
   create.classList.remove('hidden')
}

function saveCanvas(){

}

function exportCanvas(){
   
}

function zoomIn(){

}
function zoomOut(){

}


/* Canvas Js Start*/
function canvasInit ()
{
   if ( width.value == 'px' )
   {
      console.log( w.value )
      console.log( canvas.width )
      canvas.width = w.value;
   }
   else if ( width.value == 'in' )
   {
      w.value = ( w.value * 600 );
      let t = Math.round( w.value )
      w.value = t
      canvas.width = w.value;
   }
   else if ( width.value == 'cm' )
   {
      w.value = ( w.value * 236 );
      let t = Math.round( w.value )
      w.value = t
      canvas.width = w.value
   }

   if ( height.value == 'px' )
   {
      canvas.height = h.value;
   }
   else if ( height.value == 'in' )
   {
      h.value = ( h.value * 600 );
      let t = Math.round( h.value )
      h.value = t
      canvas.height = h.value;
   }
   else if ( height.value == 'cm' )
   {
      h.value = ( h.value * 236 );
      let t = Math.round( h.value )
      h.value = t
      canvas.height = h.value
   }

   create.classList.add('hidden');
   canvas.classList.remove('hidden');
   brushColor = '#000000';
   brushType = 'brush';
   brushSize = 10;

   window.onbeforeunload = function() {
   return "Data will be lost if you leave the page, are you sure?";
};
}

function backWarn(){ window.onbeforeunload = function() { return "Data will be lost if you leave the page, are you sure?"; }; }

   window.onbeforeunload = function ()
   {
      return "Data will be lost if you leave the page, are you sure?";
   };

   if ( !IsSinglePlayerSession() )
   {
      LogCurrentWebsocketEvent( "Canvas Created", `Updating canvas information for lobby "${ window.gameId }"` )
      window.socket.emit( "CreatedCanvas", { "Width": canvas.width, "Height": canvas.height, "Context": ctx, "Id": window.gameId } )
   }

function SetClientCanvas ( width, height )
{
   canvas.width = width;
   canvas.height = height;

   create.classList.add( 'hidden' );
   canvas.classList.remove( 'hidden' );
}

function backWarn () { window.onbeforeunload = function () { return "Data will be lost if you leave the page, are you sure?"; }; }

function startDraw ()
{
   isSaved = false;
   isDrawing = true;
   console.log(brushColor)
   console.log(brushType)
}
function endDraw ()
{
   isDrawing = false;
}

canvas.addEventListener('mousemove', (e) =>{
   const rect = canvas.getBoundingClientRect();

   const scaleX = canvas.width / rect.width;
   const scaleY = canvas.height / rect.height;

   x = ( e.clientX - rect.left ) * scaleX;
   y = ( e.clientY - rect.top ) * scaleY;


   x = Math.round( x );
   y = Math.round( y );

   if ( isDrawing )
   {
      draw( x, y );
   }
} )

canvas.addEventListener( "mouseup", ( e ) =>
{
   ForceSyncBoard();
} );

function draw (x, y) {
   canvas = document.getElementById('myCanvas');
   let ctx = canvas.getContext('2d');
   syncColor();
   if(!isDrawing){ return; }
   // console.log(x,y);

   if(brushType == "brush"){
      drawPencil(x,y,brushSize,brushColor);
   }
   else if (brushType == 'e'){ 
      erase(x,y,brushSize,"#ffffff");
   }   
};

function drawPencil ( x, y, rad, color )
{
   ctx.beginPath();
   ctx.arc( x, y, rad, 0, Math.PI * 2 );
   ctx.fillStyle = color;
   ctx.fill();
   ctx.closePath();
   /* 
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
       ctx.strokeStyle = '#000'; // Brush color
       ctx.lineWidth = 5;         // Brush size
       ctx.lineCap = 'round';     // Makes ends smooth
       ctx.stroke();
       [lastX, lastY] = [e.offsetX, e.offsetY]; 
   */
}


function erase(x,y,rad, color){
   ctx.beginPath();
   ctx.arc(x,y,rad,0,Math.PI * 2);
   ctx.fillStyle = color;
   ctx.fill();
   // ctx.stroke();
   ctx.closePath();
}

/* Color Selecter Js*/

/* Color Selecter Js End*/

function syncColor ()
{
   brushColor = document.getElementById( 'selected-color' ).value;
}

function syncBrushSize ( el1, el2 )
{
   el_1 = document.getElementById( el1 );
   el_2 = document.getElementById( el2 );

   el_2.value = el_1.value;
   brushSize = el_2.value;
}

function setBrush(){
   if(brushType != 'brush'){
      b.classList.add('active-brush');
      e.classList.remove('active-brush');
      p.classList.remove('active-brush');
      // t.classList.remove('active-brush');
      // c.classList.remove('active-brush');
      // s.classList.remove('active-brush');  
   }
   brushType = 'brush';
}

function setErase(){
   if(brushType != 'e'){
      b.classList.remove('active-brush');
      e.classList.add('active-brush');
      p.classList.remove('active-brush');
      // t.classList.remove('active-brush');
      // c.classList.remove('active-brush');
      // s.classList.remove('active-brush');  
   }
   brushType = 'e';
}

function setPan ()
{
   brushType = 'pan';
}

function swapWidthHeight ()
{
   const el1 = document.getElementById( 'width' );
   const el2 = document.getElementById( 'height' );

   const un1 = document.getElementById( 'w-measure' );
   const un2 = document.getElementById( 'h-measure' );

   let t1 = el2.value;
   el2.value = el1.value;
   el1.value = t1;

   let t2 = un2.value;
   un2.value = un1.value;
   un1.value = t2;
}

function getprevUnit ( el )
{
   var unit = document.getElementById( el );
   if ( el == 'w-measure' )
   {
      if ( prevUnitW == el.value )
      {
      }
      prevUnitW = unit.value;
   }
   else if ( el == 'h-measure' )
   {
      if ( prevUnitH == el.value )
      {
      }
      prevUnitH = unit.value;

   }
}

function unitConversion ( el )
{
   unit = document.getElementById( el );
   if ( unit.id == 'w-measure' )
   {
      w = document.getElementById( 'width' );
      if ( prevUnitW == 'px' )
      {
         if ( unit.value == 'in' )
         {
            w.value = ( w.value / 600 )
            if ( w.value < 1 )
            {
               w.value = 1;
            }
            let t = Math.round( w.value * 100 ) / 100
            w.value = t
         }
         else if ( unit.value == 'cm' )
         {
            w.value = ( w.value / 236 );
            if ( w.value < 1 )
            {
               w.value = 1;
            }
            let t = Math.round( w.value * 100 ) / 100
            w.value = t
         }
      }
      else if ( prevUnitW == 'in' )
      {
         if ( unit.value == 'px' )
         {
            w.value = ( w.value * 600 );
            let t = Math.round( w.value )
            w.value = t
         }
         else if ( unit.value == 'cm' )
         {
            w.value = ( w.value * in_to_cm )
            let t = Math.round( w.value )
            w.value = t
         }
      }
      else if ( prevUnitW == 'cm' )
      {
         if ( unit.value == 'px' )
         {
            w.value = ( w.value * 236 );
            let t = Math.round( w.value )
            w.value = t

         }
         else if ( unit.value == 'in' )
         {
            w.value = ( w.value / in_to_cm )
            if ( w.value < 1 )
            {
               w.value = 1;
            }
            let t = Math.round( w.value * 100 ) / 100
            w.value = t
         }
      }
   }
   else if ( unit.id == 'h-measure' )
   {
      h = document.getElementById( 'height' );
      if ( prevUnitH == 'px' )
      {
         if ( unit.value == 'in' )
         {
            h.value = ( h.value / 600 )
            if ( h.value < 1 )
            {
               h.value = 1;
            }
            let t = Math.round( h.value * 100 ) / 100
            h.value = t
         }
         else if ( unit.value == 'cm' )
         {
            h.value = ( h.value / 236 );
            if ( h.value < 1 )
            {
               h.value = 1;
            }
            let t = Math.round( h.value * 100 ) / 100
            h.value = t
         }
      }
      else if ( prevUnitH == 'in' )
      {
         if ( unit.value == 'px' )
         {
            h.value = ( h.value * 600 );
            let t = Math.round( h.value )
            h.value = t
         }
         else if ( unit.value == 'cm' )
         {
            h.value = ( h.value * in_to_cm )
            let t = Math.round( h.value )
            h.value = t
         }
      }
      else if ( prevUnitH == 'cm' )
      {
         if ( unit.value == 'px' )
         {
            h.value = ( h.value * 236 );
            let t = Math.round( h.value )
            h.value = t

         }
         else if ( unit.value == 'in' )
         {
            h.value = ( h.value / in_to_cm )
            if ( h.value < 1 )
            {
               h.value = 1;
            }
            let t = Math.round( h.value * 100 ) / 100
            h.value = t

         }
      }
   }
   getprevUnit( el )
}




// Put Roster info in here //

 function fillRoster(name){

   container = document.getElementById('ploingus');
   if(container){
      console.log('exists')
   }
   newTag = document.createElement('div')
   newTag.id = name
   newTag.classList.add('player-list')
   newTag.innerText = name 

   if(newTag){
      console.log('new exists')
   }


   container.appendChild(newTag);
   // targetDiv.appendChild(newPara);

}