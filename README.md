# ecommerce-website
This repo is create for creating a website for agarwalfoods.co.in
Agarwal Foods Web

	For Images :- Image
	For Title :- Title
	For Description :- Description
	Post Data :- /api/home/ComponentName/
	Read Data :- /api/home/ComponentName/ 
	To Delete :- /api/home/ComponentName/TitleName

In Home

	Home
	Carousel
	Category
	Best Sellers
	New Arrival
	Carousel 2
	Recipe India
	What They Say
	Features
	Footer

Product Images drive link :- https://www.linkedin.com/feed/update/urn:li:activity:7095056898390945792?utm_source=share&utm_medium=member_android

https://drive.google.com/drive/folders/1pz7PEplLkPgIw-miLSHkaGyYfJZKvRKd?usp=drive_link











npm install cors

const cors = require('cors');

const allowedOrigins = ['http://localhost:5500'];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the requesting origin is allowed
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
