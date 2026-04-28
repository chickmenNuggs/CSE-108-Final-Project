function toggleHiddenLobby ( page1, page2, page3 )
{

   b1 = document.getElementById( page1 );
   b2 = document.getElementById( page2 );
   b3 = document.getElementById( page3 );
   p1 = document.getElementsByClassName( page1 )[ 0 ];
   p2 = document.getElementsByClassName( page2 )[ 0 ];
   p3 = document.getElementsByClassName( page3 )[ 0 ];

   b1.classList.add( 'nav-active' );
   b2.classList.remove( 'nav-active' );
   b3.classList.remove( 'nav-active' );

   p1.classList.remove( 'hidden' );
   p2.classList.add( 'hidden' );
   p3.classList.add( 'hidden' );
}

const infoButton = document.getElementById( "info" );
const createButton = document.getElementById( "create-lobby" );
const joinButton = document.getElementById( "join-lobby" );

infoButton.addEventListener( "click", () =>
{
   toggleHiddenLobby( "info", "create-lobby", "join-lobby" );
} );

createButton.addEventListener( "click", () =>
{
   toggleHiddenLobby( "create-lobby", "info", "join-lobby" );
} );

joinButton.addEventListener( "click", () =>
{
   toggleHiddenLobby( "join-lobby", "create-lobby", "info" );
} );