create table user(
    user_id int primary key AUTO_INCREMENT,
    name varchar(250),
    username varchar(250),
    password varchar(250),
    role varchar(20),
    UNIQUE  (username)
);

insert into user(name, username, password, role) values('user1','user1','$2b$10$AQUruTP886EREmPU8AdX3udPQffi8EO0pJNvjBrhdALo9Bp80ubwG', 'USER'),
('admin1','admin1','$2b$10$AQUruTP886EREmPU8AdX3udPQffi8EO0pJNvjBrhdALo9Bp80ubwG', 'ADMIN');

create table movie(
    movie_id int primary key AUTO_INCREMENT,
    name varchar(250),
    release_date date,
    genre varchar(50),
    image_url varchar(500),
    trailer_url varchar(500),
    is_available boolean,
    description varchar(500),
    user_id int not null,
    foreign key (user_id) references user(user_id)
);

insert into movie(name, release_date, genre, image_url, trailer_url, is_available, description, user_id) values
('The Nun', '2018-09-07', 'Horror', 'https://i.ibb.co/tpRrdz6/the-nun.jpg', 'https://youtu.be/pzD9zGcUNrw?si=nBMyl0K3lVkDDofr', 1, 'A priest and a novice arrive in Romania to investigate the death of a young nun. However, things take an ugly turn after they encounter a supernatural force.', 2),
('Avengers: Endgame', '2019-04-26', 'Action', 'https://i.ibb.co/YRFLXFT/endgame.jpg', 'https://youtu.be/TcMBFSGVi1c?si=4ECBT5bKlsx67WVM', 1, 'After Thanos, an intergalactic warlord, disintegrates half of the universe, the Avengers must reunite and assemble again to reinvigorate their trounced allies and restore balance.', 2),
('Jurassic World', '2015-06-12','Action','https://i.ibb.co/mhr4DZS/jurassic-world.jpg','https://youtu.be/RFinNxS5KN4?si=eWcpoQwCRJeUDXsS',1,'A theme park showcasing genetically-engineered dinosaurs turns into a nightmare for its tourists when one of the dinosaurs escapes its enclosure. An ex-military animal expert steps up to save the day.',2),
('The Platform','2019-11-08','Sci-fi','https://i.ibb.co/kKrWcpG/the-platform.jpg','https://youtu.be/RlfooqeZcdY?si=udOmKd5zChvin3v2',1,'In a prison where inmates are fed on a descending platform, those on the upper levels take more than their fair share while those below are left to starve on scraps, and one man decides to change the system.',2),
('Seven','1995-09-22','Crime','https://i.ibb.co/tsbXpX8/seven.jpg','https://youtu.be/znmZoVkCjpI?si=qgsE6LnKply1YVcG',1,'Detectives Somerset and Mills, one a seasoned cop, the other a relatively new one, are paired up to solve murders. Together they attempt to find a killer who is inspired by the seven deadly sins.',2),
('The Game','1997-09-12','Mystery','https://i.ibb.co/PYkLTK8/the-game.jpg','https://youtu.be/nsKdR05ZsGE?si=YCSKKMlIFF6c2xIW',1,'Nicholas Van Orton, a merchant banker, receives a strange birthday gift, a voucher for a game, from his brother Conrad. When he actually makes use of the present, he finds himself in trouble.',2);