const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

// This is how you get to use local css and img files etc 
// when hosting on a server.
// app, use express' static feature on the folder public
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req,res) {

    // store var from body of html
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // data in the format required and used by the API
    // In this case, it uses objects.
    const data = {
        // members is an field and it's an array.
        members: [
            {
                // fields supported by the API in this array
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // converting the raw data in JSON format
    const jsonData = JSON.stringify(data);

    // Mailchimp API url
    const url = "https://us2.api.mailchimp.com/3.0/lists/3306347294";

    // options parameter for https.request
    // An object of different supported fields
    const options = {
        method: "POST", //We are specifying to POST instead of GET
        auth: "aqeel:0fb46edd595ba4d6338053f2601de319-us2" //Basic authentication format followed by the API key format as per API guidelines.
    }

    // this is how you use https.request
    // you request to POST and expected a response.
    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        // on response, find data field from response and pass it and parse it and display it.
        // This is for you.
        response.on("data", function (data) {
            console.log(JSON.parse(data));
          })
    })

    // writing the data to POST to the request
    request.write(jsonData);
    //Ending the request.
    request.end();
  });

// Not working for some reason.
app.post("/failure", function (req, res) {
    res.redirect("/");
});

  //process.env.PORT is a dynamic port used when deploying to an actual server. 
  //|| for localhost support at port 3000 also
app.listen(process.env.PORT || 3000, function () { 
    console.log("The server is now running.");
});

// List ID: 3306347294
// API Key: 0fb46edd595ba4d6338053f2601de319-us2