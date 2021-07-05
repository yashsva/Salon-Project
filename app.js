const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const Mysql_store = require('express-mysql-session')(session);
const multer = require('multer');
require('dotenv').config();

const customer_routes = require('./routes/customer');
const salon_routes = require('./routes/salon');
const auth_routes = require('./routes/auth');

const sync_db = require('./utils/sync_database');
const db = require('./utils/database');
const storage_config=require('./utils/storage config');
const error_controller=require('./controllers/error_controller');

const app = express();


const session_store = new Mysql_store({
    createDatabaseTable: true,
    expiration: 86400000,
    checkExpirationInterval: 900000
}, db);


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: storage_config.image_storage, fileFilter: storage_config.imageFileFilter }).any());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: session_store,
}))
app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    res.locals.isSalonAdmin=req.session.isSalonAdmin;
    req.customer=req.session.customer;
    next();
})
sync_db.sync();

app.use('/customer', customer_routes);
app.use('/auth', auth_routes);
app.use('/salon', salon_routes);


app.get('/favicon.ico', (req, res, next) => {
    res.send('No icon present');
});

app.get('/', (req, res, next) => {
    res.render('homepage', {
        page_title: "Home"
    });
});

app.get('/500', error_controller.get_error_500);

app.use(error_controller.get_error_404);

const port = process.env.PORT;
app.listen(port, () => {
    console.log("Listening on " + port);
})