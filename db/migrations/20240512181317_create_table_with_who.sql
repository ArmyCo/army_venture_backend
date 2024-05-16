-- migrate:up
CREATE TABLE with_who(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title CHAR(50) NOT NULL
);

-- migrate:down
DROP TABLE with_who;