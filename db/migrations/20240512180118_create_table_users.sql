-- migrate:up
CREATE TABLE users(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name CHAR(50) NOT NULL,
	gender CHAR(8) NOT NULL,
	birth DATETIME NOT NULL,
	user_army_number CHAR(20) NOT NULL,
	user_status_id INT NOT NULL,
	phone_number VARCHAR(50) NOT NULL,
	belonged_unit_id INT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT users_users_status_id_FK FOREIGN KEY (user_status_id) REFERENCES user_statuses (id),
	CONSTRAINT users_belonged_unit_id_FK FOREIGN KEY (belonged_unit_id) REFERENCES units (id)
);

-- migrate:down
DROP TABLE users;
