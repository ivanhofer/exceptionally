# :shield: exceptionally

**A fully type-safe and lightweight way of using exceptions instead of throwing errors**

:safety_vest: fully typesafe\
:baby_chick: lightweight core library (132 bytes)\
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
- [Basics](#basics)
- [Examples](#examples)
- [API](#api)
- [Best Practices](#best-practices)
- [Comparisons](#comparisons)
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

> You should also set everything to [`strict` mode](https://www.typescriptlang.org/tsconfig#strict) in your `tsconfig.json` to get the most out of this package.

## Basics

```ts
import { success, exception } from 'exceptionally'

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
  console.error(result().toUppercase()) => 'PLEASE TRY AGAIN'
  return
}

// because we have handled the exception above, we are left with the `success` object
// unwrap it and it will be typed as a `number`
console.info(result().toPrecision(2)) // => e.g. '0.57'
```

<!---------------------------------------------------------------------------------------------------------->

## Examples

- [input validation](https://www.typescriptlang.org/play?noUncheckedIndexedAccess=true&noUnusedLocals=true&noUnusedParameters=true&target=99&jsx=0&useUnknownInCatchVariables=true&noImplicitOverride=true&noFallthroughCasesInSwitch=true&exactOptionalPropertyTypes=true&pretty=true#code/JYWwDg9gTgLgBAbzgUwB4GNlhsCA7AGjgGcBXdTY4uAXzgDMoIQ4ByNTbXPAQwBs+AT1YAoEQHpxcALSy58hYqXKVqteo2a1Y9PmLwAbv2AATHjGRwAvHAA8AEXM8AfAAozMHgC44jz0SM+U3NoH3cnHz8eAEprZzgYKFJLAB8SROA8AHNYq3iEEQBIXTx9OGBiAHkAa2s4QOCYaHDPaKLgejhXCprrKxtE5NioZBhSKDwSckpiFpixQpGxiZQMLBx8bqrqtpoxSRktI+OT07PVMRhBMEsABQgymwLCnlIYAAtQ9KhMrKKcGB8ZA+fQ-bJFEoWPAwEEZcF7EQlMqQfQANWMHmgdVcKJhcHu+ly+SKByW40mIGQPDwv3opD4KCgTCgcEpVB4WWQ1AA7u9kJNiMxRu9fuVqJkGiZ2p1XABCXEAOleH2gw1G5LYACJlZ8oJrWRViL9RNKuvKHjAFQCgWrlpNWJrrch9SBDcbTTiLVbgIDkAqgdkPnB4gBGABMAAZbRqHU6XaQygAjSzEXUWFkfalwcMRuDod48KA8dDp4gmwodM2KyH8mDRlYOmvQl1u7KiCsyxVO-38rJB2xwACsEajcDJDc1TZg8bKkJ4mTg5jgQJ4ZWHufzheLpfLpPVKwABoNkAe4Lz+fUMeZuHAwKviFyiuPJseRAikfBiDwDMgCfAbKugh4OgXS4j4f5EogEJ6IYV4bHgABKXL0v+l5BB4yCevoRC4ui6EhFAbQdl0krXvgSFkHwloVAAomsXD4PWkykfBFEoXABx3lQDDQNyhYmKsnDwQsBxfgYoofJYHg8GefLMXBN4FtQXEPlKxQweUAk2CGHFSDwfE+iQ36-haAAqEBRImq6YbibRPvuArTFysymLs+xSOcnled5PnSGIaCQLAeYaUkkwAcQQEga4kHPB+Rk-n+bFUXU+nzp+xl-q4zwvG8uo+KwABSEDvJM9gQMgrAEEUhROvlNFMliBZ4CYQTZCQnz0gJyYoKuwDIFAlXVVO+UADLQMgLDAGAZAsCYEB8NARBGvAPCUvASLICW+6LiYU0VMA6CisgQSWnAACCa1EAAjqQwAKoNhQ0HZxGuGJJn6El1HEHRQncLEHxMNycB4MgQP1cyr0ZRan3Rc9SLzX6mT0BArgHiDQO4vFyAmD4AAkCBvYlyFUdFNAHm5IihdFIhAA)
- [fetching data](https://www.typescriptlang.org/play?target=99&moduleResolution=99&module=100&noUncheckedIndexedAccess=true&noUnusedLocals=true&noUnusedParameters=true&jsx=0&useUnknownInCatchVariables=true&noImplicitOverride=true&noFallthroughCasesInSwitch=true&exactOptionalPropertyTypes=true&pretty=true#code/JYWwDg9gTgLgBAbzgUwB4GNlhsCA7AGjgGcBXdTY4o4YgUQyx3wEMAbNgTwCVky34AXzgAzKBBBwA5GkzZcedlykAoUJFiI4LKslgBlcpWJxhYidNlMFSzgHodxPTFUqYnMMjgApYvjgAvD5+eACCUFAsnHAAPsH4APIARgBWyOjwcb74AApQoMA4AG7IKm4eXtlhEVGB8XgA2gC6Ze6e9clpGXUIKgCQDQDScMB4JDD5eADmTQD8AFz1KoKtFfV5BcVeQUkQEGzILGNxeKQcsXCnIEl6F8QTo1NldnZwALQfn1-fP79--wDAUDgSDAc9XgATZAiUZeCHAEQiPTIPDwBhyZhjdBsRx8UTQbTnADWowhcAgIhQjHk+GIKhecAAcgkACp0RZ+EDIAAWEAA7nAWRV9Oh8tg4OgjlJ4PD7o9SLRuXAbjA+cgUXB4Yjkai4ABhHG6EwwbksGV6YAlUTiSQAAzoEWgtoAdPTXnAPZ7QiYWHA+dAiSxxKQ8GS1RKjiRkPBfWBxJ5YNFRsRgFC4CazRLDcaIHAQCwiV5RkioCjMH6A9opixRq7sY4mdH-VAiejrP40DAURCTA7xFBEP0GQABGDEN7AKZ4aBeE1eHI4zhTYOhzUQPHT+AJlP3dPcry26cAVVOTghABkIJK2MRbRL8DCnn1SywIfguHAAMSpur6TjXfYAAopEZJsAzbGk8CkABKZYVHrKg4AAEXSCAoSqCDMSpLtQ17R0B16PoRzHCcpxnPd50XZcIBDMk3w3CAtz0Hd4DnOBDwgE9SDPS9r1ve88EffoXzfPAP2-Mkgj-AC2GAlD0DQ5AMOpTEYLghCTAACRgGAwEwhRsO7PD+0HIjXlHcdJ2nUsKLgBcomo2i1wYpioBY2yOK4nir3YfiFMEydhMOUTxJ-KT-12WSpG03T9PwNSVg0uA6HAdwkLNHRozisZOyM5L8NM4jLLImy2PspcVzo9cTE3OBt1oVj93Y49T2QC8fJvO9-KE59gvfaIJN-CKgKkFLsE4dKYEymBsoS8E-X3MYkRgdBuUeTUMqIX0kQFE1HhMSUxlNMBPDwZ1nQWjVOWjNbplEGsbxoeBaDgKY9jJGBcyJacBT5U14FNY18imKZkQ+praDIUp-N3ZbVsm30gh0Tg8HQOAAB5eBgUgoDwIV2ly3D6gAPkA7tIFGGAOQeaZoMCYnTJh+A4e5Xh+HgJG+RrZno1WsnQwp1FYL6PpnUlFbuTJ+mqQxBRALwZABVA1VwJUuXkGgzW4AZNinCgEoBwUs4yRuOAQxYIoHpYJIDjgc7XT6BE4EA2hstsNmzhgQCWY9gQtdLbHcdEXnWb4T3tdeMAGxEaAuagMkrEgsozLt87bNLABHUg+HgI22DJEQHr9QolV9e4zW4hS0wAFlQVByQHABWOvU4dp3AIAQh9sOBGdCAiTpgOcZytX8HlxW4BivTR7wQDbQAEgQbv2edcvseIQRFkX5fPdXqb15ZTtBFtTXk6Zjapt9jntC5wpg4lq-nRSEJAOF0W51niEMulr+pu0EwsbD3xhrfootxZ822AzROmJx4CnkopZSssx4ay1gye2DdbJR04GwCAr57zGwEu5CkIw8CWzYD+bw+gEiMlbv0dursZ7ux7l7X+LAr7+2jMPC+bDmERzqtHWOQYE4z2Tu3cIkRODOloOIqIgFWHsLgAAMkUXADu8jmHOgONME0dNCK9UDiPJBs8FYCjGmlDKTgZoz1fnTNBacCT5k4KbNiZDUxmgMsQtirD8H53usANgqd+grCCgYkgRg+DEDkRlBRdiLpHALqMWw99VrrW8XnMkvlcymzIBQCJIgzhwTdO8UEJTSllPKRUgEqx2hHj1j0OhEJqaTCfIoLkTTHiFPPqDGAtTmJ1GRqjZ2dMAgM0IufFmvS3JX36bfHmEsEbo0mc0UmUhuQ6TAMQeYLxrpvBYGAYAYsJB2G4sxNSQ5Xh-RRMgA2fovDdOVCwdARJtBwFLOzIg4ZiC8gIatdIzyY4DmgQoEwMI3IwDoZSb2IdJnEEfgwoxujQHn1kHUCZetYXMNfqAhkppQy219JgWANYxhtC8MQoF-hSSWlTKQWwoD24ouTFNVGyBiHK2bK2GeiKRb6K4RS2eUg9Q0V8bVFmZt0UXQXIcJw6YoDRBYNWUYcAcRdigM6NSItgkiwZOGUS0pXmHA4NESUNlrY0UageMxE0LFZRnnefcpYiB+FuQa0JkZkCpXlTUTg9LIWMrwOXFlxCrUI0sdlblIsh5BxycYQCzQ35apTkqpQ5I5yG0ytQF1Uaxi+lBgrSIAS9AmS5FQBVpRI2cKDvy4CJ40CeAyG1FA+FJUHEygJKa3RdakBOtAGAbwuwsBAOq4WWqdZNTeeHQ6KAS63GyeEqg+SAnxPbcS8kONxV9IJKbTxax7SetDbaoxtp+jnxOW5VF0L0VXyxectcJAJA3XWnyEutlWEntpPsZAUjBIQDnjGvJZwPws0bYvM9xBNEoimCaYQYGT7J2zWE3JVBAJgdsZHARUA450QyoUhklT8MEcI0Rt4ZQunRlCBwSZrS8RI2ICjNGr9pZjNpPAMD0zObc1etGGFWKU7XI1CwEQqq8ye2AGAW2Ct7iNvyajLC14bwuqnfmQsYSbJ-UzCmyAVBgA2zJaQFaD6DqRhuBC52bGNHwvbHgCNDJMxsW7OSSkNEBxxggMuQdogcG-S8DCRQRq9ziF2k1ItBIMzwC-VMC63SpAmFlOJqIjbPq2TPaAk0gXLgTz7NAFDV7MWnz6KOi5XglMFi8GQUq-0XWmitOA7kMgMnnH5XSFOwCRRingM+84Bx4CcBonAb6-IRiUl66QfEUB7lJdxRCfFhirO3omNEJLpYQAQCtGxchCs9x2e5IF40TUssDjNVaZdI2pDnCcF4d1BUHXltxAYedkTzPs1gre7bXgHPhgQ147+z6TTmr9JEE661ChOtzHfKdpsYakC5GSZNYxuK0oCVzH1vKg5Pc9q-Z0+YwCAUAkgajphhkM2o7BYJeHiMU8p1T74pGWOvJDP0ujgzGMjMZnTs91GTAcbvt0ijbAqODr4LxmGn7v0xxy3oTnpOyhQBDFioAA)

<!---------------------------------------------------------------------------------------------------------->

## API

### `exceptionally` - core functionality

All the core functionality to use in any project.

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

### `exceptionally/utils`

Utility functions that wrap common use cases.

`import * from 'exceptionally/utils'`

#### exposed functions

- **`tryCatch`**

  A replacement for `try-catch` and `Promise.catch()`.
  Per default it will log the error to the console.

  ```ts
  import { exception } from 'exceptionally'
  import { tryCatch } from 'exceptionally/utils'

  // You usually don't have control over external code. It might throw an exception.
  const externalApi = {
  	fetchProjects: () => {
  		if (Math.random() < 0.1) {
  			throw new Error('something went wrong')
  		}

  		return [1, 2, 3]
  	},
  }

  // basic usage
  const doSomething = () => {
  	// Therefore you can to wrap it in a `tryCatch` to handle the exception.
  	const result = tryCatch(() => externalApi.fetchProjects())
  	if (result.isException) {
  		return []
  	}

  	return result
  }

  // with exception callback
  const doSomething = () => {
  	// Therefore you can to wrap it in a `tryCatch` to handle the exception.
  	const result = tryCatch(
  		() => externalApi.fetchProjects(),
  		(error: unknown) => {
  			if (error instanceof Error) {
  				return exception(error.message)
  			}

  			return exception('Some unexpected error occurred')
  		},
  	)
  	if (result.isException) {
  		return []
  	}

  	return result
  }

  // custom logger
  const doSomething = () => {
  	// Therefore you can to wrap it in a `tryCatch` to handle the exception.
  	const result = tryCatch(
  		() => externalApi.fetchProjects(),
  		undefined, // <- the optional exception callback
  		{ error: Sentry.captureException }, // will log the error to Sentry
  	)
  	if (result.isException) {
  		return []
  	}

  	return result
  }
  ```

  - **`processInParallel`**

  Processes and unwraps multiple functions in parallel.\
  The result is a `Success` if all functions were successful.\
  If one of the functions returns an `Exception`, the full result will be an `Exception`.

  ```ts
  import { exception, success } from 'exceptionally'
  import { processInParallel } from 'exceptionally/utils'

  const loadUserDetails = async (): Promise<User> => {
  	const user = await db.getUser()
  	if (!user) return exception('Could not find user')

  	return success(user)
  }

  const loadProjects = async (): Promise<Project[]> => {
  	return success([])
  }

  const result = await processInParallel(
  	[
  		loadUserDetails(),
  		loadProjects(),
  	] as const,
  ) // make sure to put `as const` to get proper type-safety

  if (result.isException) {
  	const [loadUserError, loadProjectError] = result() // => `[string | undefined, unknown]`
  } else {
  	const [user, projects] = result() // => `[User, Project[]]`
  }
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

- **`assertSuccessAndUnwrap`**

  Useful for testing your application.\
  _Will **not** show a TypeScript error like `assertSuccess` when passing an `exception` object_

  ```ts
  import { expectException } from 'exceptionally/assert'
  import { describe, expect, it } from 'vitest' // or `jest` or other testing libraries

  describe('login', () => {
  	it('should return `true` if credentials are correct', async () => {
  		expect(await assertSuccessAndUnwrap(login('username', 'password')))
  			.toBe(true)
  	})
  })
  ```

- **`assertExceptionAndUnwrap`**

  Useful for testing your application.\
  _Will **not** show a TypeScript error like `assertException` when passing a `success` object_

  ```ts
  import { expectException } from 'exceptionally/assert'
  import { describe, expect, it } from 'vitest' // or `jest` or other testing libraries

  describe('login', () => {
  	it('should handle invalid input', async () => {
  		expect(await assertExceptionAndUnwrap(login('admin', 'invalid-password')))
  			.toBeInstanceOf({ message: "Credentials don't match any user in this system" })
  	})
  })
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

## Comparisons

There exist similar approaches how to best handle errors and exceptions in applications. Here is a comparison between the approach `exceptionally` uses and other techniques.

- exceptionally: [examples](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgZQK4GN0FMDOOA0cAogB7ZgzAQB2cAvnAGZQQhwDkWZWFV1AhgBtBAT3YAocTBFgscAKo4sUOAF5EcYABMAXHBwwowagHNCAkFj0GjpwvxNW41VCABGy+pOmy4AJSwYVChqHAAeABF+GH5CIigoAD41FAxsPEjo-mSAH2JuXhow+KTJAHoy-X5wQTkINwArLHR4AHdgGAALCFR4fhbUIU0arEtqGMoacXQaAzgtNz0EcQBIRxhFZT0ACm09F3dlAEo1ZICgkPDNqDiE6ETV9euAIREAOWqnbYsnG2MTE6qM6BYKhMLXW4sFR5VDULRYRjGLBaB4rdBQLDRLDXHaoJRQPQAeRAHXB+MI7G07ESgOBFzBEOId1KaJ642uOB2tP8IMuYQOHhuTKhDwY6hcwjg-BwUuoIkk4gqcC41TAtTgAEZFZVWnJ+BjnBB4BihKJldRGNBsFo4DAIHB0J1mgBrTSMWXK5lwCCYYLI6azeB45QBHCoQTwdQLAB0T3x2w1RwDoXgWiyzwR0CwAGEnehXepg1BQ+GYNsTkqgXAAAbXOB5ErQaviYDu7ZFksR6PAHCkciTagnLosVrC6DbdgQCBgHDsJNK6gQUcdTQynD8RhyO1SzC4GVgFiyWDAXDe2hdOTVju4UvV72NZowZNzNMxACCjBgylzLpS17DEblnAlbJLW+LNv+pbltGDhYAqSoqiMcAAEzPkG+LZmyMCdpG8xuNGMywhs+I4OWLZtkWmFETh3a9gUA5Dp0I5jlAE5TjOc7ATqeoGkIOD2uuABucitraTpMLCLR8HAGL0jK1YAAzNuUlSIWqcgAMxoXARbIThKQxnGyjbAp0YAKxJqJ7b4npN5dj2fY8AxiCrEqWgQKeF46fihrwFwPbwB46D8MGYkiTa7mnou8AgNEjqyiI3meNAcBBSFShwLqcBgNKSg2vwmUsKYUpQCYrhYOMAD8qwzKEEC1NGyhQtZyi2QBZZHBW3FwJ0-DCTu6QytuXmNio7RdD08DUFgyL-LaAl2gaK7SlKcCCfqwD8G46qIlABirMOS4sWx06zkmdAqcqJCquqAAs2lFrd+lRvhRmsbdlkUfiT12TAtGOYUg5icxo0nRxSa1fxDXGJaLVQD97XlkmD34gA7M9eGxoE1zbKjn1wHD6O-f99F8IxIPMmDZ3PvVWDdhaECEzhSOSJD6HKAAHBjhnY-GHP43DXPEw5pM0OTR2g5Op1zjT0MM4LzOddqmVyO51DsPAvX9duJjAP1mLxdWYa7ngd78HCNZcP2fBm84nzRnAb76P86rrUYW07SlbhGp0q7mj0JidNG8GqddSFmeItTswSCj4ijyikAFOBvoIJpaCI3OvbzyivB8lgTgAUhAnTqwLRaJwYyep5i6c0SL1tixoSorj2UqCK0-AiDK6C1PqbqaPArcFUbaR7mbFu1TExjzFk3oqOblui9Q482tFDo0FPtCvvwNWBg6JpftcmcEQf2LxkgPx6OwRcl+w9iOHoGm3fQSYrFZ6KYof+J13RDdA4do5JbsWpqsIsKQP5YiPr9MiDAsCCAyssFYYDCz4grjAKuacM7QPOqzWYtN6awyLN2LQRwgA)
- return a `[data,error] tuple`: [examples](https://www.typescriptlang.org/play?#code/C4TwDgpgBAqgzhATlAvFA3lAlgEwFxRzCJYB2A5gDRSkCGAthAUSRdbeUzQK70BGSKAF8AUCNCQoAJQjBuiUnAA8AEVrBa1AKKJEAPlRQA2mo3VupHBABmZCDgC6UAD7GLV26XvbdDsQHp-QgYwABtoAHs+ACsIAGNgKAB3LGAACwjuRNoE7lpQ7HowiEZSDWAsCNIROKqiKBw+AnQRAEhOYHgkAgAKXAJSXgFEAEpUAxk5BWUuxB9ECP02jtmAIRAAOQYuHrpGZmIycjGUCdl5RSVZ+cWXKHcbOxw9NrjECHUIWd7uBEQCADy9FSVz+1AA5LhwXoTmcppdrlAdAslq1ahZOn84L1YdJztMlIN+EgbkshIZBqECrQ4FBaKQQGIRIEoBAAB4hcJQACMzKCSWgtHeNAiiXe+VCIFZpGsizi9igwAiUDiaXiAGtsNY6aRWbpbhE4nF5PYanVEkZfkgnGhGgA6FZ-HrckZmxSJHDqWirGyLCAAYTVcU1aCtyBZpygAANZncHp57FGRFhtT0AIRhsbpBZJJH6xA9cERCJgODg10s0gRXOpbC0uC0azQJV0o0QOC0sALSCICrtqBVRVq6NhqMDmLxYBu+qejQAQWswCQgY1hjDUAjBhjfyTYbtHAgTJZ7M50AATNOLWH-ZkyjaGnw7eiyrM4D1XSmoOnr7fgFm0jmeYooWxaluWG5BHwWTJGk6hakO0DWBYCSVLq7zwrSAAMAD8fLJNASSZKEOB0qESS0CAtJeAqLaqqutahFg6rNmkWBwMmqY-hiqAoKGliPF4OD-oByKLCBJZlq6ARBCeRRcgAzJebh-Ge972o6SA9JhdoAKwfpxKk8XxHhPGMLStCyOARP26TQOuVaJOybGJAIcS0FaCHYCRVn9g5UD0Ooqo6lK663K57kIPhUBgDSCAkbQyQLBQdKIOQvAQGUuFonUEThHaSDAeCcARIw6RHFAsFgJAgngSyKTpJk2RkRR9a0AAbuVtl6ii1ACskVTgmKHxUlK6pVkkbTZtWQFiUWEnliIojSayHJydAAAsSmWn863UAVizcmpj4aQW636V++2IC6Q4ifm4lga6tSKLlEB2mQso9GGZ1iE99TbUgADse35qphjqbIsw9AD509JdZ7CdNokFnND3Ti9b0yhEn1-NDP3mspSAABzAyi8lHQ6ENOoTMOXfJCO5kj92SWjeXvVjYbU3hfWwW1zbKuQWC86yORpN1twJXsEC9axQV8KEETqLS3BgAO8gqhEVg6iRAXMbSDHtrS4qenLh7LbJxRQDpIjhIkvz-LAfwQVF+RG1KPPQFYcShEKCoJVGo5QG1Qq0FgJt0nwES89QxVRe7irKqqxaRfSopqsgktbU5RBHIiWc538SPkyd6xbIwhYAFIRGkpALSyacEQRWBUtFCx8LQctShlJHK8kqSi1Glr8QmODmEPTwOGO4UeV164+VRoorc5UBQYkXUAI7cEgjJ1TShDcG2HZIc39LedZ89DfCOrRkjUZ2lAAAqrF67S9KsjgnAALRuZF6RwREi4ZQaANRIHR1aKFwEgewdoOJfjTFnCoFBZhmSdn1NyNdEh0WDFAWUyAox50QQXfMY567UEYsxKKhFuDEXuHAPII0gGvHxkYN4Hwlw4ERCwz4sxC5g0fJwpckNMCSwIOCSu1dwTsE4AQeS61hCulaJ+Ho-CviEJRPTGayNQLMzaHbQwyj2F-EWqyUIkVzK6LQPA-OSBFp42eqzTG2NEBvSEkyPCGxRRcBAJkdWVD4rNUojQ6AUZ3i0NCMAfKRDsDug+CRf+DR2zEH3lMTqw4QlUOANQFsoCSCxO1F1IOJB27hDwnscqbFaHtmoCvbAiQ2IikcpjRA8p4qWCgF47gLcohFKlCkY+-ilaRSsCwJJ8gynRNoCPZe8QIosXUEVRsh4WRdXIlKegER6jmy5L0gocAMg1inCIIAA)
- return an `{data,error} object`: [examples](https://www.typescriptlang.org/play?#code/C4TwDgpgBAqgzhATlAvFA3lAlgEwFxRzCJYB2A5gDRSkCGAthAUSRdbeUzQK70BGSKAF8AUCNCQoAJQjBuiUnAA8AEVrBa1AKKJEAPlQYoOdbQJqN1JIgD2iAt1I4IAMzIQcwqAB8jJjQ5Oru44Vrp2BDrIoiIA9LGEDGAANtA2fABWEADGwFAA7ljAABY23Hm0udy0ydj0KRCMpBrAWDakItntRMZ8BOgiAJCcwPBIBAAUuASkvAKIAJSoBjJyCspjiNrh+kMjmwBCIAByDFwTdIzMxGTkSygrsvKKSpvbtsi+js5upB56Q2yiAg6ggm0m3AQ9igAHl6EVXlDqAByXDIvT3R5rF5vKBROwAwZdRyjKFwSaY6RPdZKWb8JDvAkiISGWbJWq0OBQWikEBiOIJCAADySqSgAEYBQVoLRgTQbHlgTVkiAoBBSC47NkPFBgDYoNlijkANbYFzc0hqnZQGzZbLyDydbp5TD+MxQSGCFloHB8AB0+yhE3FCydijyboOrjsEAAwkbsqa0J7kPFllAAAabHweoK-DwZkRYc0TACEKaWJVs+TxOwmyJsNjAcGRobTpBsNaK2C5cFoLmgeu5dogcC5YFskEQrVHNstJWgGZTGZtmRywDDPTdAEEXMAkPGTYYU1A0w9M5tCym-RwIPy08LRdAAEybl3GUwOKGxsrNLw+-1iWaTY4AmUNiygMsUx-ElK2Kataw+etG2bVtTwSPhygKYp1DNXUjSgFxHFyNpLWBbEuQABgAfilfJoHyMpkk8Gp8loEAuT+HUh0NI9u2SLBjUHYosDgIsS2g388hQGTcx+EI4IQ-FEGQpsW1DMQHxFeoxQAZjfPxPw9KFn3-XoA1kTYJkov0AFZwIkkzUFk75gj+HAlgGQY0xwGxZwXYzBA7PJhVEvIBGyWhPXw6BcGMPzOIVKB6HUQ0LVVE87CgCKooQaUoDATkEBYgpbAoblEHIXh1WAWiiW6GxUj9aw7HrOAbEYEpbigHCwEgdy0LTQoSjKCpkjYjiDQTY1uoClqtnyxjSGRRUQXZVVjQ7fIhirTtENahs1NbZl70FbSGigAAWAzXSMlNLrCD4CHm8UzN9CzSSQCZLocyCXsUvblNU1DQy6RRGogP0yE1CZ7o0sGelugJAsQAB2R6IitD5TO9czAy+1HfomebnwBmsgcOkHNwhqGNRsWGoUJsQEffN0vyQAAODHoXm3S3v9fGVI5onebJ-aVMp9Tqaa6H6ZTYWpRAMoetoAA3Qd9XILB1bVSpiixrLaBoM5qHyES0r4ZIbHULluDAKAlfkA0bGcC1PBSoSuX40cuSVExLbvTSzqfKBbJEVI8khaFsyGmVkj91UcJ15xsmSWUdSNpcoRXVXZVoLAA+5PgbHV6h2vypONamxs8p5BUjWQS47xZwzkdCohblxebnqFUTO6hZT+Y+w4TjOesACkbGKZa2wSBuGIYrB2QK2w+FoS3VXVTw7YKIp9YzABtVz81COS3I8ABdFccuigKT182dgrVXuekwvIAoAR24JA+SGzlCG4COMcRFl48k8A-RKq1sQWkzMpDMfooAABURJey5DyNUOBOAAFpIp5RKLhGwe51TxWWnkEYztFC4CQB4P04lIKlnbq0CgmxPLoXypFUhU0jyamQBmdu-ckBwJ6tQ6gAkhKLSYtvOA1R1rxUBM6Vu7ogQgn3DgLuOwCDKNBJsQeuN3paP3FZTATcCDIkntPZE7BOAEF0pdYQoZBgQQmAYsEA8dhiwpihKWQwo6GBcWoqEzI1TJDyl5XxaBGECMQCdaWkNZYM0QFDDy-IpTHAVFwR2ztuDMW5ONdits8oZmBNI5IwBmo7BXGQIgIJPCEOMKOYggC1izQIsU7JwBqBDnISQWp5oAq5xIOvVIUpLjdVEtI0c1A37YDyKJeUIU6aIG1CxJwDtlYTnSEM1UhRQF5MmtFZwLAmnyDGeGGpUyci5WEuoZEfYBxSgChNZKNgeiPh0ovZecBShdg3EAA)

|                                                                                     | `exceptionally` | `[data,error] tuple` | `{data,error} object` |
| ----------------------------------------------------------------------------------- | --------------- | -------------------- | --------------------- |
| prevent try-catch blocks (example 1)                                                | ✅               | ✅                    | ✅                     |
| can be typesafe (example 1)                                                         | ✅               | ✅                    | ✅                     |
| obvious how to handle falsy return values (example 2)                               | ✅               | ❌                    | ❌                     |
| can access error object without needing to store it as a variable first (example 3) | ✅               | ❌                    | ❌                     |
| does not require you to come up with new two variable names per result (example 4)  | ✅               | ❌                    | ❌                     |
| obvious how to handle no data and no error return values (example 5)                | ✅               | ❌                    | ❌                     |

> Do you have other examples? Please open a PR and add them to the table.

<!---------------------------------------------------------------------------------------------------------->

## Glossary

### error

It is not possible to recover from an error.

e.g. a `OutOfMemoryError` will hinder your application to execute it's code and therefore you can probably do little to nothing against it. The result will probably lead to an exit of the application.

### exception

Exceptions are caused by the code of the application itself. The application knows this case could occur and can recover from it.

e.g. a `ValidationException` will not store the data in your database, but will also not crash your application.
