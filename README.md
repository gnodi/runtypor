# runtypor
Battle-tested runtime type checker for Typescript using JSON Schema type guards.

[![Build][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Version][version-image]][version-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]

## Summary
- [Installation](#installation)
- [Use](#use)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation
All you have to do is installing the package:
```sh
$ npm i runtypor
```

## Use
Here is a simple example of request input validation with Express:
```ts
import express from 'express';
import { createRuntype } from '../src/index';

type Car = {
  brand: string;
  model: string;
  manufacturedAt: string;
  color: string;
  price: number;
}

const validationSchema = {
  type: 'object',
  properties: {
    brand: { type: 'string' },
    model: { type: 'string' },
    manufacturedAt: { type: 'string', format: 'date-time' },
    color: { type: 'string', default: 'green' },
    price: { type: 'number' },
  },
  required: ['brand', 'model'],
};

const carRuntype = createRuntype<Car>(validationSchema);

app.post('/car-purchase', (req: express.Request, res: express.Response): void => {
  const car = req.body;

  if (!carRuntype.match(car)) {
    res.status(400).send(carRuntype.badType.message);
    // throw carRuntype.badType; // In some cases, you may throw an error.
  } else {
    const newPrice = computeReduction(Number.parseInt(car.price, 10)); // OK
    // ...
  }
});
```

By default, runtype create a naive clone (`JSON.parse(JSON.stringify(value))`) in order to prevent mutation of matched value.
In that example, it would be useful to retrieve the validated and mutated clone with coerced types and default values:
```ts
// ...

app.post('/car-purchase', (req: express.Request, res: express.Response): void => {
  const car = req.body;

  if (!carRuntype.match(car)) {
    res.status(400).send(carRuntype.badType.message);
  } else {
    const validatedCar = carRuntype.validatedValue;
    const newPrice = computeReduction(validatedCar.price);
    carBuilder.setColor(validatedCar.color); // Default to green.
  }
});
```

Note that you should only use the validated value when your data has a simple JSON structure, as it won't replicate prototypal chain or functions for instance.

Do you prefer object notation over functional one ? Use the class instantiation:
```ts
import { createRuntype, Runtype } from '../src/index';

// ...

createRuntype<Car>(validationSchema);
// is equivalent to
new Runtype<Car>(validationSchema);
```

## Testing
Many `npm` scripts are available to help testing:
```sh
$ npm run {script}
```
- `check`: lint and check unit and integration tests
- `lint`: lint
- `lint-fix`: try to fix lint automatically
- `test`: execute tests
- `test-coverage`: execure tests with coverage informations
- `test-watch`: work in TDD !

Use `npm run check` to check that everything is ok.

## Contributing
If you want to contribute, just fork this repository and make a pull request !

Your development must respect these rules:
- fast
- easy
- light

You must keep test coverage at 100%.

## License
[MIT](LICENSE)

[build-image]: https://img.shields.io/travis/gnodi/runtypor.svg?style=flat
[build-url]: https://travis-ci.org/gnodi/runtypor
[coverage-image]:https://coveralls.io/repos/github/gnodi/runtypor/badge.svg?branch=master
[coverage-url]:https://coveralls.io/github/gnodi/runtypor?branch=master
[version-image]: https://img.shields.io/npm/v/runtypor.svg?style=flat
[version-url]: https://npmjs.org/package/runtypor
[downloads-image]: https://img.shields.io/npm/dm/runtypor.svg?style=flat
[downloads-url]: https://npmjs.org/package/runtypor
[dependencies-image]: https://david-dm.org/gnodi/runtypor.svg
[dependencies-url]: https://david-dm.org/gnodi/runtypor
[dev-dependencies-image]: https://david-dm.org/gnodi/runtypor/dev-status.svg
[dev-dependencies-url]: https://david-dm.org/gnodi/runtypor#info=devDependencies
