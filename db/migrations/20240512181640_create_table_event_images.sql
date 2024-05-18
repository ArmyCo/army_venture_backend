-- migrate:up
CREATE TABLE event_images(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  image_url VARCHAR(2083),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT event_images_event_id_FK FOREIGN KEY (event_id) REFERENCES events_and_promotions (id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE event_images;
