const express = require("express")
const app = express()
const port = 8080
const path = require("path")
const methodOverride = require('method-override')
const { v4: uuidv4 } = require('uuid');
const multer = require("multer");
uuidv4();
const { faker } = require('@faker-js/faker');

app.set("view engine","ejs")
app.set("views",path.join((__dirname),"views"))

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join((__dirname),"/public")))
app.use(methodOverride('X-HTTP-Method-Override'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    }
  });
  
  const upload = multer({ storage: storage });

let posts= [
    {
        id: uuidv4(),
        book : "Ikigai",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/81l3rZK4lnL.jpg","https://booksandyou.in/cdn/shop/files/Ikigai_5.jpg?v=1694272361&width=1445","https://i.pinimg.com/736x/92/ee/17/92ee17f8c93032630c90ef3fa7583708.jpg","https://miro.medium.com/v2/resize:fit:1400/1*Vr1oxXrW2d14QQDKxjSmLQ.jpeg","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAcrPf7wGREIdPhObP7sxwmDxG1imyxKFKJQ&s"],
    },
    {
        id: uuidv4(),
        book : "the power of subconscious mind",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/81gTwYAhU7L._AC_UF1000,1000_QL80_.jpg","https://www.shethbooks.com/wp-content/uploads/2021/08/Insight-Press-The-Power-Of-Your-Subconscious-Mind-7.jpg","https://cdn.exoticindia.com/images/products/original/books-2019-013/nau451b.jpg","https://qph.cf2.quoracdn.net/main-qimg-22c8b81ebeccc088354b7b0886b2b3b5-lq","https://5.imimg.com/data5/SELLER/Default/2022/8/KH/TK/ZA/42979125/back-500x500.jpg"]
    },
    {
        id: uuidv4(),
        book : "the four hour work week",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/61xpaBcQkcL.jpg"]
    },
    {
        id: uuidv4(),
        book : "Atomic Habits",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/81F90H7hnML.jpg"]

    },
    {
        id: uuidv4(),
        book : "The 7 Habits of Highly Effective People",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/71Koyhv2bML._AC_UF1000,1000_QL80_.jpg"],
    },
    {
        id: uuidv4(),
        book : "Deep Work",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/71din4TLubL._UF1000,1000_QL80_.jpg"]
    },
    {
        id: uuidv4(),
        book : "The Power of Now",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/61Ij8nLooNL._UF1000,1000_QL80_.jpg"]
    },
    {
        id: uuidv4(),
        book : "Rich Dad Poor Dad",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/81BE7eeKzAL._AC_UF1000,1000_QL80_.jpg"]
    },
    {
        id: uuidv4(),
        book : "Meditations",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/81DFDGzHZqL.jpg"]
    },
    {
        id: uuidv4(),
        book : "The Alchemis",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/61HAE8zahLL._AC_UF1000,1000_QL80_.jpg"]
    },
    {
        id: uuidv4(),
        book : "Sapiens",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/713jIoMO3UL.jpg"]
    },
    {
        id: uuidv4(),
        book : "Man's Search for Meaning",
        seller:faker.internet.username(),
        city: faker.location.city(),
        price : faker.commerce.price(100, 1000, 2, '₹'),
        images:["https://m.media-amazon.com/images/I/61157LApbuL.jpg"]
    },
]
// routes
app.get("/",(req,res)=>{
    res.send(`<b>serach:</b><h1>/home</h1>`)
})
//home route
app.get("/home",(req,res)=>{
    res.render("index.ejs",{posts})
})
//show route
app.get("/home/:id",(req,res)=>{
    let {id} = req.params
    let post = posts.find((p)=>id ===p.id)
    res.render("show.ejs",{post,posts})
})
//account route
app.get("/home/login/account",(req,res)=>{
    res.render("account.ejs")
})
// sell your book
app.get("/home/login/sellyourbook",(req,res)=>{
    res.render("sellyourbook.ejs")
})
// app.post("/home", upload.fields([{ name: 'mainimg' }, { name: 'img1' }, { name: 'img2' }, { name: 'img3' }, { name: 'img4' }]), (req, res) => {
//     const { book, seller, city,price } = req.body;
//     let id = uuidv4()
//     const mainimg = req.files['mainimg'] ? `/uploads/${req.files['mainimg'][0].filename}` : '/uploads/default.jpg';
//     const img1 = req.files['img1'] ? `/uploads/${req.files['img1'][0].filename}` : '/uploads/default.jpg';
//     const img2 = req.files['img2'] ? `/uploads/${req.files['img2'][0].filename}` : '/uploads/default.jpg';
//     const img3 = req.files['img3'] ? `/uploads/${req.files['img3'][0].filename}` : '/uploads/default.jpg';
//     const img4 = req.files['img4'] ? `/uploads/${req.files['img4'][0].filename}` : '/uploads/default.jpg';

//     posts.push({price, book, seller, id, city, images: [mainimg, img1, img2, img3, img4] });

//     res.redirect("/home");
//   });
app.post("/home", upload.fields([
    { name: 'mainimg' }, { name: 'img1' }, { name: 'img2' }, { name: 'img3' }, { name: 'img4' }
]), (req, res) => {
    const { book, seller, city, price } = req.body;
    let id = uuidv4();

    const mainimg = req.files['mainimg'] ? `/uploads/${req.files['mainimg'][0].filename}` : '/uploads/default.jpg';
    const img1 = req.files['img1'] ? `/uploads/${req.files['img1'][0].filename}` : '/uploads/default.jpg';
    const img2 = req.files['img2'] ? `/uploads/${req.files['img2'][0].filename}` : '/uploads/default.jpg';
    const img3 = req.files['img3'] ? `/uploads/${req.files['img3'][0].filename}` : '/uploads/default.jpg';
    const img4 = req.files['img4'] ? `/uploads/${req.files['img4'][0].filename}` : '/uploads/default.jpg';

    posts.push({ price, book, seller, id, city, images: [mainimg, img1, img2, img3, img4] });

    res.redirect("/home");
});

  
//cart page
app.get("/posts/cart",(req,res)=>{
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