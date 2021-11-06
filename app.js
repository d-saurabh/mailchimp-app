const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { url } = require("inspector");
const { json } = require("body-parser");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/{AUDIENCE_ID}";
    const option = {
        method: "POST",
        auth: "root:{API_KEY}"
    };

    const request = https.request(url, option, function(response) {
        if (response.statusCode !== 200) {
            res.sendFile(__dirname + "/failure.html")
        } else {
            res.sendFile(__dirname + "/success.html")
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("application listening to :3000");
});