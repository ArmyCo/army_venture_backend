-- migrate:up
CREATE TABLE user_courses(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	  likes INT DEFAULT 0,
    course_title VARCHAR(255),
    with_who_id INT NOT NULL,
    description VARCHAR(4500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
		CONSTRAINT user_courses_user_id_FK FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT user_courses_with_who_id_FK FOREIGN KEY (with_who_id) REFERENCES with_who (id)
);

-- migrate:down
DROP TABLE user_courses;
