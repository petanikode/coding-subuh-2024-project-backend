var express = require('express');
var router = express.Router();
const sequelize = require('sequelize');
const { Cart } = require("../db/model");




router.get('/', async (req, res) => {
    const products = await Cart.findAll({
        where: {
            userId: req.user.id
        },
        include: ['product']
    });

    res.status(200).json(products);
})


router.get('/count', async (req, res) => {
    const cartCount = await Cart.sum('quantity', {
        where: {
            userId: req.user.id
        },
    });

    res.status(200).json(cartCount ?? 0);
})

router.get('/total-price', async (req, res) => {
    const items = await Cart.findAll({
        where: {
            userId: req.user.id
        },
        include: ['product']
    });

    let totalPrice = 0;

    items.forEach(item => totalPrice += item.product.price);

    res.status(200).json(totalPrice);
})

router.put('/update-qty/:id', async (req, res) => {

    console.log("BODY: ", req.body);

    const item = await Cart.update(req.body, {
        where: {
            userId: req.user.id,
            id: req.params.id
        },
    });

    res.json({
        message: "Qty updated",
        data: item
    })
})

router.post('/', async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    const existingProductInCart = await Cart.findOne({
        where: {
            userId,
            productId
        }
    });

    if (existingProductInCart) {
        existingProductInCart.increment("quantity").then((value) => {
            res.status(200).json({
                message: "Added to cart by increment the quantity"
            })
        });

        return;
    }

    try {
        const added = await Cart.create({ userId, productId, quantity: 1 });
        res.status(200).json({
          message: "Added to cart",
          data: added
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
});


router.delete('/:id', async (req, res) => {
    const item = await Cart.findByPk(req.params.id);
    if (item) {
        // hapus data dari db
        Cart.destroy({ where: { id: req.params.id } });

        res.json({ message: "Item berhasil dihapus" });
    } else {
        res.status(404).json({ message: "Item not found" });
    }
})

module.exports = router;