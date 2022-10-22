# :shield: exceptionally

**A fully type-safe and lightweight way of using exceptions instead of throwing errors**

:safety_vest: fully typesafe\
:baby_chick: lightweight (205 bytes)\
:running: almost no runtime overhead\
:ok_hand: easy to use syntax\
:handshake: works everywhere (browser, node, cjs, esm)\
:warning: can warn you about unhandled exceptions\
:no_entry: no external dependencies

<!-- list of supported emojis on GitHub: https://github.com/ikatyang/emoji-cheat-sheet -->

## Table of contents

- [Problem Description](#problem-description)
- [Solution](#solution)
- [Usage](#usage)
- [Best Practices](#best-practices)
- [Glossary](#glossary)

<!-- ---------------------------------------------------------------------------------------------------- -->

## Problem Description

Code can fail. Especially when you are accessing multiple services. The common way to handle errors is to throw them. But you won't really know what function could potentially throw an error in your application code.

Well written applications can differentiate between [errors](#error) and [exceptions](#exception). They can recover from exceptions and include ways to recover from them.

Wrapping everything into `try-catch` blocks is not a good approach since it requires you to know the implementation of the function you are calling adds a indentation level, alters the program flow and is easy to forget if you are not paying attention.

The exceptions you get in the `catch` block typed as `unknown`, so you don't really know what happened and you need to account for different kind of exceptions (e.g. retry sending a request makes only sense if you got a network exception and will probably not make sense if you pass invalid payload to a service).

While it requires just a little of effort to look into a function to see what kind of exception get thrown, you probably can handle it manually. But in bigger applications you will probably have a lot of nesting and conditional logic where it is not so easy to spot all different outcomes. It is easy to forget to handle an exception case or maybe you want to handle a case that was already handled inside that function, so you'll end up with code that will never be reached and

Adding a new kind of exception deep down in the nested functions would require you to take a look at all the code parts that use the function and check whether they should handle the exception or pass it to the next level.

<!-- ---------------------------------------------------------------------------------------------------- -->

## Solution

**Don't throw errors and exceptions, return them instead. That's it!**

No, there is a little bit more to it.

First of all, we need to make sure that in each part of the code we kow what the outcome of a specific function call will be, without looking at the implementation. To do that, we always need to return data as well as exceptions. If we return everything, TypeScript can infer all types and we know what we get when calling a function.

But now we also need a way to distinguish between a successful result and a result that contains an exception, so we need to wrap the value we return into an object. A by-product of this is that we need to unwrap the actual value at a later point, where we want to access it. This should be made as easiest as possible.

Because we don't throw exceptions, we don't use `try-catch` blocks. We need to use `if` statements to check whether or result contains a successful response or an exception.

Little helper functions, that are fully typed will greatly improve the Developer Experience. Of course we want our code to be explicit enough, so the code can be read and understood fast. This means we need to come up with meaningful names for our wrapping functions.

And because this is no rocket science, we don't need hundreds of dependencies to make this all happen. The could should be kept clean and efficient.

This packages delivers a solution to all the problems described above.

<!-- ---------------------------------------------------------------------------------------------------- -->

## Installation

```bash
npm install exceptionally
```

## Usage

You can find some detailed examples [here](https://github.com/ivanhofer/exceptionally/tree/main/examples).

### exposed functions

- **`success`**:
  ```ts
  const success: <Data>(data: Data) => Success<Data>
  ```

  ```ts
  import { success } from 'exceptionally'

  const saySomething = () => {
     return success('hello world')
  }

  const result = saySomething()

  result.isSuccess // => `true`
  result.isException // => `false`
  result() // => `'hello world'`
  ```

- **`exception`**:
  ```ts
  const exception: <Data>(data: Data) => Exception<Data>
  ```

  ```ts
  import { exception } from 'exceptionally'

  const saySomething = () => {
     return exception("Don't tell me what to do!")
  }

  const result = saySomething()

  result.isSuccess // => `false`
  result.isException // => `true`
  result() // => `"Don't tell me what to do!"`
  ```

- **`assertSuccess`**:
  ```ts
  const assertSuccess: <Result extends Success<unknown>>(result: Result) => asserts result is Result
  ```

  ```ts
  import { assertSuccess, exception } from 'exceptionally'

  const doSomething = () => {
     const result = Math.random() > 0.5 ? success(1) : exception(0)

     if (result.isException) throw new Error(result())

     assertSuccess(result)

     return success()
  }
  ```

- **`assertException`**:
  ```ts
  const assertException: <Result extends Exception<unknown>>(result: Result) => asserts result is Result
  ```

  ```ts
  import { assertException, exception } from 'exceptionally'

  const doSomething = () => {
     const result = Math.random() > 0.5 ? success(1) : exception(0)

     if (result.isSuccess) return result()

     assertException(result)
     throw new Error(result())
  }
  ```

- **`Exceptionally`**:
  ```ts
  type Inverted<Success extends boolean> = Success extends true ? false : true

  class Exceptionally<Success extends boolean> {
     readonly isSuccess: Success
     readonly isException: Inverted<Success>
  }
  ```

  ```ts
  import { success, Exceptionally } from 'exceptionally'

  const result = Math.random() > 0.5 ? success(1) : 0

  if (result instanceOf Exceptionally) {
     const data = result()
     console.info(data) // => `1`
  } else {
     console.info(result) // => `0`
  }
  ```

### exposed types

- **`ExceptionallyResult`**:
  ```ts
  type ExceptionallyResult<Success extends boolean, Data> = () => Data & Exceptionally<Success>
  ```
- **`Success`**
  ```ts
  type Success<Data> = ExceptionallyResult<true, Data>
  ```

- **`Exception`**
  ```ts
  type Exception<Data> = ExceptionallyResult<false, Data>
  ```

<!-- ---------------------------------------------------------------------------------------------------- -->

## Best Practices

- **create wrapper functions for calls to other services**
  \
  Keep it **DRY**. Once you have written the code to connect to a service, you can reuse it for different API calls. And you don't need to handle the same edge-cases multiple times.
- **internally don't throw anything, just throw errors at the application boundaries**
  \
  Inside the code you can control, **never throw** errors. But you need to tell your users and services that consume data from your application if something was not successful. At that point it is ok to throw an Error.
- **document what kind of errors your application could throw and use a unique class (or error code) per error**
  \
  Having an **unique meaningful identifier** for each kind of error (e.g. validation, network-issues, etc.) will help you understand what has happened even after 3 or more levels of function calls. It makes it easy to handle only specific exceptions and deliver better error messages to your users.

<!-- ---------------------------------------------------------------------------------------------------- -->

## Glossary

### error

It is not possible to recover from an error.

e.g. a `OutOfMemoryError` will hinder your application to execute it's code and therefore you can probably do little to nothing against it. The result will probably lead to an exit of the application.

### exception

Exceptions are caused by the code of the application itself. The application knows this case could occur and can recover from it.

e.g. a `ValidationException` will not store the data in your database, but will also not crash your application.
