require('dotenv').config();
const express  = require('express');
const app      = express();
app.use(express.json());

const PORT = process.env.PORT || 3300;
const start = () => {
    try {
        app.use('/', require('./routes/mainRouter'));
        app.listen(PORT, () => {
            console.log('Server is working on port 3300');
        })
    }
    catch (e) {
        console.log(e);
    }
}

start();