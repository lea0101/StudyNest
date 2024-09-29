from flask import Flask, render_template

app = Flask(
        __name__,
        template_folder="./template",
        static_folder="./static",
        )
@app.route("/")
def home_page():
    return render_template('index.html')



# This makes it so that we don't need to restart the app when changes are made
if __name__ == "__main__":
    app.run(debug=True)

