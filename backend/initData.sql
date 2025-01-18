ALTER TABLE orders ALTER COLUMN approval_date TYPE DATE;
INSERT INTO products (name, description, price, weight, category_id) VALUES
('Laptop', 'High-end gaming laptop', 1500.99, 2.5, 1),
('Book', 'Fiction novel', 19.99, 0.8, 2),
('Ring', 'Rose gold ring with amethyst', 1390.00, 0.4, 4),
('T-Shirt', 'Cotton t-shirt', 9.99, 0.3, 3),
('Pillow', 'Decorative synthetic pillow', 59.99, 1.5, 5);

INSERT INTO orders (approval_date, status_id, username, email, phone) VALUES
('2024-12-12', 4, 'client', 'client@gmail.com', '+48569900389'),
('2025-01-09', 2, 'client', 'client@gmail.com', '+48569900389'),
('2025-01-15', 2, 'client', 'client@gmail.com', '+48569900389');

INSERT INTO order_items (order_id, product_id, quantity) VALUES
(1, 1, 2),
(2, 3, 1),
(2, 5, 2),
(3, 2, 5);
