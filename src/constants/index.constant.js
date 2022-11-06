
const RANDOM_MESSAGES = {
    wit$greetings: [
        "How are you?",
        "I hope you're doing well.",
        "I hope you're having a great day."
    ],
    wit$thanks: [
        "You 're welcome!",
        "No worries",
        "My pleasure"
    ],
    wit$bye: [
        "Goodbye",
        "Have a nice day.",
        "bye-bye"
    ]
}

const NLP_ENTITIES = {
    GREETINGS: "wit$greetings", 
    THANKS: "wit$thanks", 
    BYE: "wit$bye" 
}

const COMMANDS = {
    DESCRIPTION: "/desc",
    PRICE: "/price",
    SHIPPING: "/shipping",
    BUY: "/buy"
}

const COMMANDS_LIST = [
    COMMANDS.DESCRIPTION,
    COMMANDS.PRICE,
    COMMANDS.SHIPPING,
    COMMANDS.BUY
]

const PRODUCT_DATA_NOT_FOUND = 'Appologies, Kindly try again. No product found with this productId'

const ORDER_MESSAGE = 'Thank you! for placing an order, our customer support representative will get in touch with you for more details.'


module.exports = {
    RANDOM_MESSAGES,
    NLP_ENTITIES,
    COMMANDS,
    COMMANDS_LIST,
    PRODUCT_DATA_NOT_FOUND,
    ORDER_MESSAGE
}