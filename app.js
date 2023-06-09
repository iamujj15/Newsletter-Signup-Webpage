import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFile } from 'fs/promises';
import client from '@mailchimp/mailchimp_marketing';

const kk = JSON.parse(
    await readFile(
        new URL("./keys.json", import.meta.url)
    )
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', async function(req, res){
    let fName = req.body.fName;
    let lName = req.body.lName;
    let email = req.body.email;
    
    client.setConfig({
        apiKey: kk.apiKey,
        server: kk.server,
    });

    let ercnt = undefined;
    
    const run = async function(){
        const response = await client.lists.batchListMembers(kk.listID, {
            members: [{
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }],
        });
        if (response.error_count > 0)
        {
            res.sendFile(__dirname + '/failure.html');
        }
        else
        {
            res.sendFile(__dirname + '/success.html');
        }
    };
    run();
});

app.post('/failure', function(req, res){
    res.redirect('/');
});

app.listen(process.env.PORT || 3000);