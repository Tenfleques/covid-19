const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const updates = require("./rest/routes/updates");

const app = express();
// Set cors and bodyParser middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./client/build'));


app.get('/updates', updates.updatesHandler);

const PORT = 80;


app.listen(PORT, () => console.log(`Events service listening on port ${PORT}`));
