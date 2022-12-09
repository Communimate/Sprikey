# Developing

## Building
This project uses the TypeScript compiler `tsc` to do all the compilation. This repository is set up to work with version `>=4.4` of the compiler.

There are **two** compilation strategies available:

- **Direct compilation** using `build`: Compile project without sourcemap generation.
- **Development mode** using `build:watch`: Watch project and compile on file change. Generates sourcemaps.

The use of `swc` for transpilation may be considered soon.

## Styling and Linting
This project uses ESLint to handle both the linting as well as styling of the code. To run the linter, use the following command:

```bash
pnpm run lint:fix
```

Some linting rules depend on the TypeScript compiler to enable type aware linting. Failure in compilation will fail the linting.

## Testing
There aren't any methods of testing the project as of now.

## Generating Documentation
This repository is not configured to function as a library. Any documentation generated serves as a reference for contribution.

## Deploying
There aren't any methods of deploying the project as of now.

