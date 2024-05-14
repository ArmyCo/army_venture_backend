-- migrate:up
CREATE TABLE places(
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  TEL varchar(30),
  detail VARCHAR(1000),
  address VARCHAR(3000) NOT NULL,
  place_type_id INT NOT NULL,
  open_day CHAR(30) NOT NULL,
  close_day TEXT,
  open_time CHAR(10) NOT NULL,
  close_time CHAR(10) NOT NULL,
	close_at_holidays BOOLEAN DEFAULT 0,
  break_time_during VARCHAR(24),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT places_place_type_id_FK FOREIGN KEY (place_type_id) REFERENCES place_types (id)
);

-- migrate:down
DROP TABLE places;
