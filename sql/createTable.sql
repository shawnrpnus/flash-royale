CREATE TABLE store (
name VARCHAR(128) PRIMARY KEY,
location VARCHAR(256) NOT NULL
);

CREATE TABLE apparel (
id SERIAL PRIMARY KEY,
name VARCHAR(128) NOT NULL,
brand VARCHAR(128) NOT NULL,
manufacturer VARCHAR(128) NOT NULL,
style VARCHAR(64) NOT NULL,
color VARCHAR(64) NOT NULL,
size VARCHAR(8) NOT NULL CHECK (size IN ('3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL')),
price NUMERIC NOT NULL,
image VARCHAR(16) UNIQUE
);

CREATE TABLE stock (
quantity NUMERIC NOT NULL,
location_in_store VARCHAR(128) NOT NULL,
store_name VARCHAR(128) NOT NULL,
apparel_id INTEGER NOT NULL,
PRIMARY KEY (store_name, apparel_id),
FOREIGN KEY (store_name) references store(name),
FOREIGN KEY (apparel_id) references apparel(id)
);