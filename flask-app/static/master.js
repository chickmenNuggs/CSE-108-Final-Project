/* Global Vars. DO NOT TOUCH*/

const in_to_px = 600;
const cm_to_px = 236;
const in_to_cm = 2.54;
let prevUnitW;
let prevUnitH;
let brushSize = 10;
let brushType;
let brushColor;
let isDrawing = false;
let isSaved = true;
let isShowing = false;
let isMultiplayer = false;
var x, y;
canvas = document.getElementById( 'myCanvas' );
ctx = canvas.getContext( '2d' )
create = document.getElementsByClassName( 'create-new' )[ 0 ];
w = document.getElementById( 'width' );
h = document.getElementById( 'height' );
width = document.getElementById( 'w-measure' );
height = document.getElementById( 'h-measure' );
b = document.getElementById( 'brush' );
e = document.getElementById( 'eraser' );
p = document.getElementById( 'e-pan' );
exp = document.getElementById( 'expMenu' );
input = document.getElementById( 'telture' );

let lastX, lastY;


/*Drop Down Menu Start*/
function showMenu ()
{
   isShowing = true;
   menu = document.getElementById( 'files' );
   files.classList.remove( 'hidden' )
}

function hideMenu ()
{
   menu = document.getElementById( 'files' );
   files.classList.add( 'hidden' )
}

document.addEventListener( 'click', ( event ) =>
{
   menu = document.getElementById( 'files' );
   clicker = document.getElementById( 'revelator' )
   if ( menu.matches( ':hover' ) || clicker.matches( ':hover' ) ) { return; }
   hideMenu();
} );
/*Drop Down Menu End*/



/* Save / Export Code Start*/

exp.addEventListener( 'click', ( event ) =>
{
   emenu = document.getElementsByClassName( 'exportBin' )[ 0 ];
   if ( emenu.matches( ":hover" ) )
   {
      return;
   }
   hideExp()
} )

function showExp ()
{
   exp.classList.remove( 'hidden' );
   hideMenu();
}
function hideExp ()
{
   exp.classList.add( 'hidden' );
}

function saveCanvas ()
{

   isSaved = true;
}


function exportCanvas ()
{

   isSaved = true;
   hideExp()
   // alert("file saved")
}

/* Save / Export Code End*/

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

   create.classList.add( 'hidden' );
   canvas.classList.remove( 'hidden' );
   syncColor();
   brushType = 'brush';
   brushSize = 10;

   window.onbeforeunload = function ()
   {
      return "Data will be lost if you leave the page, are you sure?";
   };

   // Don't move this
   if ( !IsSinglePlayerSession() )
   {
      LogCurrentWebsocketEvent( "Canvas Created", `Updating canvas information for lobby "${ window.gameId }"` )
      window.socket.emit( "CreatedCanvas", { "Width": canvas.width, "Height": canvas.height, "Context": ctx, "Id": window.gameId } )
   }
}

function SetClientCanvas ( width, height )
{
   canvas.width = width;
   canvas.height = height;

   create.classList.add( 'hidden' );
   canvas.classList.remove( 'hidden' );
}


function clearCanvas ( emit = true )
{
   ctx.clearRect( 0, 0, canvas.width, canvas.height )
   ctx.beginPath();
   hideMenu();

   if ( !IsSinglePlayerSession() && emit )
   {
      window.socket.emit( "ClearCanvas", { "Id": window.gameId } );

      // Once we clear the board we need to force send a snapshot of the blank canvas.
      UpdateServerCanvas();
   }
}

function newCanvas ()
{
   if ( isSaved == false )
   {
      backWarn();
   }
   clearCanvas( false )
   canvas.classList.add( 'hidden' )
   create.classList.remove( 'hidden' )
}


// Begin Drawing
canvas.addEventListener( 'mousedown', ( e ) =>
{
   isDrawing = true;
   [ lastX, lastY ] = [ e.offsetX, e.offsetY ];

} )
// Moving Brush
canvas.addEventListener( 'mousemove', ( e ) =>
{
   //Making sure person is trying to draw

   if ( !isDrawing ) return;

   // syncBrushSize();
   // syncColor();
   //getting bounds for canvas
   const rect = canvas.getBoundingClientRect();
   const scaleX = canvas.width / rect.width;
   const scaleY = canvas.height / rect.height;


   x = ( e.clientX - rect.left ) * scaleX;
   y = ( e.clientY - rect.top ) * scaleY;


   x = Math.round( x );
   y = Math.round( y );

   ctx.beginPath();

   drawkill( x, y, brushSize, brushColor )

   AddClientData( x, y, lastX, lastY, ctx.lineWidth, ctx.strokeStyle );
   [ lastX, lastY ] = [ x, y ];
} )


function drawkill ( x, y, width, color )
{
   ctx.beginPath();
   ctx.moveTo( lastX, lastY );
   ctx.lineTo( x, y );

   if ( brushType == "brush" )
   {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.stroke();
   }
   else if ( brushType == 'e' )
   {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.stroke();
   }

   if ( brushType == 'pan' )
   {
      alert( 'Pan tool is not yet implemented' );
   }
}
// End Brush

canvas.addEventListener( 'mouseup', ( e ) =>
{
   ctx.beginPath();
   ForceSyncBoard();
   isDrawing = false;
} )

canvas.addEventListener( 'mouseout', ( e ) =>
{
   ctx.beginPath();
   isDrawing = false;
} )


// For Syncing? Idk some websocket stuff.

canvas.addEventListener( "mouseup", ( e ) =>
{
   ForceSyncBoard();
} );

/* Misc Helper functions*/

window.addEventListener('load',(event)=>{
   if( IsSinglePlayerSession() ){
      document.getElementById('m-helper').classList.add('hidden');
   }
})

input.addEventListener('keydown', function(event) {
   if(!IsSinglePlayerSession() ){

      // NEEDS SELF IF SENDER IS SELF
      self = true;
      
      if (event.key == 'Enter'){
         
         user = 'temp';
         
         msg =  input.value;
         event.preventDefault();
         console.log(msg);
         //NEEDS USERNAME AS  USER 
         sendMSG(self, user, msg);
      }
   }
})

async function sendMSG (self, user, message){
   isSelf = false;
   chat = document.getElementById('chat');

   if(self){
      
   }


   msgBox = document.createElement('div');
   sender = document.createElement('div');
   msg = document.createElement('div');
   
   msgBox.classList.add('msg')
   sender.id = "sender";
   msg.id = "msg";
   
   sender.innerText = user;
   msg.innerText = message;

   msgBox.appendChild(sender);
   msgBox.appendChild(msg);

   
   chat.appendChild(msgBox);


}

// window.addEventListener( 'keypress', ( event ) =>
// {
//    if ( event.key == 'c' )
//    {
//       showMenu();
//    }
//    else if ( event.key == 'h' )
//    {
//       home = document.getElementById( 'home' );
//       home.click();
//    }
//    else if ( event.key == 'b' )
//    {
//       setBrush();
//    }
//    else if ( event.key == 'e' )
//    {
//       setErase();
//    }
//    else if ( event.key == 'p' )
//    {
//       setPan();
//    }

// } )


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
window.addEventListener( 'load', ( event ) =>
{
   console.log( "Setting brush type" );
   brushType = 'brush';
   //syncBrushSize()
   syncColor()
} );
function setBrush ()
{
   if ( brushType != 'brush' )
   {
      b.classList.add( 'active-brush' );
      e.classList.remove( 'active-brush' );
      p.classList.remove( 'active-brush' );
   }
   brushType = 'brush';
}

function setErase ()
{
   if ( brushType != 'e' )
   {
      b.classList.remove( 'active-brush' );
      e.classList.add( 'active-brush' );
      p.classList.remove( 'active-brush' );
   }
   brushType = 'e';
}

function setPan ()
{
   if ( brushType != 'pan' )
   {
      b.classList.remove( 'active-brush' );
      e.classList.remove( 'active-brush' );
      p.classList.add( 'active-brush' );
   }
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


function zoomIn ()
{

}
function zoomOut ()
{

}


/* Misc Helper functions end */


// Put Roster info in here //

function fillRoster ( name )
{

   if ( container )
   {
      console.log( 'exists' )
   }
   newTag = document.createElement( 'div' )
   newTag.id = name
   newTag.classList.add( 'player-list' )
   newTag.innerText = name

   if ( newTag )
   {
      console.log( 'new exists' )
   }


   container.appendChild( newTag );
   // targetDiv.appendChild(newPara);

}