var express = require('express');
var router = express.Router();

const { Product } = require('../../model');

/* GET product listing. */
router.get('/', async function (req, res, next) {
    const products = await Product.findAll();
    res.json(products);
});

router.post('/', async function (req, res) {
    Product.create(req.body);
    res.status(201).json({
        message: "Produk berhasil ditambahkan"
    });
})

router.put('/:id', async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (product) {
        const updatedProduct = await Product.update(req.body, {
            where: { id: req.params.id }
        });
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

router.delete('/:id', async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if(product) {
        Product.destroy({where: {id: req.params.id}});
        res.json({message: "Produk berhasil dihapus"});
    } else {
        res.status(404).json({message: "Product not found"});
    }
});

module.exports = router;
