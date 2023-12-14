DROP DATABASE IF EXISTS cinema;
CREATE DATABASE cinema;

USE cinema;

CREATE TABLE movies (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    director VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    poster TEXT NOT NULL,
    rate DECIMAL(3, 1) UNSIGNED NOT NULL
);

CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE movies_genres (
   movie_id BINARY(16) REFERENCES movies(id),
   genre_id INT REFERENCES genres(id),
   PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO genres (name) VALUES
  ('Drama'),
  ('Action'),
  ('Crime'),
  ('Adventure'),
  ('Sci-Fi'),
  ('Romance');

INSERT INTO movies (id, title, year, director, duration, poster, rate) VALUES
   (UUID_TO_BIN(UUID()), 'Interestellar', 1994, 'Pimpinella', 180, 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8),
   (UUID_TO_BIN(UUID()), 'Rodizio', 1888, 'Fantino', 222, 'https://www.themoviedb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', 3.6),
   (UUID_TO_BIN(UUID()), 'Marimar', 2010, 'Shakespeare', 2, 'https://i.ebayimg.com/images/g/qR8AAOSwkvRZzuMD/s-l1600.jpg', 10);

INSERT INTO movies_genres (movie_id, genre_id) VALUES
   ((SELECT id FROM movies WHERE title = 'Interestellar'), (SELECT id FROM genres WHERE name = 'Drama')),
   ((SELECT id FROM movies WHERE title = 'Interestellar'), (SELECT id FROM genres WHERE name = 'Action')),
   ((SELECT id FROM movies WHERE title = 'Rodizio'), (SELECT id FROM genres WHERE name = 'Action')),
   ((SELECT id FROM movies WHERE title = 'Rodizio'), (SELECT id FROM genres WHERE name = 'Crime')),
   ((SELECT id FROM movies WHERE title = 'Rodizio'), (SELECT id FROM genres WHERE name = 'Romance')),
   ((SELECT id FROM movies WHERE title = 'Marimar'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
   ((SELECT id FROM movies WHERE title = 'Marimar'), (SELECT id FROM genres WHERE name = 'Adventure')),
   ((SELECT id FROM movies WHERE title = 'Marimar'), (SELECT id FROM genres WHERE name = 'Drama'));

SELECT * FROM movies