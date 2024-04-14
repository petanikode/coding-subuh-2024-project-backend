var express = require("express");
var router = express.Router();
const { Cart, Transaction } = require("../db/model");

const XENDIT_SECRET_API_KEY = process.env["XENDIT_SECRET_API_KEY"];

const { Xendit } = require("xendit-node");
const authToken = require("../middleware/authToken");

const xenditClient = new Xendit({
  secretKey: XENDIT_SECRET_API_KEY,
});

const { Invoice } = xenditClient;

router.post("/", authToken, async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body;

  console.log("ITEMS TERKIRIM: ", items);

  try {
    let total = 0;
    items.forEach(
      (i) => (total += Number(i.product.price) * Number(i.quantity)),
    );

    console.log("TOTAL: ", total);

    // simpan data tranasaksi ke database
    const transactionCreated = await Transaction.create({
      userId,
      details: items,
      total,
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
        items: items.map((i) => {
          return {
            name: i.product.name,
            price: Number(i.product.price),
            quantity: Number(i.quantity),
          };
        }),
      },
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
          userId,
        },
      });

      res.json({
        message: "Tranasaksi berhasi dibuat",
        invoiceUrl: xenditResponse.invoiceUrl,
        data: transactionCreated,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// /payment/callback
router.post("/callback", async (req, res) => {
  console.log(req.body);
  try {
    const XENDIT_CALLBACK_TOKEN = process.env["XENDIT_CALLBACK_TOKEN"];

    if (req.headers["x-callback-token"] !== XENDIT_CALLBACK_TOKEN) {
      return res.status(401).json({
        message: "invalid token",
      });
    }

    const trx = await Transaction.findOne({
      where: {
        invoiceId: req.body.id
      }
    });

    if (!trx) {
      return res.status(404).json({
        message: "Tranasaction not found",
      });
    }

    if (req.body.status === "PAID") {
      trx.status = "PAID";
      trx.save();

      return res.json({
        message: "Pembayaran berhasil",
      });
      // TODO: update stock produk setelah sukses bayar
    } else {
      trx.status = "CANCELED";
      trx.save();

      return res.json({
        message: "Pembayaran gagal",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

module.exports = router;
