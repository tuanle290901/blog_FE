## This project use node version 18.16.0

## Commit conventional
- Commit message base on format:
```bash
$ git commit -m "type(scope?): subject"
```
- scope is optional
- subject content of commit
- type above could be:
  - build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  - ci: Changes to our CI configuration files and scripts (example scopes: Gitlab CI, Circle, BrowserStack, SauceLabs)
  - chore: add something without touching production code (Eg: update npm dependencies)
  - docs: Documentation only changes
  - feat: A new feature
  - fix: A bug fix
  - perf: A code change that improves performance
  - refactor: A code change that neither fixes a bug nor adds a feature
  - revert: Reverts a previous commit
  - style: Changes that do not affect the meaning of the code (Eg: adding white-space, formatting, missing semi-colons, etc)
  - test: Adding missing tests or correcting existing tests

```bash
# example valid commit message :
$ git commit -m "ci: update gitlab ci cd"
```
## Installation

```bash
$ npm install
```

## Running app
```bash
# Development
$ npm run dev

# Build
$ npm run build
```


## Linting and Formatting
```bash
# linting code
$ npm run lint

#linting code and auto fix
$ npm run lint:fix

```
