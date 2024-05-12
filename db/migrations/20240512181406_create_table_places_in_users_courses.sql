-- migrate:up
CREATE TABLE places_in_user_courses(
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		user_courses_id INT NOT NULL,
		place_id INT NOT NULL,
		place_like INT DEFAULT 0,
		CONSTRAINT places_in_user_courses_user_courses_id_FK FOREIGN KEY (user_courses_id) REFERENCES user_courses (id),
		CONSTRAINT places_in_user_courses FOREIGN KEY (place_id) REFERENCES places (id)
);

-- migrate:down
DROP TABLE places_in_user_courses;
