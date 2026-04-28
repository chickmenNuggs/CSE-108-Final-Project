var brushSize;
var brushType;



function syncBrushSize ( el1, el2 )
{
   el_1 = document.getElementById( el1 );
   el_2 = document.getElementById( el2 );

   el_2.value = el_1.value;
}
function getBrushSize ()
{
   brushSize = document.getElementById( 'brush-range' ).value
}

/* Canvas Js Start*/

/* Color Selecter Js*/

/* Color Selecter Js End*/



/* Canvas Js End*/
