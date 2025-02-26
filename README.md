# E-Commerce Frontend Application
This repository contains the frontend implementation for an e-commerce platform. The application is built according to the requirements given in the AJI subject course delivered at TUL. Among the technologies used are **React** as the frontend framework and **Bootstrap** for responsive styling. It interacts with the backend API created in the previous task to enable users to browse products, place orders, and leave reviews. The application also includes additional features such as SEO-optimized product descriptions, user registration and login, and order reviews.

## Features
### Core Features
1. **Product Browsing:** User can display products (a table with columns: name, description, price, weight, category and action), filter products by name and category, add products to the cart using a "Buy" button in the action column.
2. **Shopping Cart:** User can view and manage items in the cart, adjust the quantity of items (using + and - buttons), remove items from the cart.
3. **Order Placement:** User can place the order from the shopping cart by clicking "Make order" button and confirming the action. The cart cannot be empty. Before confirming the order user can see a table of ordered items (name, quantity, total price). To complete the order user needs to enter contact details (username, email, phone).
4. **Order Management:** User can view a list of fulfilled orders (date, total value, list of items), the administrator can change the order status and filter orders by status.
5. **Product Management:** User (adminitrator) can edit product properties (category, price, weight).

### Additional Features
1. **SEO-Optimized Product Descriptions:** The administrator can optimize the product description by clicking the magic wand icon in the edit product modal.
2. **User Registration and Login:** Allow users to register with a username, password, email and phone number. Provide a login form for registered users.
3. **Order Reviews:** Customers can add reviews for completed or canceled orders. Review form includes a rating (1-5), comment, and date. When review is added the client can see it in the order table and the administrator can also see it in the order table.

## Setup Instructions
### Prerequisites
1. Install **Node.js** and **npm**.
2. Install **PostgreSQL** and create a database for the application.
3. Clone this repository.

### Installation backend directory
1. Install dependencies: ***npm install --legacy-peer-deps*** (WARNING: if there any errors caused by packages inconsistency run ***yarn install*** instead)
2. Run database migrations: ***npx knex migrate:latest***
3. Start the server: ***npm run server***

### Installation frontend directory
1. Install dependencies: ***npm install***
2. Start the server: ***npm run dev***
3. Open the application in your browser: ***http://localhost:5173***

## Example Workflow
To **log in as a client** please use the example account or create a new account by registration:
```
"username": "client"
"password": "P@ssw0rd!"
```
To **log in as an administrator** please use the following credencials:
```
"username": "bfox"
"password": "P@ssw0rd!"
```
To **browse products and add to cart** (requires client role):
- Visit the Products page.
- Use filters to find specific products (optional).
- Add products to the cart by clicking "Buy" button.

To **browse products and edit products** (requires worker role):
- Visit the Products page.
- Use filters to find specific products (optional).
- Edit products by clicking "Edit" button and changing values in the Edit product modal.

To **place an order** (requires client role):
- Go to the shopping cart.
- Adjust quantities or remove items.
- Proceed to the order confirmation page.
- Enter contact details and submit the order.

To **manage orders as a worker:**
- Visit Orders page.
- Change the status of the chosen order.

To **manage orders as a client:**
- Visit Orders page.
- Add a review to the order if possible (order must be completed or cancelled).

## Authors

### Wiktoria Bilecka
### Grzegorz Janasek
