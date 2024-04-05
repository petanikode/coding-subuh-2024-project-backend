var express = require('express');
var router = express.Router();

const path = require('path');
const multer = require('multer');
const { ulid } = require('ulid');
const fs = require("node:fs");

const { Product } = require('../../db/model');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads')
    },
    filename: function (req, file, cb) {
        fileExtension = path.extname(file.originalname);
        cb(null, ulid() + fileExtension)
    }
})

const upload = multer({ storage: storage })

function removeUploadedFile(filename) {
    return fs.unlinkSync("public/images/uploads/" + filename);
}


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

router.put('/:id', upload.single('image'), async (req, res) => {
    const oldProduct = await Product.findByPk(req.params.id);
    if (oldProduct) {
        let newProduct = req.body;

        if (req.file) {
            try {
                // remove old uploaded file
                removeUploadedFile(oldProduct.image);

                const image = req.file.filename ?? "https://placehold.co/600x400?text=no%20image";
                newProduct = { ...newProduct, image }
            } catch (error) {

            }
        }

        const updatedProduct = await Product.update(newProduct, {
            where: { id: req.params.id }
        });
        res.json({
            message: "Produk berhasil diupdate",
            data: updatedProduct
        });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

router.delete('/:id', async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (product) {
        // hapus data dari db
        Product.destroy({ where: { id: req.params.id } });
        try {            
            // hapus image
            removeUploadedFile(product.image);
        } catch (error) {
            
        }

        res.json({ message: "Produk berhasil dihapus" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

module.exports = router;
