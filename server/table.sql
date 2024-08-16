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
    admin_user_id int not null,
    foreign key (admin_user_id) references user(user_id)
);

insert into movie(name, release_date, genre, image_url, trailer_url, is_available, description, admin_user_id) values
('The Nun', '2018-09-07', 'Horror', 'https://i.ibb.co/tpRrdz6/the-nun.jpg', 'https://youtu.be/pzD9zGcUNrw?si=nBMyl0K3lVkDDofr', 1, 'A priest and a novice arrive in Romania to investigate the death of a young nun. However, things take an ugly turn after they encounter a supernatural force.', 2),
('Avengers: Endgame', '2019-04-26', 'Action', 'https://i.ibb.co/YRFLXFT/endgame.jpg', 'https://youtu.be/TcMBFSGVi1c?si=4ECBT5bKlsx67WVM', 1, 'After Thanos, an intergalactic warlord, disintegrates half of the universe, the Avengers must reunite and assemble again to reinvigorate their trounced allies and restore balance.', 2),
('Jurassic World', '2015-06-12','Action','https://i.ibb.co/mhr4DZS/jurassic-world.jpg','https://youtu.be/RFinNxS5KN4?si=eWcpoQwCRJeUDXsS',1,'A theme park showcasing genetically-engineered dinosaurs turns into a nightmare for its tourists when one of the dinosaurs escapes its enclosure. An ex-military animal expert steps up to save the day.',2),
('Hawa','2022-07-29','Drama','https://i.ibb.co/vkkbKNF/hawa.jpg','https://youtu.be/K9W52rpdlLQ?si=93ULhCdznXV2sjqU',1,'Hawa is a 2022 Bangladeshi mystery-drama film written and directed by Mejbaur Rahman Sumon. The film was produced by Sun Music and Motion Pictures Limited. The film stars Chanchal Chowdhury, Nazifa Tushi, Sariful Razz, Sumon Anowar, Shohel Mondol, Nasir Uddin Khan and Rizvi Rizu among others.',2),
('Pathaan', '2023-01-25', 'Action', 'https://i.ibb.co/tCWCjV7/pathaan.jpg', 'https://youtu.be/vqu4z34wENw?si=kZ5AQt37lz0D6Wik', 1, 'A Pakistani general hires a private terror outfit to conduct attacks in India while Pathaan, an Indian secret agent, is on a mission to form a special unit.', 2),
('Jawan','2023-09-07','Action','https://i.ibb.co/zV0ZB8w/Jawaan.jpg','https://youtu.be/MWOlnZSnXJo?si=y17cSRzGX_e_lK_w',1,'A man is driven by a personal vendetta to rectify the wrongs in society, while keeping a promise made years ago. He comes up against a monstrous outlaw with no fear, who has caused extreme suffering to many.',2),
('Dunki','2023-12-21','Comedy','https://i.ibb.co/VgnqyVP/dunki.jpg','https://youtu.be/Zd69FfhBmSc?si=ZwXzdkmRNbGBn0qt',1,'A group of friends set out on a perilous journey to emigrate to the United Kingdom via a clandestine route called donkey flight, risking their lives in the process.',2);

create table wishlist(
    user_id int not null,
    movie_id int not null,
    foreign key (user_id) references user(user_id),
    foreign key (movie_id) references movie(movie_id)

);

create table review(
    review_id int primary key AUTO_INCREMENT,
    report varchar(500),
    rate int not null,
    user_id int not null,
    movie_id int not null,
    foreign key (user_id) references user(user_id),
    foreign key (movie_id) references movie(movie_id)

);

create table notification(
    notification_id int primary key AUTO_INCREMENT,
    report varchar(500),
    date date not null,
    user_id int not null,
    foreign key (user_id) references user(user_id)
);