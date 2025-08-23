const conntectDB = require('./database');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000
const contactRouter = require('./router/contact.router');
const cloudinary = require('./cloudinary/cloudConfig')

const listingModel = require('./schema/listing.model');

const data = require('./data')

conntectDB();

console.log(cloudinary.config());
app.use(cors())
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send("Welcome to my page ")
});

app.get('/api/self/addListing', async(req, res) => {
    const response = await listingModel.insertMany(data.data)
    res.send("add list")
})

app.use('/api/contact', contactRouter)
app.use('/api/v3.2/auth', require('./router/auth.routes'))
app.use('/api/v3.2/post', require('./router/listing.routes'))
app.use('/api/v3.2/rating', require('./router/rating.routes'))
app.use('/api/v3.2/comment', require('./router/comment.routes'))

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`)
})