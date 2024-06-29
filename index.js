const express = require("express");
const {google} = require("googleapis");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

app.get("/", (req,res) => {
    res.render("index");

});

app.post("/", async (req,res) => {

    const {feedback,name} = req.body;
    
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({version: "v4", auth: client});

    const spreadsheetId = "1FUIDGertDMbjAtogKLHLFO_TjeVsIZsCBwq0Qf-VFKU";

    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,

    });

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1!A:A",
    });

    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B",
        valueInputOption: "USER_ENTERED",
        resource: {
           values: [[feedback,name]],
            
        },
    });
    
    
    res.send("Successfully Submitted!! Thank You!!");
});

app.listen(1337, (req,res)=> console.log("running on 1337"));