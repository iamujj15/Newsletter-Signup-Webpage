import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import client from '@mailchimp/mailchimp_marketing';

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
        apiKey: "9961fa77ffb092e9d4856c7e79a2553a-us21",
        server: "us21",
    });

    let ercnt = undefined;
    
    const run = async function(){
        const response = await client.lists.batchListMembers("ab7d576ded", {
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

app.listen(3000, function(){
    console.log('Server is running on port 3000');
});

//API Key
//9961fa77ffb092e9d4856c7e79a2553a-us21

//List ID
//ab7d576ded