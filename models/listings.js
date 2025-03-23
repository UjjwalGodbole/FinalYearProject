const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    seller_name: String,
    seller_contact:Number,
    book_name:String,
    book_category:String,
    seller_city:String,
    book_price:Number,
    image1_path:String,
    image2_path:String,
    image3_path:String,
    image4_path:String,
    image5_path:String,

});

const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing;

