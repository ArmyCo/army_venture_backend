-- migrate:up
CREATE TABLE events_and_promotions(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    place_id INT,
    title VARCHAR(1500) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT events_and_promotions_place_id_FK FOREIGN KEY (place_id) REFERENCES places (id)
);

-- migrate:down
DROP TABLE events_and_promotions;
