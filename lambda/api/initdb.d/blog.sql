use blog_dev;

drop table if exists blogs;
create table blogs(s3_dir varchar(255) not null primary key,title varchar(255) not null, categories text not null,keywords text,create_at datetime not null,update_at datetime,viewer int default 0 not null);

insert into blogs (s3_dir,title,categories,keywords,create_at,update_at) values ("How-to-test-golang","How to test golang?","golang,test","aws,lambda,test","2022-12-31T00:00:00Z09:00","2023-06-20T10:00:00Z09:00");
insert into blogs (s3_dir,title,categories,keywords,create_at) values ("Android-Clean-Architecture","Android Clean Artitecture","android,clean architecture","clean architecture","2023-05-11T21:00:00Z09:00");