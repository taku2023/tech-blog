USE blog_dev;

DROP TABLE IF EXISTS blogs;
CREATE TABLE blogs (
	id VARCHAR(32) NOT NULL, title VARCHAR(64) NOT NULL,categories TEXT NOT NULL, keywords TEXT, PRIMARY KEY (id)
);

INSERT INTO blogs (id,title,categories,keywords) values ("1","How to test golang?","golang,test","aws,lambda,test");
