# 4A00EZ62 Backend-kehitys

## Backend Development - Final Project

### General Project

Most of us want to know where our money goes. Here is a tool to keep track of all the expenses.  
The project focused on backend, but frontend was done as bonus.
You can find the frontend test version online at www.matiaskarmanto.com, which impliments some, but not all the features of the API.  
The server is up at Render.com, so might take a while to start it. Be patient :)  
   
   

## Project requirements

Prior to starting the app you need to
1) Install Node.js (https://nodejs.org/en/)
2) Create a database and preferably add some data into it.
3) Create .env-file to manage the database connection.

At the bottom of the file you can find the SQL-statements to create database and to add some data into it.  
The .env needs to created in project's root-folder (Where you can find app.js for example).  
This file needs to include

HOST=""  
DBUSERNAME=""  
PASSWORD=''  
DATABASE=""  
PORT=5000  
   
   
### Node instructions

"npm install" to install dependencies.   
"npm run start" to start the backend at port defined in .env. Default: http://localhost:5000/  
"cd frontend" to enter the frontend-folder.  
"npm start" in the frontend folder to start React-frontend at http://localhost:3000/, to change the port create .env in frontend folder with PORT=

Also you can  
"npm run test" in root folder to run all 21 tests done for the project with jest & supertest.  
   

## API use  

The calls to the API are on default are made at https://localhost:5000/api/expenses or https://expenses-app-api.onrender.com/api/expenses.  
You can find localhost.REST & server.REST files in the root folder to test out all the endpoints of the API.
  
  
GET               /api/expenses                                                             get ALL the expenses   
GET               /api/expenses/1                                                          get expense by id  
GET               /api/expenses/month/02                                            get expense by month  
GET               /api/expense/expense/search?amount=200              get expenses by search (See localhost.REST for more info) 

DELETE         /api/expenses/1                                                          delete expense by id (remove one item from the list)

POST            /api/expenses/                                                            add new expense

PUT                  /api/expenses/                                                             update certain expense using id in the body to find it  
   
   
   
## SQL Statements to create database  

CREATE TABLE IF NOT EXISTS `expenses` (  
`id` int(11) NOT NULL AUTO_INCREMENT,  
`date` DATE NOT NULL,  
`amount` DECIMAL(6,2) NOT NULL,  
`shop` VARCHAR(60) NOT NULL,  
`category` VARCHAR(60) NOT NULL,  
`description` VARCHAR(60) NOT NULL,  
PRIMARY KEY (`id`));

INSERT INTO expenses (date, amount, shop, category, description) VALUES 

('2022-1-10', 99.00, 'Dressmann', 'Clothing', 'Jeans'),  
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

