from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "ganova_secret_key"

# Demo login credentials
USERNAME = "admin"
PASSWORD = "ganova123"

# Earrings data (£5–£30)
EARRINGS = [
    {"name": "Basic Studs", "price": 5},
    {"name": "Small Hoops", "price": 10},
    {"name": "Classic Dangles", "price": 15},
    {"name": "Handmade Beaded", "price": 20},
    {"name": "Gold Statement", "price": 25},
    {"name": "Premium Custom", "price": 30}
]

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        if (
            request.form["username"] == USERNAME
            and request.form["password"] == PASSWORD
        ):
            session["user"] = USERNAME
            return redirect(url_for("shop"))
    return render_template("login.html")

@app.route("/shop")
def shop():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("shop.html", earrings=EARRINGS)

@app.route("/contact", methods=["POST"])
def contact():
    name = request.form["name"]
    email = request.form["email"]
    message = request.form["message"]
    print("Message received:", name, email, message)
    return redirect(url_for("shop"))

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
