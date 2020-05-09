DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (

  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  primary key(item_id)

);

SELECT * FROM products;
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Watermelon Gum", "Candy", 2.99, 200),
("Fallout 4", "Electronics", 44.99, 50),
("Skyrim SE", "Electronics", 49.99, 20),
("Hot Cheetos: Extra Hot", "Salty Snacks", 4.99, 500),
("Package of Milky Ways", "Candy", 14.99, 400),
("Coffee Maker", "Appliances", 20.55, 250),
("Stardew Valley", "Electronics", 39.99, 40),
("Animal Crossing", "Electronics", 60.00, 60),
("Webcam", "Electronics", 30.00, 3);