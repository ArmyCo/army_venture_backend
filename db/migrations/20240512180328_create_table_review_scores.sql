-- migrate:up
CREATE TABLE review_scores (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  review_id INT NOT NULL,
  place_rating_criteria_id INT NOT NULL,
  score DECIMAL(3,2) NOT NULL,
  CONSTRAINT review_scores_review_id_FK FOREIGN KEY (review_id) REFERENCES place_reviews (id),
  CONSTRAINT review_scores_place_rating_criteria_id_FK FOREIGN KEY (place_rating_criteria_id) REFERENCES rating_criterias (id)
);

-- migrate:down
DROP TABLE review_scores;
