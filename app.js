require('dotenv').config();
const express  = require('express');
const app      = express();
const db       = require('./models/index');
const root     = require('./routes/index');
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
        await db.sequelize.sync();
        await db.sequelize.authenticate();
        app.use('/', root);
        app.listen(PORT, () => {
            console.log('Server is working on port 3300');
        })
    }
    catch (e) {
        console.log(e);
    }
}

start();