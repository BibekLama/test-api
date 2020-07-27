const express = require('express');

const http = require('http');

const morgan = require('morgan');

const bodyParser = require('body-parser');

const path = require('path');

const handlebars = require('express-handlebars');

const moment = require('moment');

require('dotenv').config();



const app = express();

const server = http.createServer(app);

const testAPIRouter = require('./routers/api/tws');
const testWebRouter = require('./routers/web/tws');

app.use(express.static(path.join(__dirname, 'public')))

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectDB = require('./middlewares/db');
connectDB.connect();

app.set("view engine", 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: path.join(__dirname, '/views/layouts'),
    extname: 'hbs',
    helpers: {
        formatDate: function (date, format) {
            return moment(date, "YYYYMMDD").fromNow();
        }
    }
}));

app.use('/', testWebRouter);

app.use('/api/tws', testAPIRouter);

app.use((req, res, next) => {
    const error = new Error("Not Found!");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


server.listen(process.env.PORT || 5000, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT || 5000}`)
});

