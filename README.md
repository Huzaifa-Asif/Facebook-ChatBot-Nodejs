## Description

Nodejs (Express) application to manage facebook messenger ChatBot. 

Deployed url: [https://chatbot-respond-io.herokuapp.com/](https://chatbot-respond-io.herokuapp.com/)

#### The ChatBot have the following functionality: 

- Messenger Built-in NLP to manage replies for traits: Greeting, Thanks & Bye
- General queries about the products.
    - If Customer sends a message says `/desc product-xyz` where product-xyz is the "Product ID", customer will get a reply message with the respective product description.
    - If Customer sends a message says `/price product-xyz` where product-xyz is the "Product ID", customer will get a reply message with the respective product price.
    - If Customer sends a message says `/shipping product-xyz` where product-xyz is the "Product ID", customer will get a reply message with the respective product shipping fee.
- If customer wants to buy a product. System admin will receive an email notification.
    - If Customer sends a message says `/buy product-xyz` where product-xyz is the "Product ID", customer will get a reply message: thanks for placing an order, our customer representative will get touch with you.
    - The Email notification will be sent to admin that contain all the product details.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

After running start command you can access app on url: [http://localhost:8000/](http://localhost:8000/)