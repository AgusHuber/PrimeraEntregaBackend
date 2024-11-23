
import mongoose from 'mongoose';



const cartSchema = new mongoose.Schema({
    id:{type: Number, required: true, unique:true},
    products:[
        {
            product:{type: mongoose.Schema.Types.ObjectId, ref: 'Product', requiered:true},
            quantity:{type: Number, required:true, default:1}
        }
    ]
    
})


const Cart = mongoose.model('Carts', cartSchema);

export default Cart;