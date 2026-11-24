+++
title = "Payment"
date = 2026-11-23
updated = 2026-11-23
+++

When a customer click "Place the order", the payment details move across the customer, the merchant, and the bank.
<!-- more -->

## Payment flow

1.  Placing an order sends the customer's order data (customer ID, product ID, quantity) and payment data (card token, wallet pass, or bank login) to the merchant's checkout processor via HTTPS POST request.
1.  The checkout processor creates an order in the order table and also a payment in the payment table.
    -   order table
        -   order_id
        -   order_idempotency_key
        -   customer_id
        -   product_id
        -   quantity
        -   status (created/paid/completed)
    -   payment table
        -   payment_id
        -   payment_idempotency_key
        -   order_id
        -   status (created/approved/declined)
1.  The checkout processor sends an ISO-8583-format authorization request via TCP through the card network or banking rails to the customer's bank for authorization approval.
    -   The authorization request contains a payment idempotency key so the bank doesn't process the same payment twice.
1.  The bank checks the credit limit or account balance and fraud risk signals.
    -   If any of the checks fails, the bank replies with a declination.
    -   If all checks pass, the bank holds the funds and replies with an approval.
    -   In a few days, the bank settles the actual funds and lets the merchant capture the funds.
1.  The checkout processor digests the response and updates the order table and payment table and redirects the customer to the result page.
    -   If the bank's response is dropped mid-way and the request times out, the checkout processor can retry the request (with the payment idempotency key) or ask the customer to pay with another payment method, which creates another payment record in the payment table.
    -   If the checkout processor cannot get the response for the first payment even with retries, but gets an approval for the second payment, then the checkout processor can either send an authorization reversal request (with an authorization reversal idempotency key) to the bank to cancel the first payment, or rely on the bank's automatic expiration to release the uncaptured funds of the first payment.

## References
