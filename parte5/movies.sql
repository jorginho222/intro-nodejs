DROP DATABASE IF EXISTS cinema;
CREATE DATABASE cinema;

USE cinema;

CREATE TABLE movies (
                        id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                        title VARCHAR(255) NOT NULL,
                        year INT NOT NULL,
                        directorId BINARY(16) NOT NULL REFERENCES directors(id),
                        duration INT NOT NULL,
                        poster TEXT NOT NULL,
                        rate DECIMAL(3, 1) UNSIGNED DEFAULT 0
);

CREATE TABLE genres (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE directors (
                           id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
                           name VARCHAR(255) NOT NULL
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

INSERT INTO directors (id, name) VALUES
     (UUID_TO_BIN(UUID()), 'Pimpinella'),
     (UUID_TO_BIN(UUID()), 'Fantino'),
     (UUID_TO_BIN(UUID()), 'Shakespeare');

INSERT INTO movies (id, title, year, directorId, duration, poster, rate) VALUES
     (
         UUID_TO_BIN(UUID()),
         'Interestellar',
         1994,
         (SELECT id FROM directors WHERE name = 'Pimpinella'),
         180,
         'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg',
         8.8
     ),
     (
         UUID_TO_BIN(UUID()),
         'Rodizio',
         1888,
         (SELECT id FROM directors WHERE name = 'Fantino'),
         222,
         'https://www.themoviedb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg',
         3.6
     ),
     (
         UUID_TO_BIN(UUID()),
         'Marimar',
         2010,
         (SELECT id FROM directors WHERE name = 'Shakespeare'),
         2,
         'https://i.ebayimg.com/images/g/qR8AAOSwkvRZzuMD/s-l1600.jpg',
         10
     );

INSERT INTO movies_genres (movie_id, genre_id) VALUES
    ((SELECT id FROM movies WHERE title = 'Interestellar'), (SELECT id FROM genres WHERE name = 'Drama')),
    ((SELECT id FROM movies WHERE title = 'Rodizio'), (SELECT id FROM genres WHERE name = 'Action')),
    ((SELECT id FROM movies WHERE title = 'Marimar'), (SELECT id FROM genres WHERE name = 'Crime'));

SELECT * FROM movies;
SELECT * FROM genres;
SELECT * FROM directors;