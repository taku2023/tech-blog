use blog_dev;

drop table if exists blogs;
create table blogs(object_key varchar(255) not null primary key,title varchar(255) not null, categories text not null,keywords text,create_at datetime not null,update_at datetime,viewer int default 0 not null);

insert into blogs (title,object_key,categories,keywords,create_at,update_at) values ("How to test golang?","How-to-test-golang.md","golang,test","aws,lambda,test","2022-12-31 00:00:00","2023-06-20 10:00:00");
insert into blogs (title,object_key,categories,keywords,create_at) values ("Android Clean Artitecture","Android-Clean-Architecture.md","android,clean architecture","clean architecture","2023-05-11 21:00:00");