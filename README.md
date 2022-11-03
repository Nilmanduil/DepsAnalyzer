# DepsAnalyzer

A Node.js CLI to list dependencies and fetch informations from NPM registry

## Features

- List dependencies in package.json
- List installed dependencies in lockfile
- Check latest version of dependencies
- Check NPM audit for security purposes
- Output to JSON (to use with custom scripts or CI, for instance) or CSV (for easy copy/paste in spreadsheets) format

## Requirements

To use DepsAnalyzer, you need Node.js >= 16.0.0

Also make sure the projects you want to analyze have a package.json and dependencies installed before using DepsAnalyzer

## Installation

### Global installation

With NPM :

```bash
  npm install -g deps-analyzer
```

With Yarn :

```bash
  yarn add -g deps-analyzer
```

With Yarn :

```bash
  pnpm add -g deps-analyzer
```

### Local installation

```bash
  npm install --save-dev deps-analyzer
```

With Yarn :

```bash
  yarn add -D deps-analyzer
```

With Yarn :

```bash
  pnpm add -D deps-analyzer
```

## Demo

TODO

## Usage/Examples

Inside any Node.js project with dependencies installed :

```bash
deps-analyzer
```

It will perform the analysis in the current directory by default and output the result in JSON format to the standard console output.

If you want help on how to use DepsAnalyzer, just type :

```bash
deps-analyzer --help
```

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to get started.

Please adhere to this project's [code of conduct](CODE_OF_CONDUCT.md).

## License

[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

## Roadmap

- [x] List dependencies in package.json
- [x] List installed dependencies
- [ ] Check latest version of dependencies
- [ ] Check NPM audit for security purposes
- [ ] Output to JSON (to use with custom scripts or CI, for instance) or CSV (for easy copy/paste in spreadsheets) format
- [x] Output to a file
- [ ] Check packages if the project is a monorepo
- [ ] Automatic packager detection
- [ ] TypeScript definitions

## Running Tests

To run tests, run the following command

```bash
  npm run test
```
