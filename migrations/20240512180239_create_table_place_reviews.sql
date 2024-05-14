-- migrate:up
CREATE TABLE place_reviews(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	place_id INT NOT NULL,
	title VARCHAR(300) NOT NULL,
	content VARCHAR(3000),
	visited_date DATETIME NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT place_reviews_user_id_FK FOREIGN KEY (user_id) REFERENCES users (id),
	CONSTRAINT place_reviews_place_id_FK FOREIGN KEY (place_id) REFERENCES places (id)
);

-- migrate:down
DROP TABLE place_reviews;
