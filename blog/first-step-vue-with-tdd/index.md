---
title: Crash course for introduction to start Vuejs with TDD.
description: Crash course to implement login form with Vuejs v3.
date: 2023-08-03T10:04:00+09:00
categories: [Vuejs,TDD,Typescript]
keywords: [beginner,TDD]
---

## What is Vue.js?
Vue.js is a __frontend framework__ like React and is popular as well according to survey "state of javascript" in 2021.
It support reactive and is based upon virtual dom for rendering like React, but unlike React, it adopts many useful directive like `v-for` for for loop, or `v-if ` for conditional rendering. Vue.js was underestimated as it said to be applied only small project, which found out to be unfounded.

Vue.js recommends writting HTML, css, and javascript (or typescirpt) all in one file (aka *.vue file), and this makes us easy to manage component, no need to searching related css or javascript from many folders.

Let's dive into Vue.js and see the code below making counter app with click button. I don't explain the detail, but you will understand what it does at first glimpse. 

```typescript
//Counter.vue
<template>
  <div>Count:{{ count }}</div>
  <button v-on:click="plusOne" class="button">Click +</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);

const plusOne = (_: any) => {
  count.value = count.value + 1;
};
</script>

<style scoped>
.button {
  background-color: wheat;
  padding: 0.5em 1em;
}
</style>
```
![Counter animation](https://moritakuaki.com/__blogs__/first-step-vue-with-tdd/images/vue-counter.gif)


Type `npm create vue@latest` in terminal, then you are presented several prompts to choose options such as typescript, testing framework, and state library. After you choose all options, CLI automatically prepares Scafforld project.

I'll give lecture the basics of Vue.js but more informations are available at [official quick start](https://vuejs.org/guide/quick-start.html)


## What is TDD?
TDD is an abbreviation of the word "test driven development". Following the TDD procesure, __you should write failed test code first__, and then write implementation to pass test. If you've never done this, you may think it's redundant. But it not only keep you write test, but also keep clean and readable your code. You can write code with ease during all tests pass, and don't be anxious about hidden bugs.

## Let's start !
Introduction is over, I'll show you how TDD works with Vue.js. If you want to hands-on by step with the real code, git pull from __[My Rrepository](https://github.com/taku2023/crash-course-vuejs)__. Please see __[README.md](https://github.com/taku2023/crash-course-vuejs/main/README.md)__ and follow the written procesure. It runs with __nodejs >= 18.0.__

Here is the table of contents, it's a bit long but each section is very simple and understandable ! 

#### Table of contents
1. Login form's specification
2. How to test Vue.js
3. Start with email unit test
4. Pass the test
5. Email component test
6. Pass the test.
7. Password component (optinal)
8. Login Page test
9. Pass the test
10. E2E test.
11. Pass the test
12. Finish!!


## 1. Login form specification
Look at the image below, I consider very simple login form meets the condition that

1. Email verification. Verify only when contains alphabets, the symble @, and domain.
2. Show error label if email is not verified.
3. Password verification. Verify if it contains digits and alphabets, 6 or more characters.
4. Show error label if password is not verified.
5. Disable login button when email or password is not verified.
6. Server checks whether user exists and show `user not found` if doesn't.

The Final Image we'll make is here :) Very simple! 
![Login form](https://moritakuaki.com/__blogs__/first-step-vue-with-tdd/images/login-form.png)

## 2. How to test Vue.js
You know there are different test types and categories. I don't explain further, and simply list 3 categories of tests and how to do it.

- #### Unit Test
Unit test is the test for business logic which is independent from Vue.js or UI/UX. In this project, it means email and password verification test, and server logic test. It checks the function implementing logic produces the expected output. 
You can use any testing library you like, but I use __vitest__ because it's fast and offers simple API like Jest. Here is an example.

```typescript
import { expect, test } from 'vitest'

test('math.sqrt ', () => {
  expect(Math.sqrt(4)).toBe(2) // it passes.
})
```

If you use vscode for IDE, I recommended to use plugin `zixuanchen.vitest-explorer` for vitest. Just click buttons to running test. 
   
- #### Component Test
Component represents a unit of the UI. You know well if you have experience of React or atomic design.
It may be atom, morecular, or organism with simple UI logic. Component test tests

- Visual Logic
  Test rendering, based on inputted props.
- Behavioral
  Test correct rendering in response to user inputs.

It may depends on what UI framework you use, and Vue.js offer official library __@vue/test-utils__ for that. Here is an example shows error when entered invalid email. It's a kind of behavioral tests.

```typescript
import { expect, test } from 'vitest'
import { mount } from "@vue/test-utils"

test("show error when input invalid email", async () => {
    const wrapper = mount(EmailAddress)
    const input = wrapper.find("input")
    await input.setValue("invalid@email")
    expect(wrapper.find(".label.label--error").text()).toBe("invalid email")
  })
```
  
- #### E2E Test
E2E is abbreviation for __end-to-end__, which means from user action to response to user.
E2E test verifies the application entirely. It's based on real user UX like clicking login button then redirect to top page, or showing server error says <font color="red">user not found</font>. It requires api response so you can use production environment to get more condidence that your application works properly. E2E test requires more time and computing resources, so you don't have to run every commit. Tt's good to run with CI provider after you push on main or release branchs.

In this project, I choose __cypress__ for testing library. It can be easily integrated with major CI provider like jenkins or github workflows. Here is an examle checks we redirected to /home after login. 

It's as simple as you quickly get understand. Here is the [official page](https://docs.cypress.io/guides/overview/why-cypress) for more learning.

```typescript
describe("Login page", ()=>{
  it("visit home page after login is succeeded", () => {
    //redirect to /login
    vi.visit("http://localhost:5173/login")
    //filling login form
    cy.get('input[type="email"]').type("user@gmail.com");
    cy.get('input[type="password"]').type("passw0rd");
    cy.get("button").click();
    //assert /home    
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/home");
    });
  });  
})
```

Unit tests and component tests are costless, but E2E test may give you confidence that your application works properly. I will explain each test by step.

## 3. Start with Email Logic unit test.
Let's start with email unit test. The simplest email specification is that
- Contains A-Z or a-z at local-part (before @)
- Only domain name is allowed after @

It's so simple. As we're following TDD, let's write test and save as `email.test.ts`.

```typescript
import { describe, it, expect } from "vitest";
import EmailAddress from "@/components/email.ts"

describe("Email", () => {

  it("should not contains character #", () => {
    const email = new EmailAddress("invalid#email@gmail.com");
    expect(email.isValid).toBeFalsy();
  });

  it("should include character @", () => {
    const email = new EmailAddress("invaligmail.com");
    expect(email.isValid).toBeFalsy();
  });

  it("should valid", () => {
    const email = new EmailAddress("valid@gmail.com");
    expect(email.isValid).toBeTruthy();
  });
});

```

Running 1st test and failed, with output <font color="red">`ReferenceError: EmailAddress is not defined`</font>. Of course we don't have `EmailAddrss.ts`! Using vscode and plugin installed, you may see below.

![Vitest failed](https://moritakuaki.com/__blogs__/first-step-vue-with-tdd/images/first-test-failed.png)


### 4. Pass the first unit test.
To pass the test, create EmailAddress.ts which is not defined. I use regular expression to validate email. Before the "@" only contain alphabet, expression `^[a-zA-Z]+` matchs. It should be domain name after the "@" character, so expression `[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}` will match. I don't intend to explain RegExp further, just show you implementation quickly.

```typescript
//EmailAddress.ts
export class EmailAddress {
  private static validator(email: string) {
    return /^[a-zA-Z]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  public readonly isValid: boolean;

  constructor(public readonly email: string) {
    this.isValid = EmailAddress.validator(email);
  }
}

```
Import this class to `email.test.ts` and run test again. 
Then you'll find all the __tests are passed!__ Congratulations!

```vim
 ✓ email.test.ts (3)
   ✓ Email (3)
     ✓ should not contains character #
     ✓ should include character @
     ✓ should valid

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

### 5.Eamil component test
Now let's test email input which you haven't created yet! 
The specification says **"Show error label if email is not verified"**, so you need to create 1 input element, and 1 label element to show error. Just enough! Do write blackbox test, even you don't have implementation.
```typescript
//test/email.test.ts
import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";

describe("EmailAddress component ", () => {
  test("shows error when input invalid email", async () => {
    const wrapper = mount(EmailAddress);
    const input = wrapper.find("input[type='email']");
    await input.setValue("invalid#email@gmail.com");
    expect(wrapper.find("label").text()).toBe("contains only alphabet");
  });

  test("shows no error label", async () => {
    const wrapper = mount(EmailAddress);
    const input = wrapper.find("input[type='email']");
    await input.setValue("valid@gmail.com");
    expect(wrapper.find("label").isVisible()).toBeFalsy();
  });
});
```
`@vue/test-utils` supports mocking user inputs, clicks, everything! It's also matchs the element like `document.querySelector`, you can write classes, html tags, and so on.

The test will fail because there's no EmailAddress.vue imported. The situation is same as before, so we make it pass the test.

### 6. Pass the first component test
It's time to start learning Vue.js! I showed you simple counter before, so you can learn a bit about how to make a component. I'll show you code first and explain by step. 

```typescript
// ./src/components/EmailAddress.vue
<template>
  <label class="is-error" v-show="!valid">contains only alphabet</label>
  <input v-model="email" placeholder="youremail@gmail.com" type="email"/>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { EmailAddress } from "../models/email";
const email = ref<string>("");

const valid = computed(() => {
  return new EmailAddress(email.value).isValid;
});
</script>

<style scoped>
.is-error {
  color: red;
}
</style>
```
Remember vue file has html, css, javascript. If you know React, `ref` keywords is like `setState` in React. It's reactive variables, and you can access value by `.value` property.　
Another came out keyword is `computed`, it's just like `useEffect` in React. It's reactive value which depends on the `ref` value changes.
Last important new keywords are `v-model` and `v-show`, and these are called directives. `v-model` can two-way binding, it's like shared value between input element and Vue.js.　`v-show` switchs element's visibility.

Can you guess how this component behaves on user input? Maybe it shows error <font color="red">contains only alphabet</font> when input is invalid, otherwise shows nothing.

Run the test.... , and then __it passed!__
I paste the result below.

```vim
✓ email.test.ts (2)
   ✓ EmailAddress component  (2)
     ✓ shows error when input invalid email
     ✓ shows no error label

 Test Files  1 passed (1)
      Tests  2 passed (2)
```

### 7. Password component and test (Optional)
This section is rehash what we done with email component, and you can skip it. 

The password specification is that it should contains digits and alphabets, 6 or more characters. So we can write unit logic test below.

```typescript
//src/models/email.test.ts
import { describe, it, expect } from "vitest";

describe("Password", () => {
  it("should not less than 6 characters", () => {
    const password = new Password("sh0rt");
    expect(password.isValid).toBeFalsy();
  });

  it("should not only alphabets", () => {
    const password = new Password("shortpassword");
    expect(password.isValid).toBeFalsy();
  });

  it("should ont only digits", () => {
    const password = new Password("1234567890");
    expect(password.isValid).toBeFalsy();
  });

  it("should pass", () => {
    const password = new Password("longpassw0rd");
    expect(password.isValid).toBeTruthy();
  });
});
```
This test is failed with saying <font color="red">`ReferenceError: Password is not defined`</font>. To pass the test, let's write code below.
```typescript
// src/models/email.ts
export class Password {
  private static validator(email: string) {
    return /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z]{6,}$/.test(email);
  }

  public readonly isValid: boolean;

  constructor(public readonly email: string) {
    this.isValid = Password.validator(email);
  }
}
```

And these 4 tests are __all passed !__ . 
```vim
 ↓ email.test.ts (3) [skipped]
 ✓ password.test.ts (4)

 Test Files  1 passed | 1 skipped (2)
      Tests  4 passed | 3 skipped (7)
```
It Works! The component test and actual code are same before.
Test code is 
```typescript
//test/password.test.ts
import {mount} from "@vue/test-utils"
import {describe, expect, it} from "vitest"
import Password from "@/components/Password.vue";

describe("Password component",()=>{
	it("Shows error when input invalid password", async ()=>{
		const wrapper = mount(Password)
		const input = wrapper.find("input[type='password']");
		await input.setValue("sh0rt")
		expect(wrapper.find("label").text()).toBe("contains alphabets and digits, 6 or more characters.")		
	})

	it("shows no error label",async ()=>{
		const wrapper = mount(Password)
		const input = wrapper.find("input[type='password']")
		await input.setValue('longpassw0rd')
		expect(wrapper.find('label').isVisible()).toBeFalsy()
	})
})

```

And the actual code is
```typescript
// src/components/Password.vue
<template>
  <label class="is-error" v-show="!valid"
    >contains alphabets and digits, 6 or more characters</label
  >
  <input type="password" v-model="password" />
</template>

<script setup lang="ts">
import { Password } from "@/models/password";
import { ref, computed } from "vue";
const password = ref<string>("");

const valid = computed(() => {
  return new Password(password.value);
});
</script>

<style scoped>
.is-error {
  color: red;
}
</style>
```

Then test results are all ok!
```vim
 ✓ password.test.ts (2)
 ↓ email.test.ts (2) [skipped]

 Test Files  1 passed | 1 skipped (2)
      Tests  2 passed | 2 skipped (4)
```

### 8. Login Page test
This is the last section for component test. We'll combine these two components to make Login form. Firstly let's check the login specification.

The login requirements are
- Disable login button when email or password is not verified.
- Server checks whether user exists and show `user not found` if doesn't.
- __New:__ After login was succeeded, transfer to the top page.

The first condition can be tested easily, but other two conditions require some task, so skipped to next E2E test section.
Of course you can test server response using mocks, but it plausible to test with real environment by E2E tests.

And write the test code as these requirements are assured.
Let's assume we have Login.vue component. The test below assure these error show.

```typescript
import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";

describe("Login Page", () => {
  test("button is disabled when email is not valid", async () => {
    const wrapper = mount(Login);
    await wrapper
      .find("input[type='email']")
      .setValue("invalid#email@gmail.com");
    await wrapper.find("input[type='password']").setValue("longpassw0rd");
    expect(wrapper.find("button").attributes().disabled).toBeDefined();
  });

  test("button is disabled when password is not valid", async ()=>{
	  const wrapper = mount(Login)
    await wrapper
      .find("input[type='email']").setValue("valid@gmail.com")
    await wrapper.find('input[type="password"]').setValue('sh0rt')
    expect(wrapper.find("button").attributes().disabled).toBeDefined();
  })
});
```

It's failed again and says <font color="red">`ReferenceError: Login is not defined`</font>, similar warning you have seen before. 

Next section we'll create __Login page__ at last !

### 9. Pass the Login page test
We made two components so far, now you just combine with and incorporate as Login form. But just combine into Login page isn't enough. Login page will need to validate login and pass `{email:string,password:string}` object to login API, so Login page should have some variables.

In order to do that, simply holds email and password, pass these variables to childcomponent, and return if it's verified or not. But how to do with Vue.js ? Before checking the answer, I simply explain each syntax and keyword which are important for component communication.

- **`props`** keyword__
  It's like props in react, for parent component to pass value to child component. To pass value, write `:key="value"` on your child component tag and catch it inside child component with `defineProps` keyword.
  Passing direction is `Parent -> Child`

- **`emits`** keyword
  Unlike react, vue allow child component communicate with parent component. `Emits` is a keyword for, and you can create custom event. For instance you can define `const emits = defineEmits<{"change":[email:string]}>()` and `emits("change",email)` will pass email value to parent component. 
  Passing direction is `Child -> Parent`

- **`@update`** keyword
  It's way for parent component to catch emitted event. To catch email emits from child component, write `@update:email=(email)=>{ }` and you can catch emitted email value. 

- **`v-model`** keyword
  `v-model` was shown before on input element, but it can be used in custom compoenent. v-model is actually shorthand for combination of `props` and `@update`, so `v-model:key="value"` can be written as `:key="value"` and `@update:key="value"`. It's so useful when you share mutable value between nested components.

That all for lecture, I'll give you example how to use these keywords in Login page. 

```typescript
//src/pages/Login.vue
<template>
  <p class="title is-center">Login</p>
  <form class="form">
    <label class="is-text-left">email</label>
    <EmailAddress
      v-model:email="form.email"
      @update:validate="
        (isValid) => {
          form.emailIsValid = isValid;
        }
      "
    />
    <label class="is-text-left">password</label>
    <Password
      v-model:password="form.password"
      @update:validate="
        (isValid) => {
          form.passwordIsValid = isValid;
        }
      "
    />
    <button class="button" :disabled="disabled">Login</button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import EmailAddress from "@/components/EmailAddress.vue";
import Password from "@/components/Password.vue";

const form = ref({
  email: "",
  password: "",
  emailIsValid: false,
  passwordIsValid: false,
});

const disabled = computed(() => {
  return !(form.value.emailIsValid && form.value.passwordIsValid);
});
</script>
<style scoped>
.title {
  font-size: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
}

.is-text-left {
  text-align: left;
}
</style>
```
What this code does is holding variables, passes to child components and updates it. When either of verification is not satisfied, login button may be disabled. 

This code isn't compiled because Login.vue requires two child components some modification. These two child components have to be passed props and emit validation to login page, and here's the modified code below.

Here's modified __EmailAddress.vue__
```typescript
//src/component/EmailAddress.vue
<template>
  <label class="is-error" v-show="!valid">contains only alphabet</label>
  <input v-model="email" placeholder="youremail@gmail.com" type="email" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { EmailAddress } from "@/models/email";

//passed props
const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});

const email = ref<string>(props.email);

//emits event to parent (Login) component.
const emits = defineEmits<{
  "update:email": [email: string];
  "update:validate": [isValid: boolean];
}>();

const valid = computed(() => {
  const isValid = new EmailAddress(email.value).isValid;
  emits("update:email", email.value);
  emits("update:validate", isValid);
  return isValid;
});
</script>

<style scoped>
.is-error {
  color: red;
}
</style>
```

Here's modified __Password.vue__
```typescript
//src/compnents/Password.vue
<template>
  <label class="is-error" v-show="!valid"
    >contains alphabets and digits, 6 or more characters</label
  >
  <input type="password" v-model="password" />
</template>

<script setup lang="ts">
import { Password } from "@/models/password";
import { ref, computed } from "vue";

const props = defineProps({
  password: {
    type: String,
    required: true,
  },
});

const emits = defineEmits<{
  "update:password": [password: string];
  "update:validate": [isValid: boolean];
}>();

const password = ref<string>(props.password);

const valid = computed(() => {
  const isValid = new Password(password.value).isValid;
  emits("update:password", password.value);
  emits("update:validate", isValid);
  return isValid;
});
</script>

<style scoped>
.is-error {
  color: red;
}
</style>

```

It's time to run test and assure it's perfect! 
And the result is __perfect!__

```vim
↓ password.test.ts (2) [skipped]
 ↓ email.test.ts (2) [skipped]
 ✓ login.test.ts (2)

 Test Files  1 passed | 2 skipped (3)
      Tests  2 passed | 4 skipped (6)
```

### 10. Write End-to-End test

Now you master the component test, right? Now let's go dive to E2E test! 
Reminds you, E2E test is for whole application, and test in an environment close to the production one (you can use production as well). It's browser test, so it's independent to Vue.js or other frameworks completely.

I use [__Cypress__](https://docs.cypress.io/guides/overview/why-cypress) for E2E, it powerful testing library can test anything that runs in a browser. Install it by `npm i -D cypress`, and run `npx cypress open` to open intruduction dialog below, then choose E2E test type. That's done for setup :) 

I don't explain cypress APIs, but it's so simple and intuitive like this.

![Cypress Instruction](https://moritakuaki.com/__blogs__/first-step-vue-with-tdd/images/cypress-starter.png)

#### Specitications
Now you should remember what to test for E2E, and we discussed on chapter 8 titled "Login Page test". I listed below.

- __Server checks whether user exists and show `user not found` if doesn't.__
- __After login was succeeded, transfer to the top page.__
 
And these two conditions will be tested in cypress like that.

```typescript
//cypress/e2e/login/login.cy.js
describe("Login page", () => {
  //Before each test, redirect to /login page
  beforeEach(() => {
    cy.visit("http://localhost:5173/login"); //vite's defaut port is 5173
  });
  // check show error 
  it("show error if no user found", () => {
    cy.get('input[type="email"]').type("usernotfound@gmail.com");
    cy.get('input[type="password"]').type("passw0rd");
    cy.get("button").click();
    cy.get("p.is-error").should("contain.text", "user not found");
  });
  // check redirect to /home after login
  it("visit home page after login success", () => {
    cy.get('input[type="email"]').type("user@gmail.com");
    cy.get('input[type="password"]').type("longpassw0rd");
    cy.get("button").click();    
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/home");
    });
  });
});
```

I should note that vite's dev server's __default port is 5173__.

Good! E2E test is implicit and easy to read, right?
In next section, we make it run and work on real browser! :)

### Pass E2E test
To pass test, we have to add more implementations below
- Client side routing to tansit to home when login button is clicked

There's a lot of work to do, but I will explain as easy as I can.

#### Client side routing
There are several ways for adding routing function to Vue.js. You can do without library, but Vue.js officially supports `vue-router` library which enables, and install it by type `npm install vue-router` in your terminal. 

After vue-router is installed, add Home.vue which contain only "Home" text.
```typescript
//src/pages/Home.vue
<template>
  Home  
</template>
```
And now having two pages, you can transit pages using `vue-router` in main.ts file.

```typescript
//src/main.ts
import * as Vue from "vue"
import { createRouter, createWebHistory } from "vue-router"
import Login from "@/pages/Login.vue"
import Home from "@/pages/Home.vue"
import App from "@/App.vue"

const router = createRouter({
  history: createWebHistory(),
  // define routes here. 
  // each route assosiate path to component. 
  // name is not required, but it's useful to specify explicitly
  routes: [
    {
      path: "/",
      redirect: { name: 'login' }
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
  ],
});

const app = Vue.createApp(App)
app.use(router)

app.mount("#app")
```
And modify App.vue to display routing view.
```typescript
///App.vue
<template>
  <RouterView></RouterView>
</template>
```
Main.ts is prominent for routing. You can add any path and related component to routes value.
This routing behaiviors we expect are

- Basepath "/" redirect to "/login" and shows Login.vue
- Basepath "/login" shows Login.vue

Lastly, make login button transit to "/home" when it's clicked. To do this, use `useRouter` and `push({name:'home'})` to redirect home.

```typescript
<template>
    //... omit
    <button class="button" :disabled="!enabled" @click.prevent="toHome">
      Login
    </button>
    //... omit 
</template>
<script lang="ts">
import {useRouter} from "vue-router"

//... omit

const toHome = (_: MouseEvent) => {
  useRouter().push({name: 'home'})
};
</script>
```

If you already known react, the `vue-router` is like what `react-router-dom`, and  `useRouter` is what `useNavigate` in React. In fact, from version 3, Vue.js introduces hook-style api called composition api, easy to understand for new learners.

Now that's all for routing, but we have lots more work to do, API for client and server.

#### Login API server
There several ways to prepare test api, including mocking.

- Mocking with Cypress
- Mocking with Prism
- Mocking http client call with Vitest

But I will implement with nodejs using express framework, like __production environment__. For simplicity, we don't prepare email or password validation for server, and only checks user matches `users` array. For brevity, assume your email is __`your@gmail.com`__ and any other email isn't match as you.

```javascript
//server/server.js
/// <reference types="express"/>
const app = require("express")();
const parser = require("body-parser");
const port = 3000;

app.use(parser.json());
app.use(cors({
  origin: 'http://localhost:5173' 
}))

//local DB
const users = [{ name: "You!", email: "your@gmail.com" }];

app.post("/login", (req, res) => {
  const email = req.body["email"];
  const user = users.find((user) => user.email === email);
  if (!user) {
    res.status(404).json({ message: "user not found" });
  } else {
    res.status(200).json({ name: user.name });
  }
});

app.listen(port, () => {
  console.log(`Login server listening on port ${port}`);
});
```
Type `node server.js` and API server runs on your `localhost:3000`. I also resolve cors by allowing only `localhost:5173` which is Vue.js dev server's default hostname.

Try to call login API using http client like postman, and you'll get expected responses. 

- POST /login with `{email:'your@gmail.com',password:***}` return 200
- POST /login with **NOT** `{email:'your@gmail.com'}` return 404 with error message `user not found`

#### Http client call

Just a little more patience to pass the test. Lastly adding http client and trigger by clicking login button is enough. We use `fetch` api to return `{ok:boolean,message?:string}` 

```typescript
//src/http/login.ts
export const login: (_: {
  email: string;
  password: string;
}) => Promise<{ ok: boolean; message?: string }> = async (data) => {
  const result = await fetch("http://localhost:3000/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (result.ok) {
    return Promise.resolve({ ok: true });
  } else {
    const json = await result.json();
    return Promise.resolve({
      ok: false,
      message: json["message"],
    });
  }
};

```
And you can use within Login.vue like this.
```typescript
//src/pages/Login.vue
<template>
  <form>
    //... same 
    <p class="is-error">{{ serverError }}</p>
    <button class="button" :disabled="!enabled" @click.prevent="onClickLogin">
      Login
    </button>
  </form>
</template>

<script setup lang="ts">
import { login } from "@/http/login";
//...same before

const serverError = ref<string | undefined>(undefined);

const onClickLogin = async (_: MouseEvent) => {
  const { ok, message } = await login({
    email: form.value.email,
    password: form.value.password,
  });
  if (ok) {
    await router.push({ name: "home" });
  } else if (message) {
    serverError.value = message;
  }
};
</script>
```
And we can expect login button call login API when clicked, and transit to home if it's succeed, or show error if it not.

All things done! :) Have a break !!

### 11. Pass E2E test
Before you run E2E test, you should check that
- Type `npm run dev` to start Vue.js server on http://localhost:5173
- Type `npm run serve` on /server to start API on http://localhost:3000

Check both server is running on exactly same port. If not, E2E test should failed or you can rewrite configuration for new ports.

Ready to go ? 
Type __`npx cypress open`__ to start API server is running, and choose E2E test, and waits a second...

![Cypress recording](https://moritakuaki.com/__blogs__/first-step-vue-with-tdd/images/cypress-record.mp4)

All tests are passed !! 
Of course every unit tests and component tests are passed evenly.

### 12. Conclusion
I agree this login form is messy and have much to do for improving UI/UX.
(Actually I added style to look nicer.)

But this is an example for TDD with Vue.js, the most fundamental and includsive lecture from unit test to E2E test. I'm glad you feel like trying TDD with your currently project, or interested to learn Vue.js !

Anyway thank you for reading ! Have a good test life :)