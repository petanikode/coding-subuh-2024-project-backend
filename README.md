# Simple E-Comerce API

API untuk toko online

# List of endpoint

- `/auth/` -- admin authenticatio   n
- `/admin/product` -- product management (CRUD product)
- `/admin/transaction` -- transaction list made by user/customer
- `/cart` -- customer cart (list product in customer cart)
- `/checkout` -- customer checkout (trx, payment)


# Endpoints

URL: `/available-products`

```json
{
    "error": false,
    "message": null,
    "data": [
        {
            "id": 123,
            "name": "infinix Pro",
            "price": 1234567,
            "image": "infinix.jpg"
        },
        {
            "id": 123,
            "name": "infinix Pro",
            "price": 1234567,
            "image": "infinix.jpg"
        },
        {
            "id": 123,
            "name": "infinix Pro",
            "price": 1234567,
            "image": "infinix.jpg"
        },
    ]
}
```