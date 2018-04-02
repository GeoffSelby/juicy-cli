# Juicy CLI

Command line based e-liquid recipe calculator

## Installation

### npm

```bash
npm install -g juicy-cli
```

## Usage

### Add a new recipe

```bash
juicy add <RecipeName>
```

### Calulate a recipe

```bash
juicy make <RecipeName> --size <size-in-ml> --strength <nic-strength-in-mg> --pg <pg-percentage>
```

### Delete a recipe

```bash
juicy delete <RecipeName>
```

## TODO

- Settings for nicotine base
- Set component base in `add` command

## License

Juicy CLI is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).