const { Sequelize, Model, DataTypes, UUIDV4, HasOne } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Define all model
class User extends Model { }
User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
        type: DataTypes.ENUM("admin", "customer"),
        defaultValue: "customer"
    },
}, { sequelize, modelName: 'user' });


class Product extends Model { }
Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    stock: DataTypes.INTEGER,
}, { sequelize, modelName: 'product' })

class Cart extends Model { }
Cart.init({
    quantity: DataTypes.INTEGER,
}, { sequelize, modelName: 'cart' })

class Transaction extends Model { }
Transaction.init({
    date: DataTypes.STRING,
    // TODO
}, { sequelize, modelName: 'transaction' })

class TransactionItem extends Model {}
TransactionItem.init({

}, { sequelize, modelName: 'transactionItem' })


// Define relationship
User.hasMany(Transaction)
User.hasMany(Cart)

Cart.belongsTo(User)
Cart.belongsTo(Product)

Transaction.hasMany(TransactionItem)
TransactionItem.hasOne(Product)

// Sync models with database
sequelize.sync();

module.exports = {
    User,
    Product,
    Cart,
    Transaction,
    TransactionItem
}