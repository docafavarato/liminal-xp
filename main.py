import os
import sys
from flask import Flask, render_template, url_for, redirect, request, session
from flask_session import Session
import json
import random
import string
from apiservice import Posts, Replies, Boards
from datetime import datetime

postApi = Posts()
replyApi = Replies()
boardApi = Boards()

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["POST_IMAGE_UPLOAD_FOLDER"] = "static/uploads/post-images"

Session(app)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

def randomString(range1, range2):
    length = random.randint(range1, range2)
    return str(''.join(random.choices(string.ascii_lowercase + string.ascii_uppercase +
                             string.digits, k=length)))
    
def randomFileSize():
    return str(random.randint(1, 732)) + "KB"

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def iso_to_datetime(iso_string):
    return datetime.fromisoformat(iso_string).strftime("%m/%d/%Y %H:%M:%S")

app.jinja_env.filters['iso_to_datetime'] = iso_to_datetime

@app.route("/", methods=["GET"])
def index():
    return redirect(url_for("desktop"))

@app.route("/win7", methods=["GET"])
def win7():
    return render_template("windows_7/win7.html")

@app.route("/desktop", methods=["GET", "POST"])
def desktop():
    if request.method == "GET":
        posts = postApi.findAll(orderByDate=True)
        boards = boardApi.findAll(orderByDate=True)
        with open("data.json") as f:
            data = f.read()
        spaces = json.loads(data)
        random.shuffle(spaces)

        songs = [file for file in os.listdir("static/styles/audios/songs")]
        random.shuffle(songs)

        effects = [file for file in os.listdir("static/styles/audios/effects")]

        wallpapers = [file for file in os.listdir("static/styles/images/background")]
    
        return render_template("desktop.html", spaces=spaces, songs=songs, randomString=randomString, posts=posts, boards=boards, randomFileSize=randomFileSize, wallpapers=wallpapers, effects=effects)
    
@app.route("/create-post/<boardId>", methods=["POST"])
def create_post(boardId):
    content = request.form.get("comment")
    imgFile = request.files.get("post-image")
    board = boardApi.findById(boardId)
        
    if imgFile:
        rand = random.randint(1, sys.maxsize)
        finalName = str(rand) + "." + imgFile.filename.split(".")[1]
        if allowed_file(imgFile.filename):
            imgFile.save(os.path.join(app.config["POST_IMAGE_UPLOAD_FOLDER"], finalName))
    else:
        finalName = ""
        
    req = postApi.insert(json={"content": content, "imgUrl": finalName}, boardId=boardId)
    posts = boardApi.findPostsByBoardId(boardId, orderByDate=True)
    return render_template("posts.html", posts=posts, board=board)

@app.route("/create-reply/postId=<postId>/boardId=<boardId>", methods=["POST"])
def create_reply(postId, boardId):
    board = boardApi.findById(boardId)
    content = request.form.get("comment")
    imgFile = request.files.get("reply-image")
        
    if imgFile:
        rand = random.randint(1, sys.maxsize)
        finalName = str(rand) + "." + imgFile.filename.split(".")[1]
        if allowed_file(imgFile.filename):
            imgFile.save(os.path.join(app.config["POST_IMAGE_UPLOAD_FOLDER"], finalName))
    else:
        finalName = ""
        
    req = replyApi.insert({"content": content, "imgUrl": finalName}, postId=postId)
    posts = boardApi.findPostsByBoardId(boardId, orderByDate=True)
    return render_template("posts.html", posts=posts, board=board)

@app.route("/create-board", methods=["POST"])
def create_board():
    name = request.form.get("board-name")
    req = boardApi.insert({"name": name})
    return get_boards_list()

@app.route("/get-board/boardId=<boardId>", methods=["GET"])
def get_board(boardId):
    board = boardApi.findById(boardId)
    posts = boardApi.findPostsByBoardId(boardId, orderByDate=True)
    return render_template("posts.html", posts=posts, board=board)

@app.route("/get-boards-list", methods=["GET"])
def get_boards_list():
    boards = boardApi.findAll(orderByDate=True)
    return render_template("boards-list.html", boards=boards)
    
if __name__ == '__main__':
    app.run(debug=True)

