CREATE DATABASE yar
  WITH OWNER "postgres"
  ENCODING 'UTF8'
  LC_COLLATE = 'ru_RU.utf-8'
  LC_CTYPE = 'ru_RU.utf-8'
  TEMPLATE = template0;

create TABLE wods(
    id SERIAL PRIMARY KEY,
    src varchar(255),
    dst varchar(255),
    dst_extended varchar(511),
    date varchar(10)

);
