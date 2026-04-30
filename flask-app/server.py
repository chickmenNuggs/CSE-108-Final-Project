from flask_socketio import SocketIO, emit, join_room, rooms
from flask import Flask, redirect, url_for

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
PLAYER_JOINED = "PlayerJoined"
UPDATE_GAME_STATE = "UpdateGameState"
REMOVE_PLAYER_FROM_LOBBY = "RemovePlayerFromLobby"


@socketio.on(CREATE_LOBBY)
def CreateLobby(data):
    
    name = data.get("name")
    host = data.get("host")

    lobbyId = str(len(lobbies) + 1)
    if not name:
        characters = string.ascii_letters + string.digits
        name = "".join(random.choice(characters) for _ in range(MAX_LOBBY_ID_LENGTH))

    lobbies[lobbyId] = {
        "Name": name,
        "PlayerCount": 1,  
        "Players": [host]
    }

    join_room(lobbyId)
    emit("LobbyCreated", {"Id": lobbyId})


@socketio.on(LOBBY_LIST)
def ViewLobbies():
    lobby_data = {}
    for lobbyId, lobbyInfo in lobbies.items():
        lobby_data[lobbyId] = {
            "Name": lobbyInfo["Name"],
            "PlayerCount": lobbyInfo["PlayerCount"],
            "Players": lobbyInfo["Players"]
        }
    emit(LOBBY_LIST, lobby_data)


@socketio.on(JOIN_LOBBY)
def JoinLobby(data):

    lobbyId = data.get("Id")
    user = data.get("User")

    print("JOIN REQUEST:", data)

    if lobbyId not in lobbies:
        print("Invalid lobby:", lobbyId)
        emit("Error", {"message": "Lobby not found"})
        return

    join_room(lobbyId)

    lobbies[lobbyId]["PlayerCount"] += 1
    lobbies[lobbyId]["Players"].append(user)



@socketio.on(UPDATE_GAME_STATE)
def UpdateGameState(data):
    lobby = lobbies.get(data.get("Id"))
    if not lobby:
        emit("Redirect", {"Url": "/lobby" })
        return
        
    print(lobbies[data.get("Id")])

@socketio.on(REMOVE_PLAYER_FROM_LOBBY)
def RemovePlayerFromLobby(data):
    lobbyId = data.get("Id")

    print(f"DELETING PLAYER: {data.get("User")}")

    if not lobbyId:
        print("No lobbyId given when trying to remove a player")
        return
    
    disconnectedUser = data.get("User")

    if not disconnectedUser:
        print("No username was given to be deleted")
        return

    lobby = lobbies[lobbyId]
    players = lobby["Players"]
    players.remove(disconnectedUser)

    if(len(players) <= 0):
        print(f"Deleting lobby: `{lobbyId}` due to the lack of players.")
        lobbies.pop(lobbyId)
