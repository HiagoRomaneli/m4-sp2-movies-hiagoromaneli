create table if not exists movies (
	id BIGSERIAL primary key,
	name VARCHAR(50) unique not null,
	description text,
	duration INTEGER not null,
	price INTEGER not null
	
);

insert into movies (name, description, duration, price)
values ('Piratas do Caribe: O bau da morte', 'Açao, Aventura, Fantasia', 138, 70);