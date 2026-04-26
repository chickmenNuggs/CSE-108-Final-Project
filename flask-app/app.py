from flask import Flask, redirect, render_template, request, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_required, login_user
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__);
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SECRET_KEY"] = "your_secret_key"

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

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

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        login_user(user)
        return redirect(url_for("home"))

    return "Invalid login"

@app.route("/register/", methods=["POST"])
def register():
    username = request.form.get("username")
    password = request.form.get("password")

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return "Username already exists"

    hashed_password = generate_password_hash(password)

    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return redirect(url_for("login"))

@app.route("/home/")
@login_required
def home():
    return render_template("home.html")

@app.route("/canvas/")
@login_required
def canvas():
    return render_template("canvas.html")

@app.route("/lobby/")
@login_required
def lobby():
    return render_template("lobby.html")

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
    app.run(debug=True);