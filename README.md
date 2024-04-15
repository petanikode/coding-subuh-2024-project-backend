# Simple E-Comerce API

API untuk toko online

# List of endpoint

- POST `/register/` -- User registrations
- POST `/auth/` -- admin authentication
- GET `/me` -- get current logged user
- GET, POST`/admin/product` -- product management (CRUD product)
- GET, PUT, DELETE `/admin/product/:id` -- get product by ID or update/delete product by ID
- GET `/admin/transactions` -- transaction list made by user/customer
- POST, GET `/cart` -- customer cart (list product in customer cart)
- POST `/checkout` -- customer checkout (trx, payment)
- GET `/transactions/` -- list of transaction that user made


# Endpoints

## Registration

- URL: `/register`
- Method: `POST`
- Body: 

    ```json
    {
        "name": "John Doe",
        "email": "john@doe.com",
        "phoneNumber": "123",
        "password": "123"
    }
    ```

Response:

```json
{
    "error": false,
    "message": "User berhasil daftar"
}
```


<!-- URL: `/available-products`

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
``` -->