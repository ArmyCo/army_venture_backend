-- migrate:up
CREATE TABLE units(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	unit_name VARCHAR(50) NOT NULL
);

-- migrate:down
DROP TABLE units;