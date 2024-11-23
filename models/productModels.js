
import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2';


const productSchema = new mongoose.Schema({
    id:{type: Number, required: true, unique:true},
    title:{type: String, required: true},
    description:{type: String, required: true},
    code:{type: String, required: true, unique:true},
    price:{type: Number, required: true},
    status:{type:Boolean, default:true},
    stock:{type: Number, required: true},
    category:{type: String, required: false, default:{}},
    thumbnails:{type: [String], required: false, default:[]}
    
})

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;