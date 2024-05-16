-- migrate:up
CREATE TABLE course_likes(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	course_id INT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT course_likes_user_id_FK FOREIGN KEY(user_id) REFERENCES users(id),
	CONSTRAINT course_likes_course_id_FK FOREIGN KEY(course_id) REFERENCES user_courses(id)
);

-- migrate:down
DROP TABLE course_likes;
