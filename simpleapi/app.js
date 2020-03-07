const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
// db connection

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Mongodb connected"))
.catch(err => console.log(err))


//Routers
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

app.use(express.json());

//route middlewares.
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)



const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Application start at ${PORT}`));
