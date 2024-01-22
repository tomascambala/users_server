create user postgress with password 'postgress';
alter role postgress superuser createrole createdb replication;
create database users;
create database users_test;
alter database users owner to postgress;
alter database users_test owner to postgress;