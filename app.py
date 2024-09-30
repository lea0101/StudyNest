from flask import Flask, render_template, request
from flask_socketio import SocketIO
from flask_cors import CORS

# Instantiate flask app with secret key
# Use template for .html
# Use static for static .css, .js, etc.
app = Flask(
        __name__,
        template_folder="./template",
        static_folder="./static",
        )

app.config['SECRET_KEY'] = 'thesupersecretkey'

# Initialize CORS, allowing cross-origin resource sharing
# Setting the resource parameter allows for app to share with all origins
CORS(app, resources={r"/*":{"origins":"*"}})

# Instantiate socketio
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('message')
def handle_message(msg):
    print('Received message: ', msg)
    socketio.emit('message!!', msg, broadcast=True)


@app.route("/", methods=['GET', 'POST'])
def home_page():
    if request.method == 'POST':
        if "button_room_1" in request.form:
            return render_template('room.html', roomid=1)
        elif "button_room_2" in request.form:
            return render_template('room.html', roomid=2)
    elif request.method == 'GET':
        return render_template('index.html')
    return render_template('index.html')

@app.route("/room1")
def room_page():
    return render_template('room.html', roomid=1)

@app.route("/room2")
def room_page1():
    return render_template('room.html', roomid=2)

# This makes it so that we don't need to restart the app when changes are made
if __name__ == "__main__":
    socketio.run(app, debug=True)

