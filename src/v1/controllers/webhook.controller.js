const axios = require("axios");
const productController = require("./product.controller");
const emailNotification = require("#helpers/emailNotification.helper");
const { RANDOM_MESSAGES, NLP_ENTITIES, COMMANDS, COMMANDS_LIST, PRODUCT_DATA_NOT_FOUND, ORDER_MESSAGE } = require("#constants/index.constant");

const getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      return res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      return res.sendStatus(403);
    }
  }
};

const postWebhook = (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(async function (entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;

      // Check if the event is a message
      if (webhook_event.message && sender_psid != process.env.PAGE_ID) {
        const command = webhook_event.message?.text.split(" ")[0];
        const productId = (COMMANDS_LIST.includes(command)) ? webhook_event.message?.text.split(" ")[1] : null;
        if (command == COMMANDS.DESCRIPTION && productId) {
          const productData = await productController.getProduct(productId, 'description');
          callSendAPI(sender_psid, (productData) ? `The product description: ${productData.description}` : `${PRODUCT_DATA_NOT_FOUND}: ${productId}`);
        }
        else if (command == COMMANDS.PRICE && productId) {
          const productData = await productController.getProduct(productId, 'price');
          callSendAPI(sender_psid, (productData) ? `The product price: $${productData.price}` : `${PRODUCT_DATA_NOT_FOUND}: ${productId}`);
        }
        else if (command == COMMANDS.SHIPPING && productId) {
          const productData = await productController.getProduct(productId, 'shipping');
          callSendAPI(sender_psid, (productData) ? `The product shipping price: $${productData.shipping}` : `${PRODUCT_DATA_NOT_FOUND}: ${productId}`);
        }
        else if (command == COMMANDS.BUY && productId) {
          const productData = await productController.getProduct(productId, 'sku name type price upc shipping description manufacturer model url image');
          callSendAPI(sender_psid, (productData) ? ORDER_MESSAGE : `${PRODUCT_DATA_NOT_FOUND}: ${productId}`);
          if(productData) sendOrderEmail(productData);
        }
        else {
          handleMessage(sender_psid, webhook_event.message);
        }
      } else {
        return;
      }
    });

    // Return a '200 OK' response to all events
    return res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    return res.sendStatus(404);
  }
};

// Sends response messages via the Send API
async function callSendAPI(sender_psid, response) {
  let request_body = {
    recipient: {
      id: sender_psid
    },
    message: { text: response }
  };

  try {
    // Send the HTTP request to the Messenger Platform
    await axios.post(
      `https://graph.facebook.com/v15.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      request_body
    )
  } catch (err) {
    console.log("err", err)
  }
}

function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

function handleMessage(sender_psid, message) {

  let entityChosen = "";
  Object.keys(NLP_ENTITIES).forEach((item) => {
    let entity = firstTrait(message.nlp, NLP_ENTITIES[item]);
    if (entity && entity.confidence > 0.8) {
      entityChosen = NLP_ENTITIES[item];
    }
  });

  if (entityChosen === "") {
    //default
    callSendAPI(sender_psid, `Sorry we cant understand what you are saying`);
  } else {
    if (entityChosen === NLP_ENTITIES.GREETINGS) {
      //send greetings message
      callSendAPI(sender_psid, getRandomMessage(NLP_ENTITIES.GREETINGS));
    }
    if (entityChosen === NLP_ENTITIES.THANKS) {
      //send thanks message
      callSendAPI(sender_psid, getRandomMessage(NLP_ENTITIES.THANKS));
    }
    if (entityChosen === NLP_ENTITIES.BYE) {
      //send bye message
      callSendAPI(sender_psid, getRandomMessage(NLP_ENTITIES.BYE));
    }
  }
}

function getRandomMessage(messageType) {
  const message = RANDOM_MESSAGES[messageType]
  const random = message.random()
  return random;
}

function sendOrderEmail(productData) {
  const requestData = {
    productSku: productData.sku,
    productUPC: productData.upc,
    productType: productData.type,
    productManufacturer: productData.manufacturer,
    productName: productData.name,
    productModel: productData.model,
    productDescription: productData.description,
    productImage: productData.image,
    productUrl: productData.url,
    productPrice: productData.price,
    productShipping: productData.shipping,
    orderTotal: productData.price + productData.shipping,
  }
  emailNotification.sendTemplate(process.env.ADMIN_EMAIL, process.env.SENDER_EMAIL, process.env.SENDGRID_DYNAMIC_TEMPLATE_ID, requestData);
}

module.exports = {
  getWebhook,
  postWebhook
};
