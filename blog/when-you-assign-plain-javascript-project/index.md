---
title: When you join a javascript project that hasn't been updated.
description: 5 ways to improve your javascript project.
date: 2023-07-18T01:03:00+09:00
categories: [Javascript]
keywords: [refactor,oop]
---

## Introduction
Web technology updates daily. From ES6 class syntax is adopted, and in ES13 top level await (in 2022) and class private field (in 2022) can be used.

But real world projects are not always updated. You know IE has extinct, but it's doesn't mean that messy and unused code for IE is not removed automatically.

My country Japan, for enterprise web application environment is not latest, and UI library like react or vuejs are not prominent.More longer the application has been in use, the older its develop environment. Even if you are curious to learn, you don't always get a chance to try your skill.

So today I'll write the blog about where to start, what to do when you have to involve obsolete project.


- Discuss the code quality with team members
- Reject new feature (and have a coffee)
- Remove unused code
- Unify Code Format
- OOP javascript

## Discuss the code quality
This section is the most important of all the advice I give here. Because opinions about what is good code and bad code are never the same. If you don't believe me, let's talk about the best name for login api. Some say login is best, others say sign in is best. What about get or fetch? As for name length,  people who like java will tend to choose long name for strictness, and people who like python tend to choose short name for simplicity.I like strictness, but I feel too long for `insertOrUpdateUserDataIfNotExist` and prefer `upsertUser` for simplicity.

There are lots of topics when thinking about the code quality.

- Readability
- Testability
- Moduleness
- Single Responsibility
- Flexibility to change 

It's nice if all team members have some knowledge or have their opinion about these matters, but usually they are on a different level and you can't discuss what they don't know completely. Under these situation, I recommend all members buy the same book about code quality and read it together. My recommendation is "The art of Readable code", because it's easy to read and practical, and everyone can understand (I hope).

After you discuss and reach consensus, next you write down a document and share with team members. I always write document, including good and bad code for examples and explanations.

I should add that discussions about code quality criticize code already existed, and no one is happy to be criticized. It's not comfortable, but you should do it. Good team is always open minded, welcome to point out or to be pointed out.


## Reject new feature (and have a coffee)
Project which is not updated recently might be too much busy to be refactored. I think it can't be helped for startups, but projects which have passed many years later after launch only get poor results should review the services, not add more features.

Good service will follow these loadmap.

- Assume customer needs
- Assure customer needs by user interview
- Research User behavior and get hint for product's UX
- Make paper product and reviewed by users
- Update or switch target few times
- If your product matchs the user's needs, then make a beta product and release it!

Many projects don't follow this loadmap or even reverse it.They release products, and are reviewed by customers. This may blur product purpose, add new features endlessly until it got on track or failed.

Even if you are a team member who is not responsible for products, you can add a user tracking service like GA4 and measure what features are used and not. Rejection new features may conflict with the sales team, but tracking user behavior may be welcomed. After tracking data, you down the features list and utilization. It may be a surprise.

## Remove unused code
I completely cannot understand why unused code are remained in release product. Using version control tools like git or svn, you can pull unused code at any time.

Unused code which will be used someday will never be used. Never (almost) !!

Some people cannot remove code wrote by others, because they feel sorry and feel doing negative feedback. You don't have to sorry! Detect unused code is very easy task using IDE like vscode or IntelliJ. They are smart enough to detect it. They have plugin to hide unused code, but you should just remove it because it affects binary size.

## Unify Code Format
Formatting code is very important, it necessary when working with team members.
When reviewing pull requests, you don't want to see code that mixed with tab and space, single or double colon. It's good practice to follow the language standard. For javascript and typescript I love to use Prettier for formatter, but I'll follow the conclusion made by team members.

Here is my simple Prettier allows singleQuote, single colon, 2 space for indent, use lf for end of line.

```json
{
	"singleQuote": true,
	"semi": false,
	"useTabs": true,
	"tabWidth": 2,
	"endOfLine": "lf"
}
```

## OOP javascript
Javascript is a prototype language, but you can apply OOP to javascript. From ES6(2015) class syntax has been adopted, and I recommend to use it.

Let's say we have a simple modal window for login. This may includes email, password inputs, and a login button. This modal is opened when navbar is clicked, and is implemented with jquery like this
```javascript
$(function(){
  const modal = `
    <div id="modal" class="modal hide">
      <form>
        <input id="input-email" type="email">
        <input id="input-password" type="password">
        <button id="login" class="button">Login</button>
        <button id="cancel" class="button">Login</button>
      </form>
    </div>
  `
  
  $('#body').append(modal)
  
  //trigger login api when click login button 
  $('#login').on('click',function(e){
    const email = $('input-email').val().trim()
    const password = $('input-password').val().trim()
    $.ajax({url:'/login',data:{email,password}})
  })

  //click close
  $('#cancel').on('click', function(e){
    $('#modal').addClass('hide')
  })
  
  //click navbar to open login modal
  $('#nav > button.btn-login').on('click',function(e){
      $('#modal').removeClass("hide")
  })
})
```
You may have seen code like that more than once. This is simple example so it can be read easily, but this code has few problems.

1. Open closed principle breaks. You can access any element with jquery
2. Modularity breaks. When you need to reuse this code, you have to copy and paste it.


Javascript can be a prototype language but these 2 principles should be applied. And using class it can be.


```javascript
//login.js
class LoginForm{
  #modal
  #button
  #container = document.getElementById("body");

  #onClickLogin = async (e)=>{
    e.preventDefault()
    const email = this.#modal.querySelector('#input-email').value
    const password = this.#modal.querySelector('#input-password').value
    await fetch('/login',{body:Json.stringfy({email,password})})
  }

  get isOpen = ()=>{
      this.#modal.classList.contains('hide')
  }

  close = ()=>{
    this.#modal.classList.add('hide')
  }
  
  open = ()=>{
    this.#modal.classList.remove('hide')
  }
  
  constructor(){
    const modal = `
      <div id="modal" class="modal">
        <form>
          <input id="input-email" type="email">
          <input id="input-password" type="password">
          <button id="login" class="button">Login</button>
          <button id="cancel" class="button">Login</button>
        </form>
      </div>
    `
    this.#container.insertAdjacentHTML('afterbegin',modal)
    this.#modal = this.#container.getElementById('modal')
    this.#button = this.#modal.getElementById('login')

    this.#button.addEventListener('click',this.#onClickLogin)
    this.close()
  }
}

const loginForm = new LoginForm()
export { loginForm }

//header.js
import {loginForm} from "./login.js"

const loginButton = document.querySelector('#nav > button.btn-login')
loginButton.addEventListener('click',(e)=>{
  e.preventDefault()
  loginForm.open()
})

```

Code will little bit longer, but 

1. You can gain open close principle. Simply calls `loginForm.open()` from header is good practice, and the rest of the details are closed in LoginForm class.
2. You don't have to copy and paste this code, you only have to instance it.

jQuery is a great library and very easy to handle with, but its ease makes developers break open close principle and modularity. I don't blame jQuery, I blame HTML for its global scope. If you want to achieve encapsulation, you have to introduce scoped css or web components. But that's it for this blogs, I will mention web components another day.

Thank you for reading ! Happy coding !