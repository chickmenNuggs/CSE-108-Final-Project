from flask import Flask, render_template , session
from flask_socketio import SocketIO, emit

import random
import string

socketio = SocketIO()
# stores name and player count
lobbies = {}


MAX_LOBBY_ID_LENGTH = 8
LOBBY_LIST = "LobbyList"
CREATE_LOBBY = "CreateLobby"
VIEW_LOBBIES = "ViewLobbies"
JOIN_LOBBY = "JoinLobby"

@socketio.on(CREATE_LOBBY)
def CreateLobby(name):
   lobbyId = str(len(lobbies) + 1)
   if not name:
      characters = string.ascii_letters + string.digits
      name = "".join(random.choice(characters) for _ in range(MAX_LOBBY_ID_LENGTH))

   lobbies[lobbyId] = {"name": name, "players": 1}
   print(f"Created a new lobby with id: {lobbyId} and name: {name} ")
   print(f"We now have: {len(lobbies)} lobbie(s)");
   EmitMessage(LOBBY_LIST, lobbies)


@socketio.on(LOBBY_LIST)
def ViewLobbies():
   EmitMessage(LOBBY_LIST, lobbies, False)

@socketio.on(JOIN_LOBBY)
def JoinLobby(id):
   lobbies[id]["players"] += 1
   print(f"player: {id} has joined the lobby. There are now `{lobbies[id]["players"]}` in the lobby")
   # some other stuff down here

def EmitMessage(message, args, broadcast = True):
   emit(message, args, broadcast = broadcast)
