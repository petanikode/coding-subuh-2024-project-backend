var express = require('express');
var router = express.Router();

const path = require('path');
const multer = require('multer');
const { ulid } = require('ulid');

const { Product } = require('../../db/model');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        fileExtension = path.extname(file.originalname);
        cb(null, ulid() + "." + fileExtension)
    }
})

const upload = multer({ storage: storage })


/* GET product listing. */
router.get('/', async function (req, res, next) {
    const products = await Product.findAll();
    res.json(products);
});

router.post('/', upload.single('image'), async function (req, res) {

    let product = req.body;
    const image = req.file.filename ?? "https://placehold.co/600x400?text=no%20image";

    if (req.file) {
        product = { ...product, image }
    }

    const addedProduct = await Product.create(product);

    res.status(201).json({
        message: "Produk berhasil ditambahkan",
        data: addedProduct
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
    if (product) {
        Product.destroy({ where: { id: req.params.id } });
        res.json({ message: "Produk berhasil dihapus" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

module.exports = router;
