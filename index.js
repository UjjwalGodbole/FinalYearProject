const express = require("express")
const app = express()
const port = 8080
const path = require("path")
const methodOverride = require('method-override')
const mongoose = require("mongoose");
const Listing = require("./models/listings.js")

app.set("view engine","ejs")
app.set("views",path.join((__dirname),"views"))

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join((__dirname),"/public")))
app.use('/uploads', express.static('public/uploads'));
app.use(methodOverride('X-HTTP-Method-Override'))

main()
.then((res)=>console.log("mongodb connected!"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/bookwebsite');
}

// routes
app.get("/",(req,res)=>{
    res.send(`<b>serach:</b><h1>/home</h1>`)
})
//Academic page
app.get("/home/academic",async(req,res)=>{
    const posts = await Listing.find()
    res.render("academic.ejs",{posts})
})
// fiction route
app.get("/home/fiction",async(req,res)=>{
    const posts =  await Listing.find()
    res.render("fiction.ejs",{posts})
})
// self-help route
app.get("/home/selfhelp",async(req,res)=>{
    const posts =  await Listing.find()
    res.render("selfhelp.ejs",{posts})
})
// nonfiction route
app.get("/home/nonfiction",async(req,res)=>{
    const posts =  await Listing.find()
    res.render("nonfiction.ejs",{posts})
})
//all books route
app.get("/home/allbooks",async(req,res)=>{
    const posts = await Listing.find()
    res.render("allbooks.ejs",{posts})
})

//home route
app.get("/home",async(req,res)=>{
    const posts = await Listing.find()
    res.render("index.ejs",{posts})
})

//account route
app.get("/home/login/account",(req,res)=>{
    res.render("account.ejs")
})
// sell your book
app.get("/home/login/sellyourbook",(req,res)=>{
    res.render("sellyourbook.ejs")
})

app.post("/home", async(req, res) => {
    const { seller_name, seller_contact, seller_city, book_name, book_category, book_price, 
            image1_path, image2_path, image3_path, image4_path, image5_path } = req.body;
    function cleanPath(imagePath) {
        if (!imagePath) return "";
        
        // Convert Windows-style backslashes to forward slashes
        let cleanedPath = imagePath.replace(/\\/g, "/").replace("public/uploads/", "uploads/");
        
        // Ensure it does not start with an unwanted leading slash
        return cleanedPath.startsWith("/") ? cleanedPath : `/${cleanedPath}`;
    }
    
    const cleanImage1Path = cleanPath(image1_path);
    const cleanImage2Path = cleanPath(image2_path);
    const cleanImage3Path = cleanPath(image3_path);
    const cleanImage4Path = cleanPath(image4_path);
    const cleanImage5Path = cleanPath(image5_path);
    const newPost = {
        seller_name,
        seller_contact,
        seller_city,
        book_name,
        book_category,
        book_price,
        image1_path: cleanImage1Path,
        image2_path: cleanImage2Path,
        image3_path: cleanImage3Path,
        image4_path: cleanImage4Path,
        image5_path: cleanImage5Path,
    };
    console.log(book_category)
    const post = await Listing(newPost)
    await post.save()
    res.redirect("/home");
});
//show route
app.get("/home/:id",async(req,res)=>{
    let {id} = req.params
    const post = await Listing.findById(id)
    const posts = await Listing.find()
    res.render("show.ejs",{post,posts})
})

//cart page
app.get("/posts/cart",async(req,res)=>{
    const posts = await Listing.find()
    res.render("cart.ejs",{posts})
})
//acount page
app.get("/posts/account",(req,res)=>{
    res.render("account.ejs")
})
//help center route
app.get("/posts/helpcenter",(req,res)=>{
    res.render("help.ejs")
})
app.listen(port,()=>{
    console.log("server running!")
})