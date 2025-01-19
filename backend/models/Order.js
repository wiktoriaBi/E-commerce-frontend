const { bookshelf } = require('../db');

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    status() {
        return this.belongsTo('OrderStatus', 'status_id');
    },
    items() {
        return this.hasMany('OrderItem');
    },
    opinion() {
        return this.hasOne('Opinion', 'order_id');  // Assuming 'order_id' in opinions table
    }
});

module.exports = Order;