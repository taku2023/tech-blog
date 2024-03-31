---
title: The smells of code before colluption
description: 4 tips for improving my maintenance codebase.
date: 2024-03-31T22:00:00+09:00
categories: [Java,Refactor]
keywords: [Refactor]
---

## The smell of code
Do you enjoy refactoring? While some might say yes, the majority of people likely grow weary of deciphering complicated and poorly structured code written by others. I am currently working on a Java project, dedicating most of my time to fixing bugs and problematic code. It's a tedious task, prompting me to ponder the characteristics of bad code, along with its advantages and disadvantages. My decade of experience in coding alongside others has taught me that perceptions vary greatly; what I consider to be bad code might be seen as good code by someone else. Therefore, I'll lay out the foundation for my arguments.


### Don't do everything with SQL.
The primary distinction between SQL and programming languages lies in their flexibility; each SQL statement corresponds to a specific command. Consequently, if you rely on SQL for complex logic, you'll end up with numerous SQL statements that are only slightly different from one another.
For example, my maintenance codebase has 20 selects statement for fetching user. I show you some of them

- getDuplicateCount.sql
- selectByEmail.sql
- selectByEmailActive.sql
- selectByOnlyEmailActive.sql
- selectByUserId.sql
- selectByValidUserid.sql
- selectOtherUserByTenantIdUserId.sql
- selectByTenantIdUserId.sql

What's the difference between `selectByEmail` and `selectByEmailActive`? Perhaps the only variation is in the where clause. If you needed to query users by gender, would you add a 'selectByGender.sql' to your collection? Generally, SQL performs well with indexed queries, but for other types of queries, the computational effort is similar whether the query is executed in SQL or in application code. Given that the user table is indexed by two columns, userId and tenantId, we can retaining only `selectByUserId.sql` and handling the rest through the Stream API.

```java

  final List<User> users = db.selectByTenantId(tenantId);
  //selectByEmail
  final List<User> usersByEmail = users.stream().filter(user->user.email.equals(email)).collect(toList());
  //selectByEmailActive
  final List<User> usersByEmailActive = users.steram().filter(user->user.emailIsActive).collect(toList());
  //selectByUserId
  final User user = db.selectByUserId(tenantId,userId)

```

The approach is straightforward, eliminates redundancy, and is easy to maintain. The code clearly illustrates its purpose. In contrast, when utilizing SQL, interpretation often relies on the naming of SQL files.

To sum up, my stance against the excessive use of SQL is based on the following reasons:
- SQL statements often result in duplication and are challenging to maintain.
- The intricate business logic concealed within SQL makes it difficult to fully understand the entire specification.

However, there are scenarios where I would prefer using SQL:
- When it's necessary to filter through millions of records in a database. SQL is significantly faster and more efficient in terms of memory usage.
- When the priority is to enhance response times and the bottleneck is database querying.


### Pass argument for read, not modify it in function.
Have you ever lent a video game to a friend only to have it returned all scratched up? I certainly have. 
Just as a good friend wouldn't damage your belongings, good code shouldn't alter the variables passed to it. 

Maintaining invariance is crucial for ensuring code readability and maintainability. Consider a function `function addOne(arg:number)=>number` that is given the number 1 as an argument but changes it to 100. Such unexpected behavior can be surprising. In this sense, I expect a function not to modify its arguments because it should only perform calculations based on the input and return a result. 

Below is an example of code that violates this principle.
```java
  //break the rule
  public Response responseError(Map<String,Object> json){
    json.put("status","ng");
    json.put("message","INVALID_REQUEST");
    return Response.ok(json).build();
  }

  //login API - caller
  public Response login(){
    try{

    }catch(Exception e){
      Map<String,Object> json = new Map<>();
      json.put("message",e.getMessage())
      Reposnse error = responseError(json);
      //json.get("message") INVALID_REQUEST is unexpeced..
      return error
    }
  }
```
It's important to note that the `responseError` function overwrites JSON values each time it is invoked. 
Even more problematic is that this function doesn't utilize the argument as input but merely appends data to it. It's crucial to remember that arguments should not be altered.

### Remove unnecessary getter and setter methods
Many developers have a habit of employing getter and setter methods for every object attribute. However, the proper use of getters and setters is to encapsulate properties, validate values before setting them, and format values before getting them. Using them without these considerations is illogical.

```java

  public String userEmail;

  //bad
  public String getUserEmail(){
    return userEmail;
  }
  //bad
  public void setUserEmail(String userEmail){
    this.userEmail = userEmail;
  }

```
This piece of code is also from the project I maintained. Firstly, the userEmail property is public, and secondly, neither the getter nor the setter performs any meaningful action. They are essentially equivalent to directly using `public String userEmail`, so it's best to remove these unnecessary getter and setter methods.

Personally, I prefer using an `EmailAddress` value object over getters and setters, but employing getters and setters can still be considered good practice if they truly encapsulate properties.

```java

  private String userEmail;

  //setter do the job!
  public void setUserEmail(String email){
    if(!EMAIL_PATTERN.matcher(email)) return;
    this.userEmail = email;
  }
  //encapsulate property
  public String getUserEmail(){
    return userEmail;
  }
```


### Avoid magic number
A magic number is an undocumented and obscure constant that's not immediately clear to someone reading the code. For example, we all know π equals approximately 3.1415.., so it's not considered a magic number.
But what about the number '7'? If it's defined as `static final Integer DAY_IN_WEEK = 7`, it becomes self-explanatory and is no longer a magic number.

How about this?
```javascript
   alert.showMode = 0;
```

What does showMode 0 represent? The answer is 'invisible' - quite surprising, isn't it?
This piece of code comes from a project I've been maintaining, which was written by someone else. The project deals with legal contract management, and showMode indicates the visibility status of a legal contract. However, I often find myself puzzled, unable to recall what the number signifies.

Perhaps the original coder has a great memory, but I firmly believe that good code should not rely on human memory to be understood. Moreover, the use of a numerical representation suggests that showMode could be calculated or represent a coherent state, similar to a bit operation. This is misleading!

Straight reprisentation is meeningful.
```javascript
  alert.showMode = 'invisible'
```

I strongly advise against using magic numbers, although there are instances where their use is unavoidable.
- In cases where no alternative representation exists, it's crucial to document their meaning.
- For operations like bit manipulation, which can be calculated and represent complex states, consider encapsulating them.

## Conclusion
Defining what constitutes good code is subjective, as opinions vary widely. However, when multiple people are working on the same project, it's essential to establish and document a shared understanding of what good code means for that project. Achieving a common recognition among team members facilitates smoother collaboration, ultimately contributing to the project's success. I hope the examples I've provided offer some guidance.
