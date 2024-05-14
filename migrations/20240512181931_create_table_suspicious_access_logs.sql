-- migrate:up
CREATE TABLE suspicious_access_logs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  access_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(39) NOT NULL,
  request_method VARCHAR(10),
  request_url VARCHAR(2048),
  user_agent VARCHAR(255),
  response_status INT,
  details TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE suspicious_access_logs;
