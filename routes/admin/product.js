var express = require('express');
var router = express.Router();

const path = require('path');
const multer = require('multer');
const { ulid } = require('ulid');
const fs = require("node:fs");
const { z } = require('zod');

const { Product } = require('../../db/model');
const validate = require('../../middleware/validate');



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

// ZOD validation scheme
const productSchema = z.object({
    // In this example we will only validate the request body.
    body: z.object({
        // email should be valid and non-empty
        name: z.string().min(1).max(255),
        // password should be at least 6 characters
        price: z.string().min(1).max(255),
        stock: z.string().min(1).max(255)
    }),
});


/* GET product listing. */
router.get('/', async function (req, res, next) {
    const products = await Product.findAll();
    res.json(products);
});

router.post('/', upload.single('image'), validate(productSchema), async function (req, res) {

    let product = req.body;
    
    if (req.file) {
        const image = req.file.filename ?? "https://placehold.co/600x400?text=no%20image";
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
