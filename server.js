const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();
db.sequelize.sync()

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.send('Welcome to this Authenticated and Authorised API, you need to have access right to get to some routes....');
})
require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);

app.listen(port, () => {
    console.log(`App running on port: ${port}`)
})