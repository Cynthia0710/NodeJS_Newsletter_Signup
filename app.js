// API Key
// 9d44b78ed982c19f9b64c4b050ffd591-us10

// Audience List ID
// 86a5ccff6d

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/86a5ccff6d";

    const options = {
        method: "POST",
        auth: "Cytherea:9d44b78ed982c19f9b64c4b050ffd591-us10"
    }

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(`${__dirname}/success.html`);
        } else {
            res.sendFile(`${__dirname}/failure.html`);
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(port, function (req, res) {
    console.log(`Server is running on ${port}.`);
})
