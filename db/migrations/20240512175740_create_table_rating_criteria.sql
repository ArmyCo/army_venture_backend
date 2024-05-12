-- migrate:up
CREATE TABLE rating_criteria(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	rating_title VARCHAR(300) NOT NULL
);

-- migrate:down
DROP TABLE rating_criteria;
