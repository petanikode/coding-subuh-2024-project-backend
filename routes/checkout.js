var express = require('express');
var router = express.Router();
const sequelize = require('sequelize');
const { Cart, Transaction } = require("../db/model");

// NOTE: seharusnya nggak di hardcode di sini
const XENDIT_SECRET_API_KEY = "xnd_development_EqauLIMFflfTPXB1w58Ca79xr2PFI4IFYW1ak1dtxIBkVtjFl3t9JJzYbpSTfG";

const { Xendit } = require('xendit-node');

const xenditClient = new Xendit({
    secretKey: XENDIT_SECRET_API_KEY,
})

const { Invoice } = xenditClient

router.post('/', async (req, res) => {
    const userId = req.user.id;
    const { items } = req.body;

    console.log("ITEMS TERKIRIM: ", items)

    try {

        let total = 0;
        items.forEach(i => total += Number(i.product.price) * Number(i.quantity));

        console.log("TOTAL: ", total)

        const transactionCreated = await Transaction.create({
            userId,
            details: items,
            total
        });

        // buat invoice dengan payment gateway
        const xenditResponse = await Invoice.createInvoice({
            data: {
                amount: total,
                invoiceDuration: 172800,
                externalId: transactionCreated.id,
                description: "Pembayaran produk di Aplikasi Toko",
                currency: "IDR",
                reminderTime: 1,
                items: items.map(i => {
                    return {
                        name: i.product.name,
                        price: Number(i.product.price),
                        quantity: Number(i.quantity)
                    }

                })
            }
        });

        console.log("XENDIT_______", xenditResponse);

        if (xenditResponse) {
            // simpan invoice ke tabel transaski
            transactionCreated.invoiceId = xenditResponse.id;
            transactionCreated.invoiceUrl = xenditResponse.invoiceUrl;
            await transactionCreated.save();

            // hapus semua item di keranjang user
            await Cart.destroy({
                where: {
                    userId
                }
            })


            res.json({
                message: "Tranasaksi berhasi dibuat",
                invoiceUrl: xenditResponse.invoiceUrl,
                data: transactionCreated
            })
        }

        
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
});

// /payment/callback
router.post('/callback', async (req, res) => {
    // TODO: update stock produk setelah sukses bayar
    console.log(req.body);
});

module.exports = router;