const { bookshelf } = require('../db');

const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'order_items',
    product() {
        return this.belongsTo('Product', 'product_id');
    },
    order() {
        return this.belongsTo('Order', 'order_id');
    },
});
//add amount and price, copy from product
module.exports = OrderItem;