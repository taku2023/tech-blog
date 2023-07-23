---
title: Mistakes you make when start learning Domain Driven Design.
description: How and when to use DDD or not.
date: 2023-07-23T14:00:00+09:00
categories: [architecture]
keywords: [architecture,DDD]
---
## Why you should read this
Domain Driven Design was proposed by Eric Evans in 2003, and within 20 years DDD has been known among developers.
If you google "DDD", you will see many blogs and articles about what DDD is, and how to implement it. But this blog is different in that it doesn't give you know-how, it gives you what isn't DDD and not for.


## Why I write this
My country in Japan, DDD became famous among developers. Although it's hard to understand and certainly few people read Evans' book, some people think of it as a silver bullet. But you know, there's no silver bullet!
I have been seeing them apply DDD to projects and failed, so I thought I should write and share my ideas.


## DDD is not ..
I read Evans' book and realized that this is not only a pattern. Many books and blogs reference it as an architectural pattern, but DDD is not a __pattern__. The main context of DDD is how to model the real world and express it by code. It's about how to discuss business with customers,  define the business domain, and put it into code. Technical words like repository, domain event, and famous hexagonal architecture are not important, but ubiquitous language, boundary contexts are important words.


DDD was born from practice. The goal of DDD is not to make clean and elegant code. It's goal is building a software that reflect real business, robust to be changed or scaled, self documented. You knew the real world is so complex that only transcribe it to code can breaks easily. That why DDD is waited for, and it is good for building robust model. It requires lots of skills and efforts that most engineers don't actually want to. You need to talk to customer while drawing a picture, and getting a whole knowledge of customer's businesses.


Is it like a consultant, not an engineer? Well, You need to play both roles. Is it fun? If Yes, DDD is for you.


## DDD is not for...
You may now understand what DDD is not, it's time to know what it is not for, and when you don't need to use it.


- #### DDD is not for simple applications
DDD is not for simple applications. As I already mentioned, it is a methodology to model complex business rules. Applying it to simple applications is exaggerated, only cost for learning. If you want to learn technique of DDD (so called lightweight DDD) go ahead, but you won't be able to benefit.


I see many articles titled "Apply DDD in Android" or "Todo-List with DDD", but you can't learn how to model. People always learn best practice and find an answer, but there's no answer! It depends on the situation. There is no certain project structure nor certain architecture. Applying DDD for simple applications may cost lots of time and have no gain. It misleads what DDD is.


- #### DDD is not for Start-Up
If you are running Start-Up in an early stage, the service core domain may not be sure. For startups I suggest to follow lean development. Releasing service faster and finding customer fit is paramount, and during this term service domain changes often.
DDD is robust to change but domain should be certain, and it takes much unnecessary cost and effort, ends in vain.




- #### DDD is not for database oriented projects
DDD is not for database oriented applications that handle complex sql. Handling everything with complex sql doesn't match the domain model. DDD uses simple sql for fetching and updating domain models (aggregation), deploying it in-memory. Filter by sql is faster compared to filter in-memory, and if you handle big data you can't ignore the difference.
There are certainly workarounds like cache layer, but DDD is not the best choice.


- #### DDD is not for secondary contract projects
The benefit of DDD is limited if you cannot talk to customer, so DDD is not for most secondary contract project because your customer is another prime vender. In Japan, multiple subcontracting is major, and sadly it's prohibited to talk directly to customers. Lightweight DDD can be applicable, and may work to some extent, but it does not say you comprehend DDD because it's not pattern, it's modeling.


## DDD is for you !
I listed the situation where you had better not apply DDD to the project. It is strong enough to be robust and clean your project, but it's essentially difficult and requires some practice. Here is the list I recommend to use.


- When rewrite or refactor large project
- When constantly maintain own services
- When team members are familiar with and have some experience


Thank you for reading my post! Have a good weekend!