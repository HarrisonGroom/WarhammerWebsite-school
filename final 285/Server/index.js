//Libraries
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const { check, checkSchema, validationResult } = require('express-validator')
const faction = require('./Model/factions');
const leader = require('./Model/leader');

//Setup defaults for script
const app = express();
app.use(express.static('public'))
app.use(cors());
const upload = multer()
const port = 80 //Default port to http server

/*const connection = mysql.createConnection({
    host: "bsu-gimm260-fall-2021.cwtgn0g8zxfm.us-west-2.rds.amazonaws.com",
    user: "HarrisonGroom",
    password: "UKxtrZLYaEJInUoYMkls4Shvca9S7J5qeA3",
    database: 'HarrisonGroom'
});
*/
//validation


//The * in app.* needs to match the method type of the request
 app.get('/leader/', 
 upload.none(), 
 async (request, response) => {
    let result = ''
    try {
       result =  await leader.getAllLeaders(request.query);
    } catch (error) {
        console.log(error);
        return response
            .status(500) //Error code when something goes wrong with the server
            .json({ message: 'Something went wrong with the server.' });
    }
    //Default response object
    response
        .json({ 'data': result });
});



// faction refactored into leader.js
app.get(
    '/factions/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
           result =  await faction.getfaction(request.query);
    
        } catch (error) {
            console.log(error);
            return response
                .status(500) //Error code when something goes wrong with the server
                //Prevent CORS error
                .json({ message: 'Something went wrong with the server.' });

        }
        //Default response object
        response
            //Prevent CORS error
            .json({ 'data': result });
    });

// update, refactored into factions.js
app.put(
    "/leader/:id/",
    upload.none(),
    check('leader', 'Please enter the leaders name.').isLength({ min: 1 }),
    check('role', 'Please enter the role of the leader.').isLength({ min: 1 }),
    check('sub_faction', 'Please enter their sub faction.').isLength({ min: 1 }),
    check('faction_id', 'Please select which faction they are apart of.')
        .isIn(['1', '2', '3', '4', '5', '6', '7']),
    async (request, response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response
                .status(400)
                //Prevent CORS error
                .json({
                    message: 'Request fields or files are invalid.',
                    errors: errors.array(),
                    console: console.log(errors)
                });
        }
        try {
            
            await leader.update(request.body);

        } catch (error) {
            return response
                .status(400) //Error code when something goes wrong with the server
                .json({ message: 'Something went wrong with the server.' });
        }
        //Default response object
        response
            .json({ message: 'Form submission was succesful!' });
    })


//delete,  
app.delete("/leader/:id/",
    upload.none(),
    async (request, response) => {
        try {
            console.log(request.params.id);
            await leader.Deleteform(request.params.id);
        } catch (error) {
            console.log(error);
            return response
                .status(400) //Error code when something goes wrong with the server
                .json({ message: 'Something went wrong with the server. part 1' });

        }
        //Default response object
        response
            .json({'data' : result,
                message: 'It was deleted!'});
    })



//Action to get response values
//getValues, refactored into factions
app.get('/leader/:id/',
    upload.none(),
    async (request, response) => {
        result = {};
        try {
         result =   await leader.getvalues(request.params.id);

        } catch (error) {
            return response
                .status(400) //Error code when something goes wrong with the server
                //Prevent CORS error
                .json({ message: 'Something went wrong with the server.' });

        }
        //Default response object
        response
            //Prevent CORS error
            .json({ 'data' : result});


    })


//Action to handle form submission
app.post(
    '/leader/',
    upload.none(),
    check('leader', 'Please enter the leaders name.').isLength({ min: 1 }),
    check('role', 'Please enter the role of the leader.').isLength({ min: 1 }),
    check('sub_faction', 'Please enter their sub faction.').isLength({ min: 1 }),
    check('faction_id', 'Please select which faction they are apart of.')
        .isIn(['1', '2', '3', '4', '5', '6', '7']),

    async (request, response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response
                .status(400)
                .json({
                    message: 'Request fields or files are invalid.',
                    errors: errors.array(),
                    console: console.log(errors)
                });
        }
 console.log(request.body);
        try {
            await leader.insert(request.body);

        } catch (error) {
            console.log(error);
            return response
                .status(500) //Error code when something goes wrong with the server
                .json({ message: 'Something went wrong with the server.' });

        }
        //Default response object
        response
            .json({ message: 'Form submission was succesful!' });
    });

app.listen(port);