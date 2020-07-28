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

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectDB = require('./middlewares/db');
connectDB.connect();

app.engine('hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        formatDate: function (date, format) {
            return moment(date, "YYYYMMDD").fromNow();
        },
        isEmpty: (value) => {
            return value === '';
        },
        isNotEmpty: (value) => {
            return value !== '';
        },
        isEquals: (value1, value2) => {
            return value1 == value2;
        }
    }
}));
app.set("view engine", 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/font-awesome'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/node_modules/popper.js/dist'));

app.use('/tws', testWebRouter);

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

