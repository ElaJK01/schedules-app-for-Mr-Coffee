CREATE DATABASE mr_c_auth_app;
CREATE user c_auth_user WITH ENCRYPTED PASSWORD 'coffee';
GRANT all privileges ON DATABASE mr_c_auth_app TO c_auth_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO c_auth_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO c_auth_user;

CREATE TABLE users (
    id serial PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL unique,
    pass VARCHAR(255) NOT NULL
);

CREATE TYPE week_day AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

CREATE TABLE schedules (
  id serial PRIMARY KEY,
  user_id INT NOT NULL,
  day week_day NOT NULL,
  start_at TIME NOT NULL,
  end_at TIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- create first users in database fr testing:
INSERT INTO users (firstname, lastname, email, pass) VALUES ('Kot', 'Wbutach', 'kot@gmail.com', 'b6a5ff9e10883d2329be9ef74cdf1d78ee546f719362fb4325040928a386a520');
-- pass: kot
INSERT INTO users (firstname, lastname, email, pass) VALUES ('dog', 'Dog', 'dog@gmail.com', 'cd6357efdd966de8c0cb2f876cc89ec74ce35f0968e11743987084bd42fb8944');
--pass:dog

INSERT INTO schedules (user_id, day, start_at, end_at)
VALUES (1, 'monday', '12:00', '14:30');
INSERT INTO schedules (user_id, day, start_at, end_at)
VALUES (1, 'tuesday', '11:00', '12:30');
INSERT INTO schedules (user_id, day, start_at, end_at)
VALUES (1, 'wednesday', '10:00', '13:30');
INSERT INTO schedules (user_id, day, start_at, end_at)
VALUES (1, 'thursday', '9:30', '11:30');

INSERT INTO schedules (user_id, day, start_at, end_at)
VALUES (2, 'monday', '16:00', '17:30');
INSERT INTO schedules (user_id, day, start_at, end_at)
VALUES (2, 'tuesday', '17:00', '19:00');
