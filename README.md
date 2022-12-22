# :shield: exceptionally

**A fully type-safe and lightweight way of using exceptions instead of throwing errors**

:safety_vest: fully typesafe\
:baby_chick: lightweight (197 bytes)\
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

> You should also set evetrything to [`strict` mode](https://www.typescriptlang.org/tsconfig#strict) in your `tsconfig.json` to get the most out of this package.

## Examples

- [input validation](https://www.typescriptlang.org/play?noUncheckedIndexedAccess=true&noUnusedParameters=true&target=99&jsx=0&useUnknownInCatchVariables=true&noImplicitOverride=true&noFallthroughCasesInSwitch=true&exactOptionalPropertyTypes=true&pretty=true&noUnusedLocals=true#code/PQKgBApgzgNglgOwC4FoAmcoEMBGMJgID2KAxkQlEfmCMAFD1wC2ADkQE5JgDekAHqQiskcCgBowUAK6khUKGAC+YAGYcizMAHIIg4aIpYYMAJ7bGwYGBS279h46fOXrt+4+e3jcpW4A3Yzg0LCQCAF4wAB4AEVCsAD4AChCkLAAuMDi0yUD4VM5MlPjM7KwASjBwhLAkDmkCAB8pOsQAc0rq3noASF8obkwAeQBrKrA84NDOYrTy3rhVMCThsfD12vqISo4IJGkOBClZeShZisYe3f3DgSERMQQVqFH5pUtrLy-vn9+-73oSFMrAIAAUiANxjxelhpEgABaFFocdq9URIfCZAYohBtXq+MLILGtXH0d70frcdgDABqQQKHHGSWpSEy4IGnRq0J6VjA1wOR2YECwCHaqmkMEgHA0jKFCiwbWgYAA7vCIEcqEKEe0wJhdQhJmgFkskgBCFkAOlhCM4Oz2Ap0ACJrYiOI6wMxMFB2hZjctzRCkBb0fg7TcjtpHSGIO7PQofX7mYHg3AMRALfhcQiwDUAIwAJgADGGHZHo7HpJCcAQoK6woyESKwAXC2BSPCsBwsKR61BfT1Fv7LQT1UgS7dIyPkLGvQmBybLdGM+q2tmomAAKyF4t8+0Tx1TpAVyEErCIMChMD4LCQret9ud7u9-u8-m3AAGdQa75VaqOhtCR4wFYG8oGgXo3yOL8IDJHwKEhbB-AgdluEiG9TAQUhlhZNlA05bo+nggJ6UAigACVoAlVCJhIsIkwGSQWTpfJpg4eZ52WADDAQCiZBgINMAAUX0B4KHHf9aMeXiqLAXkQIUNROGVTs0DuAxHkuXlEJ1BECFSLBf3VGiWO4sAO0UeSwKNQi-F1VTIlzWTrCwZTUykLAkJQgAVIgyhwG8IHosdLkg445GgM5gjeD4bH+OL4oSxK4NsxDkMDaT+PGFyz24VKUKSbkXSRbQACkiHhI4YiICBtHENFU0xHRBOlTgzJFNB4FxKREQlVTq0gG84AgDhavxChCVZHQABlOAgLQ4FYGQtDQahOEkb1uCwLU23giAez3C8MFYTA4FIHUIHgIMwAAQS1SQAEdpDgC1RqUeYmBNPL0so-iLSEkTuMqBENGVQgIFB5qZSSL6BgypAknKd7+modNEFUIgknfBBweAwN3KQtBMgAEh4GGkDhhGlHfeYgA)
- [fetching data](https://www.typescriptlang.org/play?noUncheckedIndexedAccess=true&noUnusedParameters=true&target=99&jsx=0&useUnknownInCatchVariables=true&noImplicitOverride=true&noFallthroughCasesInSwitch=true&exactOptionalPropertyTypes=true&pretty=true&noUnusedLocals=true#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)

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

- **`ExtractDataType`**
  ```ts
  type ExtractDataType<Result extends ExceptionallyResult<boolean, unknown>> = Result extends
  	ExceptionallyResult<boolean, infer Data> ? Data : never
  ```

  ```ts
  import { ExtractDataType, success } from 'exceptionally'

  const result = success(1)

  type Data = ExtractDataType<typeof result> // => `number`
  ```

- **`ExtractSuccessType`**
  ```ts
  type ExtractSuccessType<Result extends ExceptionallyResult<boolean, unknown>> = Result extends
  	ExceptionallyResult<true, infer Data> ? Success<Data> : never
  ```

  ```ts
  import { exception, ExtractSuccessType, success } from 'exceptionally'

  const result = Math.random() > 0.5 ? success(new Date()) : exception('error')

  type Data = ExtractSuccessType<typeof result> // => `Success<Date>`
  ```

- **`ExtractExceptionType`**
  ```ts
  type ExtractExceptionType<Result extends ExceptionallyResult<boolean, unknown>> = Result extends
  	ExceptionallyResult<false, infer Data> ? Exception<Data> : never
  ```

  ```ts
  import { exception, ExtractExceptionType, success } from 'exceptionally'

  const result = Math.random() > 0.5 ? success(new Date()) : exception('error')

  type Data = ExtractExceptionType<typeof result> // => `Exception<string>`
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
