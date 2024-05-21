-- migrate:up
CREATE TABLE withdraw_reasons(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	count INT DEFAULT 0
);

-- migrate:down
DROP TABLE withdraw_reasons;
