const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const swaggerRoutes = require('./routes/swagger');
const port = process.env.PORT || 8080;

const app = express();

app
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        next();
    });

app.get('/', moviesRoutes)
app.use('/movies', moviesRoutes);
app.use('/auth', authRoutes);
app.use('/', swaggerRoutes);


const db = require('./models');

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`DB Connected and server running on ${port}.`);
        });
    })
    .catch((err) => {
        console.log('Cannot connect to the database!', err);
        process.exit();
    });