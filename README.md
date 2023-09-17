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

Product Images drive link :- https://drive.google.com/drive/folders/1pz7PEplLkPgIw-miLSHkaGyYfJZKvRKd?usp=drive_link


To Post Products on route link = "http://localhost:3000/api/product" :- 
{
    "Title" : "Daniya Powder", 
    "imageUrl" : "https://drive.google.com/file/d/1tkAp1dan4iNneObxkO6JxD3Pckp8q6wb/view?usp=drive_link",
    "basePrice" : 180,
    "discountPer" : null,
    "quantity" : 100,
    "unit" : "kg",
    "category" : null,
    "description" : null,
    "status" : null,
    "discoutedPrice" : null
}
To get all products array just get the route link = "http://localhost:3000/api/product" 
To delete or get a single product route is "http://localhost:3000/api/product/"

To Post Register User route link is = "http://localhost:3000/user/register" :- {
    "firstName" : "Meet",
    "lastName" : "Agarwal",
    "email" : "meetagarwal507@gmail.com",
    "phoneNumber" : 9166684984,
    "password" : "meet@123"
}

To Login User route link is = "http://localhost:3000/user/login" :- {
    "email":"sdf@gmail.com",
    "password":"mesdfet@123"
}
