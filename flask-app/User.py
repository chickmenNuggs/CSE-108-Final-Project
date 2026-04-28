
from flask import Flask, redirect, render_template, request, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_required, login_user
from werkzeug.security import generate_password_hash, check_password_hash

from database import db

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

def GetUserFromName(username):
   return User.query.filter_by(username=username).first()

def GetUser(userID):
   return User.query.get(int(userID))

def LoggedInSucessfully(username, password):

   user = GetUserFromName(username)

   if not user or not check_password_hash(user.password, password):
      return False
   
   login_user(user)
   return True
      

def TryToRegister(username, password):
   user = GetUserFromName(username)

   if user:
      return (False, "Username already exists")

   hashedPassowrd = generate_password_hash(password)
   registeredUser = User(username=username, password=hashedPassowrd)
   db.session.add(registeredUser)
   db.session.commit()

   return (True, "Success")
