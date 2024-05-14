-- migrate:up
CREATE TABLE place_types(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	type_name VARCHAR(1350) NOT NULL
);

-- migrate:down
DROP TABLE place_types;