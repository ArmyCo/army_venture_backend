-- migrate:up
CREATE TABLE other_withdraw_reasons(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(100) NOT NULL
);

-- migrate:down
DROP TABLE other_withdraw_reasons;
