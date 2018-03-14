const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
    qty: {type: Number, default: 1}
});

module.exports = mongoose.model('order', orderSchema);
