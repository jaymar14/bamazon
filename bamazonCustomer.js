var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host:"localhost",
	port:3306,
	user:"root",
	password:"",
	database:"bamazon"
});

function promptUserPurchase(){
	inquirer.prompt([
	{
		type: "input",
		name: "item_id",
		message:"Please enter Item ID you like to purhcase.",
		filter:Number
	},
	{
		type:"input",
		name:"stock_quantity",
		message:"How many items do you wish to purchase?",
		filter:Number
	}
 ]).then(function(input){
 	var item = input.item_id;
 	var quantity = input.stock_quantity;
 	var queryStr = "SELECT * FROM products where ?";
 	connection.query(queryStr,{item_id:item}, function(err,data){
 		if(err) throw err;
 		if(data.length === 0){
 			console.log("ERROR: Invalid Item ID. Please select valid Item ID!");
 			displayInventory();
 		} else {
 			var productData = data[0];
 			if(quantity <= productData.stock_quantity){
 				console.log("Product is in stock!");
 				var updateQueryStr = "UPDATE products SET stock_quantity = " + (productData.stock_quantity-quantity) + "WHERE item_id = " + item_id;
 				connection.query(updateQueryStr, function(err,data){
 					if(err) throw err,
 						console.log("Your order has been placed! Total price is $" + productData.price * quantity);
 						console.log("Thank you for shopping with us!");
 						console.log("\n------------------------------------------------------------------------------------------------------------\n");

 						conn.end();
 				})
 			} else{
 				console.log("Sorry, product out of stock (Insufficient quantity)!");
 				console.log("please modify order.");
 				console.log("\n---------------------------------------------------\n");

 				displayInventory();
 			}
 		}
 	})
 })
}
function displayInventory(){
	queryStr = "SELECT * FROM products";
	connection.query(queryStr,function(err,data){
		if(err) throw err;
		console.log("Existing Inventory: ");
		console.log("--------------------\n");

		var strOut = '';
		for(var i = 0; i < data.length; i++){
			strOut = '';
			strOut += "item id: " + data[i].item_id + " // ";
			strOut += "product name: " + data[i].product_name + " // ";
			strOut += "Department: " + data[i].department_name + " // ";
			strOut += "Price: $ " + data[i].price + "\n";
			console.log(strOut);
		}
		console.log("----------------------------------------------------\n");
		promptUserPurchase();
	}) 
}

function runBamazon(){
	displayInventory();
}
runBamazon();
