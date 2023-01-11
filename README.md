# :shield: exceptionally

**A fully type-safe and lightweight way of using exceptions instead of throwing errors**

:safety_vest: fully typesafe\
:baby_chick: lightweight core library (125 bytes)\
:gear: useful utility functions\
:running: almost no runtime overhead\
:ok_hand: easy to use syntax\
:handshake: works everywhere (browser, node, cjs, esm, etc.)\
:warning: can warn you about unhandled exceptions\
:no_entry: no external dependencies

<!-- list of supported emojis on GitHub: https://github.com/ikatyang/emoji-cheat-sheet -->

## Table of contents

- [Problem Description](#problem-description)
- [Solution](#solution)
- [Usage](#usage)
- [Best Practices](#best-practices)
- [Glossary](#glossary)

<!---------------------------------------------------------------------------------------------------------->

## Problem Description

Code can fail. Especially when you are accessing multiple services. The common way to handle errors is to throw them. But you won't really know what function could potentially throw an error in your application code.

Well written applications can differentiate between [errors](#error) and [exceptions](#exception). They can recover from exceptions and include ways to recover from them.

Wrapping everything into `try-catch` blocks is not a good approach since it requires you to know the implementation of the function you are calling adds a indentation level, alters the program flow and is easy to forget if you are not paying attention.

The exceptions you get in the `catch` block typed as `unknown`, so you don't really know what happened and you need to account for different kind of exceptions (e.g. retry sending a request makes only sense if you got a network exception and will probably not make sense if you pass invalid payload to a service).

While it requires just a little of effort to look into a function to see what kind of exception get thrown, you probably can handle it manually. But in bigger applications you will probably have a lot of nesting and conditional logic where it is not so easy to spot all different outcomes. It is easy to forget to handle an exception case or maybe you want to handle a case that was already handled inside that function, so you'll end up with code that will never be reached and

Adding a new kind of exception deep down in the nested functions would require you to take a look at all the code parts that use the function and check whether they should handle the exception or pass it to the next level.

<!---------------------------------------------------------------------------------------------------------->

## Solution

**Don't throw errors and exceptions, return them instead. That's it!**

No, there is a little bit more to it.

First of all, we need to make sure that in each part of the code we kow what the outcome of a specific function call will be, without looking at the implementation. To do that, we always need to return data as well as exceptions. If we return everything, TypeScript can infer all types and we know what we get when calling a function.

But now we also need a way to distinguish between a successful result and a result that contains an exception, so we need to wrap the value we return into an object. A by-product of this is that we need to unwrap the actual value at a later point, where we want to access it. This should be made as easiest as possible.

Because we don't throw exceptions, we don't use `try-catch` blocks. We need to use `if` statements to check whether or result contains a successful response or an exception.

Little helper functions, that are fully typed will greatly improve the Developer Experience. Of course we want our code to be explicit enough, so the code can be read and understood fast. This means we need to come up with meaningful names for our wrapping functions.

And because this is no rocket science, we don't need hundreds of dependencies to make this all happen. The could should be kept clean and efficient.

This packages delivers a solution to all the problems described above.

<!---------------------------------------------------------------------------------------------------------->

## Installation

```bash
npm install exceptionally
```

> You should also set evetrything to [`strict` mode](https://www.typescriptlang.org/tsconfig#strict) in your `tsconfig.json` to get the most out of this package.

## Basics

```ts
import { success, exception } from 'exceptioanlly'

const doSomething = () => {
  const value = Math.random()
  // whenever you usually throw, return an `exception` instead
  // you can pass additional payload if you want
  if (value < 0.1) return exception('please try again')

  // if a function can return an `exception`, you should wrap the returned element with `success`
  return success(value)
}

const result = doSomething()
// instead of having to use `try-catch`, you simply check if the result is an exception
if (result.isException) {
  // you can unwrap the exception, and the result will be typed as `string`
  concole.error(result().toUppercase()) => 'PLEASE TRY AGAIN'
  return
}

// because we have handled the exception above, we are left with the `success` object
// unwrap it and it will be typed as a `number`
console.info(result().toPrecision(2)) // => e.g. '0.57'
```

<!---------------------------------------------------------------------------------------------------------->

## Examples

- [input validation](https://www.typescriptlang.org/play?noUncheckedIndexedAccess=true&noUnusedLocals=true&noUnusedParameters=true&target=99&jsx=0&useUnknownInCatchVariables=true&noImplicitOverride=true&noFallthroughCasesInSwitch=true&exactOptionalPropertyTypes=true&pretty=true#code/JYWwDg9gTgLgBAbzgUwB4GNlhsCA7AGjgGcBXdTY4uAXzgDMoIQ4ByNTbXPAQwBs+AT1YAoEQHpxcALSy58hYqXKVqteo2a1Y9PmLwAbv2AATHjGRwAvHAA8AEXM8AfAAozMHgC44jz0SM+U3NoH3cnHz8eAEprZzgYKFJLAB8SROA8AHNYq3iEEQBIXTx9OGBiAHkAa2s4QOCYaHDPaKLgejhXCprrKxtE5NioZBhSKDwSckpiFpixQpGxiZQMLBx8bqrqtpoxSRktI+OT07PVMRhBMEsABQgymwLCnlIYAAtQ9KhMrKKcGB8ZA+fQ-bJFEoWPAwEEZcF7EQlMqQfQANWMHmgdVcKJhcHu+ly+SKByW40mIGQPDwv3opD4KCgTCgcEpVB4WWQ1AA7u9kJNiMxRu9fuVqJkGiZ2p1XABCXEAOleH2gw1G5LYACJlZ8oJrWRViL9RNKuvKHjAFQCgWrlpNWJrrch9SBDcbTTiLVbgIDkAqgdkPnB4gBGABMAAZbRqHU6XaQygAjSzEXUWFkfalwcMRuDod48KA8dDp4gmwodM2KyH8mDRlYOmvQl1u7KiCsyxVO-38rJB2xwACsEajcDJDc1TZg8bKkJ4mTg5jgQJ4ZWHufzheLpfLpPVKwABoNkAe4Lz+fUMeZuHAwKviFyiuPJseRAikfBiDwDMgCfAbKugh4OgXS4j4f5EogEJ6IYV4bHgABKXL0v+l5BB4yCevoRC4ui6EhFAbQdl0krXvgSFkHwloVAAomsXD4PWkykfBFEoXABx3lQDDQNyhYmKsnDwQsBxfgYoofJYHg8GefLMXBN4FtQXEPlKxQweUAk2CGHFSDwfE+iQ36-haAAqEBRImq6YbibRPvuArTFysymLs+xSOcnled5PnSGIaCQLAeYaUkkwAcQQEga4kHPB+Rk-n+bFUXU+nzp+xl-q4zwvG8uo+KwABSEDvJM9gQMgrAEEUhROvlNFMliBZ4CYQTZCQnz0gJyYoKuwDIFAlXVVO+UADLQMgLDAGAZAsCYEB8NARBGvAPCUvASLICW+6LiYU0VMA6CisgQSWnAACCa1EAAjqQwAKoNhQ0HZxGuGJJn6El1HEHRQncLEHxMNycB4MgQP1cyr0ZRan3Rc9SLzX6mT0BArgHiDQO4vFyAmD4AAkCBvYlyFUdFNAHm5IihdFIhAA)
- [fetching data](https://www.typescriptlang.org/play?noUncheckedIndexedAccess=true&noUnusedLocals=true&noUnusedParameters=true&target=99&jsx=0&useUnknownInCatchVariables=true&noImplicitOverride=true&noFallthroughCasesInSwitch=true&exactOptionalPropertyTypes=true&pretty=true#code/JYWwDg9gTgLgBAbzgQwM6oKawMoFcDG+G6ANHBgB5FgzAQB2ZAolRjXfcgDZcCeZqAkXRwAvnABmUCCDgByStVoNufOQCh1Aei1wAtAcNHjJ02fMXLV6zcuadcACYYJwehifAJErBnrwWJQ44fC40TFRJaBQeOABrN0c4CAlyVnYGVG1dADkAeQAVJgAuOFQZDAALCAB3OALeMAxsfChgGhDkejl4Z1RaegBzXFRKuAAjDBgajD9Pb19-OABhMPRiOBhK5F6sYAA3DykZOAADJihpKFOAOmy4B8e4AEFI5Dga6DjkaVx6JJmnXoZSmKDgYGkTVgvDgblQwGcm228FC4U2EDgIGQcQ8bh8UD8RA+XxQg2QbjuqJEOSmnygcUCbGUwMoMD8jkiFyuiHUAEgHAABGCoPTAQb0aAeLYeAAKYV4g1+-ycEA2EvgUPh-SRHlOEoAqvQRhhHAAZCD4bioU4hBiuQZ8gnIRwMPhwADECLgAF44NheCBxhAuAAKOQ06ZfRkZboASnUonUVMiABEMPgIM4AFLlejR5lpNn-TmXaIIPmC4Wi8WSnVwOXIBVKpIutUQDVYLXwaVnA1GzBmi1Wm0Z+j2x0YZ2umGepK+-2B4NhtMZ7O5-McOTxxPJuAACRgMDAG4YhfZJe55f5uiFIrFEoJdYbTYgfxbqsi6vBneA2p7eogQ1jUHS0uGtW0xzFCcp3oN1Zx9P0AyDUM5API8TzjBMkzWTlwBgXgUx2NApgws9izgLkywrG8q3vWse2fRVX2VVtP3bb8oC7OsAKAgdzVA8DR3HXknRdWCZy9eckKXOQmDwgiiMwGAMK3LD7hqSo5h8GB8EqNxBicIiyHeHw6i2fTIktYFtjAJp6BuG4Pk04FyhAKY9KGSRyTAshgHgX84EGCBM3ReIJTqDSdjgbZIhgNpBkGXwkh7X9BAwJNMngbTdMImB3l9NBeHofA4AAHgAJSmXAoHoBomgAPhDdlIDcGBSn6NohljH16p5XlR21bLKkqwQuHgAqanJLKpl0pr-ha-x415XkbktHTKianq0iCBgQ3cOoIzpBl0mZJrY3OuAHB7TAoEOKBbVwLgkkmOA-mQfZvOQcYuA8By7l5Lw4BDIaRse-z6H6LoiBSCiTo4VReG6gkYGq4EQeIMHLt0MA0QkaBJqgJJFCZDhNGvOA-rrAkAEdcGIFFXyerzgC4D4-LGd5IZR1BVw8AAWCgKGSe6AFZBYphy+UBkMAEJ0dGmAbggOIkaqmrtpJ3b9v3Q9jzh3bTgAEgQeWwZuLmRlEUpjdNsbzby7mClZURTnOsmBt6IjQbGhDkEmvzJBm4aMbtgArXMQyWlbpXoENHCIrb47ylBIkqlGarqjAo9WnZZo8b1euJmM9owOoV0zDAcwYDCzouhxKeiHscd4LgIGdB6mYG394BhtwPq4L0s2wPIcgl-7paT5BvfByHiowGGMIR1X0+BSfp6x8Fcfxn4if1+gyel55LkbG5fyPqBGzjr2Q5gbqADI77gGW15vm4fqGLZuqvES1ZZPeS7qHJGgCk8pKRrnXXQDd7pYl4C9Hs-cEQ7GCDDHsk8O5JAkN5CWfJEwThXmUIQxBUBXzytPbq9cHIoGVK4TgPAYRDX0oZZOGZHpJCtBiF6ghCBEIkI9NSDhbCCKEcIkRoi7DqHwk0OA+oboISvAidqcV9J8k4G5RRnUHS4I9oFKYMjOy+1QEVEqkctpXm0UNPRnF14TSmoHdauVkClUsQAbQALqNTkJUXWqBig6FchgPQyAwDAFWjILQxpOKqWok5PwGA7ofA8IleA4xkD4DiGCAkCsyCAlGIzJIul0zpLxvdIuzJIiuE4jAKWqRgZB0sagaep9UAYS-nyfqmVtoIQsTdBpN9I5tIcNsf4P0wREFgOSYEkiPAw1KcERIBwES4ARm06WihYQQzynPGGh0ox71actH++DZm7TkMsPJcAvxDVej0xycpJyYE2FAGEyAyRuDgGENkUAbiqWWrg5aDhARiR6HAJ0dDOiPi+q+bsmkzhAPwg4sBe8bSaQJAIDEgJkaoyoeQeSKBj68BWTUtZcJNnQ1SHCkBxFlJ7L6stTF6suHCGIW4qOfzyZvNUMkaU91LQRGyR4elwJ3iJXcBfVmWBuRuXQC89KdLf4a2LnIQ0lAmj4DZETUsXz6w-WIhBPKaq6yCFstAGAeg2TIBAN8pafyrowsyZjKy5B2ZYAmB4RlPDHpUPyQwPKbzXz3QiZEaIL0UGNF1BShFJEkV8m0YGrpdSenT36dEl0ZQKjmU8jUdmdZJ4xsyMGDAp8xwQBDKcd16BeFgqGiaOAxtA1vz8IMLY4hA2uzJoKgh3D0AhkDeQ7GW8oAExbERfhugxHjonZOqdehNDaKSc8HgljVEbAKoY4qQNuoFz6rGxNN9fb+3gEk+p-TyZxLmMgCQnzMRg3aCM9w-Qa28OKgWUCYEElAkxNiN11UPCRXgJyyA6BgDfWmbgHSFRLJdFddUoGgbGm-habShwUUezsmSKkf14JpCKgtZIVuEUjhuARkiaQZkYUSsbsicgNxBiOSSXISIjhfxgHlDWmAGIewRLaVsUjFzS4UU1T23dCtI7WrJgCjwjqsQ4gIY+LYUVATbEOJ0daCg2GxGORDaJmcWhtA6Fm2IP14C8FfGFWosJUgmdwFEKASTQpDMcCMqDmnolxRhOxkFGAQAQGUz2Ae7gkQocqKR2KMLKL3UhcproSQrNyFiJgDwznNXRV8HycIWAYB4C7cQuDN94zRKCx4NDGL5WoITlmrYUKPgX1sowvyaLYQoigy9AauA3JJA5cCEYSzWaTQJYcrFuWROxhuFiMAIYQxIGXWITdvVl3bnsGO6dy2VureMLOjpUA-gGKMRu0xeaNnXKwMuyINiA7zsXTdE7J6BoFqLXjITx2LXEAW+oLbsd4xAA)

<!---------------------------------------------------------------------------------------------------------->

## API

### `exceptionally` - core functionality

All the core functionalty to use in any project.

`import * from 'exceptionally'`

#### exposed functions

- **`success`**
- Wrap any value into a `Success` object.

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

- **`exception`**

  Wrap any value into an `Exception` object.

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

- **`isExceptionallyResult`**

  To check if any given value is a `Success` or `Exception` object.

  ```ts
  import { Exceptionally, success } from 'exceptionally'

  const result = Math.random() > 0.5 ? success(1) : 0

  if (isExceptionallyResult(result)) {
  	const data = result()
  	console.info(data) // => `1`
  } else {
  	console.info(result) // => `0`
  }
  ```

#### exposed types

- **`Success`**

  The type returned by `success()`.

  ```ts
  import { type Success, success } from 'exceptionally'

  const result: Success = success(1)
  ```

- **`Exception`**

  The type returned by `exception()`.

  ```ts
  import { type Exception, exception } from 'exceptionally'

  const result: Exception = exception(1)
  ```

- **`ExceptionallyResult`**

  Either a `Success` or a `Exception`.

  ```ts
  import { exception, type ExceptionallyResult } from 'exceptionally'

  const result: ExceptionallyResult = Math.random() > 0.5 ? success(1) : exception(0)
  ```

- **`ExtractSuccess`**

  Get the type of the `Success` object from a `ExceptionallyResult`.

  ```ts
  import { exception, type ExtractSuccess, success } from 'exceptionally'

  const result = Math.random() > 0.5 ? success(new Date()) : exception('error')

  type Data = ExtractSuccess<typeof result> // => `Success<Date>`
  ```

- **`ExtractException`**
- Get the type of the `Exception` object from a `ExceptionallyResult`.

  ```ts
  import { exception, type ExtractException, success } from 'exceptionally'

  const result = Math.random() > 0.5 ? success(new Date()) : exception('error')

  type Data = ExtractException<typeof result> // => `Exception<string>`
  ```

- **`ExtractData`**

  Get the type of the data wrapped in a `ExceptionallyResult`.

  ```ts
  import { type ExtractData, success } from 'exceptionally'

  const result = Math.random() > 0.5 ? success(new Date()) : exception('error')

  type Data = ExtractData<typeof result> // => `Date | string`
  ```

- **`ExtractSuccessData`**

  Get the type of the data wrapped in a `Success`.

  ```ts
  import { exception, type ExtractSuccessData, success } from 'exceptionally'

  const result = Math.random() > 0.5 ? success(new Date()) : exception('error')

  type Data = ExtractSuccessData<typeof result> // => `Date`
  ```

- **`ExtractExceptionData`**

  Get the type of the data wrapped in an `Exception` object.

  ```ts
  import { exception, type ExtractExceptionData, success } from 'exceptionally'

  const result = Math.random() > 0.5 ? success(new Date()) : exception('error')

  type Data = ExtractExceptionData<typeof result> // => `string`
  ```

<!---------------------------------------------------------------------------->

### `exceptionally/assert`

Useful assertion functions.

`import * from 'exceptionally/assert'`

#### exposed functions

- **`assertSuccess`**

  To really make sure that you have handled all exceptions above.

  ```ts
  import { assertSuccess, exception } from 'exceptionally'

  const doSomething = () => {
  	const result = Math.random() > 0.5 ? success(1) : exception(0)

  	// oops, some important code was commented out
  	// if (result.isException) throw new Error(result())

  	// will show a `TypeScript` error and throw a runtime error
  	assertSuccess(result)

  	return success()
  }
  ```

- **`assertException`**

  To really make sure that you are dealing with an exception.

  ```ts
  import { assertException, exception } from 'exceptionally'

  const doSomething = () => {
  	const result = Math.random() > 0.5 ? success(1) : exception(0)

  	// oops, some important code was commented out
  	// if (result.isSuccess) return result()

  	// will show a `TypeScript` error and throw a runtime error
  	assertException(result)

  	throw new Error(result())
  }
  ```

<!---------------------------------------------------------------------------------------------------------->

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

<!---------------------------------------------------------------------------------------------------------->

## Glossary

### error

It is not possible to recover from an error.

e.g. a `OutOfMemoryError` will hinder your application to execute it's code and therefore you can probably do little to nothing against it. The result will probably lead to an exit of the application.

### exception

Exceptions are caused by the code of the application itself. The application knows this case could occur and can recover from it.

e.g. a `ValidationException` will not store the data in your database, but will also not crash your application.
