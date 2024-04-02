# Simple E-Comerce API

API untuk toko online

# List of endpoint

- `/register/` -- User registrations
- `/auth/` -- admin authentication
- `/admin/product` -- product management (CRUD product)
- `/admin/transaction` -- transaction list made by user/customer
- `/cart` -- customer cart (list product in customer cart)
- `/checkout` -- customer checkout (trx, payment)


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