from flask import Flask, redirect, render_template, request, url_for, session
from flask_login import LoginManager, login_required
from server import socketio
# Custom user python file
from User import GetUser, TryToRegister, LoggedInSucessfully

from database import db

app = Flask(__name__);
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SECRET_KEY"] = "your_secret_key"

db.init_app(app)
socketio.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

MAX_LOBBY_ID_LENGTH = 8
LOBBY_LIST = "LobbyList"
CREATE_LOBBY = "CreateLobby"
VIEW_LOBBIES = "ViewLobbies"
JOIN_LOBBY = "JoinLobby"
PLAYER_JOINED = "PlayerJoined"
UPDATE_GAME_STATE = "UpdateGameState"


@login_manager.user_loader
def load_user(id):
    return GetUser(id)

@app.route("/")
def login():
    return render_template("login.html")

@app.route("/signup/")
def signup():
    return render_template("signup.html")

@app.route("/login/", methods=["POST"])
def login_post():
    username = request.form.get("username")
    password = request.form.get("password")

    if LoggedInSucessfully(username, password):
        session["user"] = username
        print("SESSION USER:", session.get("user"))
        return redirect(url_for("home"))

    return "Invalid login"

@app.route("/register/", methods=["POST"])
def register():
    username = request.form.get("username")
    password = request.form.get("password")

    userExists, existingUserErrorMessage = TryToRegister(username, password)

    if userExists:
        return existingUserErrorMessage

    return redirect(url_for("login"))

@app.route("/home/")
@login_required
def home():
    return render_template("home.html",)

@app.route("/canvas/<gameId>")
@login_required
def canvas(gameId):
    return render_template("canvas.html", gameId = gameId, LOBBY_LIST=LOBBY_LIST,CREATE_LOBBY=CREATE_LOBBY, VIEW_LOBBIES=VIEW_LOBBIES, 
                           JOIN_LOBBY=JOIN_LOBBY, UPDATE_GAME_STATE = UPDATE_GAME_STATE, localUserName=session["user"])

@app.route("/lobby/")
@login_required
def lobby():
    return render_template("lobby.html", LOBBY_LIST=LOBBY_LIST,CREATE_LOBBY=CREATE_LOBBY, VIEW_LOBBIES=VIEW_LOBBIES, JOIN_LOBBY=JOIN_LOBBY, localUserName=session["user"])

@app.route("/profile/")
@login_required
def profile():
    return render_template('profile.html')

@app.route("/saved/")
@login_required
def saved():
    return render_template("saved.html")

@app.route('/settings/')
@login_required
def settings():
    return render_template('settings.html')

with app.app_context():
    db.create_all()


if __name__ == "__main__":
    print("[}----------- [Running app.py] ---------------{]")
    socketio.run(app);
    app.run(debug=True);