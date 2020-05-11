//npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

//syncing with mysql database
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "rootroot",
    database: "bamazon_db"
});

//connection made with mysql server and loads stock 
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    displayStock();
});

//basically makes sure the user input is a number
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return "Enter a whole number that isn't zero.";
	}
}

//displays stock items from database
//calls for the prompting customer event
function displayStock() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        promptForUser(res);
    });
}

//inquirer prompt to prompt user for what item they want to purchase 
//validates for a number 
//turns choice into a string and 
function promptForUser(inventory) {
    inquirer
        .prompt([{
            type: "input",
            name: "choice",
            message: "What is it you would like to purchase? (ID # Please)",
            validate: validateInput
        }])
        .then(function (val) {
            var choiceID = parseInt(val.choice);
            var product = checkStock(choiceID, inventory);
            if (product) {
                quantityPrompt(product);
            } else {
                console.log("That item is not in the inventory.");
                loadProducts();
            }
        });
}

//simple for loop finding the stock item, comparing if it's there and returning the index of inventory
//which is the customers item
//otherwise we return null for missing inventory
function checkStock(choiceID, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceID) {
            return inventory[i];
        }
    }
    return null;
}

//prompt for how many
//input quantity and coverts to a string
//if that string is more than what we have in stock we send a message
//otherwise we go to buy the product at the quantity the customer wants
function quantityPrompt(product) {
    inquirer.prompt([{
            type: "input",
            name: "quantity",
            message: "How many would you like to buy?",
            validate: validateInput
        }])
        .then(function (val) {
            var quantity = parseInt(val.quantity);
            if (quantity > product.stock_quantity) {
                console.log("Don't have enough! Sorry!");
                displayStock();
            } else {
                buy(product, quantity);
            }
        });
}

//connects to database, updates database with item purchased and how much
// sends message based on quantity and name
// attempt at replaying the whole thing
function buy(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, product.item_id],
        function (err, res) {
            console.log("You have just purchased " + quantity + " " + product.product_name);
            console.log("Your total is: " + product.price * quantity);
            // this does not work correctly ---------
            inquirer.prompt([{
                type: "confirm",
                name: "replay",
                message: "Would you like to purchase more?",
                default: false,
            }]).then(function (replay) {
                // console.log(replay)
                if (replay === true) {
                    displayStock();
                }else {
                    console.log("See ya next time!");
                }
            });
            //----------- it's supposed to return the customer to the main menu (displayStock)
        });
}
