create table user(
    user_id int primary key AUTO_INCREMENT,
    name varchar(250),
    username varchar(250),
    password varchar(250),
    role varchar(20),
    UNIQUE  (username)
);