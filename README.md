# 4A00EZ62 Backend-kehitys

## Backend Development - Final Project

## Topic

### General Project

Most of us want to know where our money goes. You now have the chance to create a solution to that question. Create an application for tracking your personal expenses.

### Node instructions

"npm run build" to start the app.
"npm run test" to run all 21 tests.

### Project requirements

Database
.env file

### SQL Statements to create database

CREATE TABLE IF NOT EXISTS `expenses` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`date` DATE NOT NULL,
`amount` DECIMAL(6,2) NOT NULL,
`shop` VARCHAR(60) NOT NULL,
`category` VARCHAR(60) NOT NULL,
`description` VARCHAR(60) NOT NULL,
PRIMARY KEY (`id`));

INSERT INTO expenses (date, amount, shop, category, description) VALUES ('2022-1-10', 99.00, 'Dressmann', 'Clothing', 'Jeans'),
('2022-2-12', 122.52, 'Lidl', 'Groceries', 'Bi-weekly groceries'),
('2022-3-18', 242.00, 'CityMarket', 'Groceries', 'Ham & Cheese'),
('2022-4-1', 9.80, 'Prisma', 'Groceries', 'Candy'),
('2022-5-22', 49.99, 'Dressmann', 'Clothing', 'Shirt and hat'),
('2022-6-30', 155.00, 'Lidl', 'Groceries', 'Bi-weekly groceries'),
('2022-7-4', 38.99, 'CityMarket', 'Groceries', 'Sushi'),
('2022-8-28', 140.00, 'Prisma', 'Groceries', 'Bi-weekly groceries'),
('2022-9-15', 432.00, 'Biker Shop', 'Clothing', 'Leather jacket and boots'),
('2022-10-8', 152.65, 'Lidl', 'Groceries', 'Bi-weekly groceries'),
('2022-11-1', 405.55, 'CityMarket', 'Groceries', 'Christmas'),
('2022-12-15', 9999.00, 'Prisma', 'Extra', 'Bicycle for nephew')

### Project self evaluation

Solution design: The project was build around MVC pattern and therefore I believe the design of the API is appropriate to the teachings of the course.

Execution:
Requirements satisfaction: All requirements were met, besides the front-end part.

Coding Style: I used Prettier to enforce coding style and ESLint to enforce code quality.

Documentation: The project is documented with README.md and JSDoc.
