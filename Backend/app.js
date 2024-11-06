// this function is called after installation
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');




// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err));



// instantiate express instance
const app = express();

// routes
const Authentications = require('./routes/authentication');
const Task = require('./routes/task');



// middleware
app.use(express.json());
app.use('/api/authentication', Authentications);
app.use('/api/task', Task);
app.use('/images', express.static(path.join(__dirname,'images')))
app.use(cors());  // for react api
app.all('*', (req, res) => {
    res.status(404).send({ status: "error",  msg: "Not Found" });
});


app.get('/', (req, res) => {
    res.send('Hello, World!');
})

port = process.env.PORT || 2004 ;
app.listen(port, () => console.log(`Server running on port ${port}`));


