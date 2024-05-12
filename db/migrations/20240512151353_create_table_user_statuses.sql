-- migrate:up
CREATE TABLE user_statuses(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	type_name CHAR(30) NOT NULL
);

-- migrate:down
DROP TABLE user_statuses;
