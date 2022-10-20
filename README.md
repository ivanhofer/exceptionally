# :shield:	exceptionally

**A fully type-safe and lightweight way of using exceptions instead of throwing errors**

:safety_vest: fully typesafe\
:feather: lightweight (205 bytes)\
:running: almost no runtime overhead\
:ok_hand: easy to use syntax\
:handshake: works everywhere (browser, node, cjs, esm)\
:warning: can warn you about unhandled exceptions

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

> TODO

<!-- ---------------------------------------------------------------------------------------------------- -->

## Usage

> TODO

```ts
```

<!-- ---------------------------------------------------------------------------------------------------- -->

## Best Practices

> TODO

- create wrapper functions for calls to other services
- just throw errors at the application boundaries
- internally don't throw anything
- document what kind of errors your application could throw and use a unique class (or error code) per error

<!-- ---------------------------------------------------------------------------------------------------- -->

## Glossary

### error

It is not possible to recover from an error.

e.g. a `OutOfMemoryError` will hinder your application to execute it's code and therefore you can probably do little to nothing against it. The result will probably lead to an exit of the application.

### exception

Exceptions are caused by the code of the application itself. The application knows this case could occur and can recover from it.

e.g. a `ValidationException` will not store the data in your database, but will also not crash your application.
