# exceptionally

## 2.3.1

### Patch Changes

- ea108f9: add comparison table

## 2.3.0

### Minor Changes

- a977293: add `processInParallel` utility function

## 2.2.0

### Minor Changes

- c7088bc: add `assertSuccessAndUnwrap` and `assertExceptionAndUnwrap` functions

## 2.1.0

### Minor Changes

- 1cfaa10: add `tryCatch` utility function

## 2.0.0

### Major Changes

- 9393163: rename `Extract*` types

  take a look at the exported types in the README

- 9393163: get rid of Exceptionally as a class since it can't cover all use cases in a typesafe way

  use `isExceptionallyResult` instead

- 9393163: export assertions under `/assert` subfolder

  import `assertSuccess` and `assertException` from `'exceptionally/assert'`

### Minor Changes

- 9393163: allow to use multiple versions and instances of `exceptionally` in a project

## 1.4.0

### Minor Changes

- 11b9e69: improve bundle size

## 1.3.2

### Patch Changes

- ddcef81: make Types resolve to a more readable name

## 1.3.1

### Patch Changes

- b987413: update Types to reflect nested Success and Exception types

## 1.3.0

### Minor Changes

- e9185b4: allow instances of `Exceptionally` to be wrapped without loosing it's type

## 1.2.0

### Minor Changes

- 3d335ba: add utilities to extract types

## 1.1.0

### Minor Changes

- b31c51a: allow not to pass data

## 1.0.0

### Major Changes

- 83aa448: write documentation and add examples

## 0.2.0

### Minor Changes

- 85b512c: fix package exports

## 0.1.1

### Patch Changes

- fee154b: minor fix

## 0.1.0

### Minor Changes

- 6e41f9f: implement basics
