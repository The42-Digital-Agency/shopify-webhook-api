require('dotenv').config();
const express  = require('express');
const app      = express();
const router     = require('./routes/mainRouter');
app.use(
    express.json({
        limit: '50mb',
        verify: (req, res, buf) => {
            req.rawBody = buf
        }
    })
)

const PORT = process.env.PORT || 3300;
const start = async () => {
    try {
        app.use('/', router);
        app.listen(PORT, () => {
            console.log('Server is working on port 3300');
        })
    }
    catch (e) {
        console.log(e);
    }
}

start();