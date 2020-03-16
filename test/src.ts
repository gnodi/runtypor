import { createRuntype, Runtype, RuntypeError } from '../src/index';

type Car = {
  brand: string;
  model: string;
  manufacturedAt: string;
  color: string;
  price: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function purchaseCar(runtype: Runtype<Car>, params: any): Car {
  if (!runtype.match(params)) {
    throw runtype.badType;
  }
  return params;
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

describe('Runtypor', () => {
  test('should validate type of given argument from a JSON schema', () => {
    const runtype = createRuntype<Car>(validationSchema);

    const car = purchaseCar(runtype, {
      brand: 'plop',
      model: 'plip',
      manufacturedAt: '2019-10-10T07:07:07.000Z',
      color: 'red',
      price: 1000,
    });

    expect(car.brand).toEqual('plop');
  });

  test('should provide an object syntax for Runtype instantiation', () => {
    const runtype = new Runtype<Car>(validationSchema);

    const car = purchaseCar(runtype, {
      brand: 'plop',
      model: 'plip',
      manufacturedAt: '2019-10-10T07:07:07.000Z',
      color: 'red',
      price: 1000,
    });

    expect(car.brand).toEqual('plop');
  });

  test('should provide modified validated value', () => {
    const runtype = new Runtype<Car>(validationSchema);

    const car = purchaseCar(runtype, {
      brand: 'plop',
      model: 'plip',
      manufacturedAt: '2019-10-10T07:07:07.000Z',
      price: '1000',
    });

    expect(car.brand).toEqual('plop');
    expect(car.color).toBeUndefined();
    expect(car.price).toEqual('1000');

    const validatedCar = runtype.validatedValue;

    expect(validatedCar.brand).toEqual('plop');
    expect(validatedCar.color).toEqual('green');
    expect(validatedCar.price).toEqual(1000);
  });

  test('should fail to validate bad formatted argument', () => {
    const runtype = createRuntype<Car>(validationSchema);
    const purchase = (): Car => purchaseCar(runtype, {
      model: 'plip',
      manufacturedAt: '2019-10-10T07:07:07.000Z',
      color: 'red',
      price: 1000,
    });

    expect(purchase).toThrowError(RuntypeError);
    expect(purchase).toThrowError(/Bad type/);
  });

  test('should fail to retrieve validated value when no match has been processed', () => {
    const runtype = createRuntype<Car>(validationSchema);
    const getValidatedValue = (): Car => runtype.validatedValue;

    expect(getValidatedValue).toThrowError(RuntypeError);
    expect(getValidatedValue).toThrowError(/Bad usage/);
  });

  test('should fail to retrieve validated value when match has failed', () => {
    const runtype = createRuntype<Car>(validationSchema);
    const purchase = (): Car => {
      runtype.match({
        model: 'plip',
        manufacturedAt: '2019-10-10T07:07:07.000Z',
        color: 'red',
        price: 1000,
      });
      return runtype.validatedValue;
    };

    expect(purchase).toThrowError(RuntypeError);
    expect(purchase).toThrowError(/Bad usage/);
  });

  test('should fail to process async validation', () => {
    const asyncValidationSchema = {
      type: 'object',
      properties: {
        brand: { type: 'string' },
        model: { type: 'string' },
        manufacturedAt: { type: 'string', format: 'date-time' },
        color: { type: 'string', default: 'green' },
        price: { type: 'number' },
      },
      required: ['brand', 'model'],
      $async: true,
    };

    const runtype = createRuntype<Car>(asyncValidationSchema);
    const purchase = (): Car => purchaseCar(runtype, {
      brand: 'plop',
      model: 'plip',
      manufacturedAt: '2019-10-10T07:07:07.000Z',
      color: 'red',
      price: 1000,
    });

    expect(purchase).toThrowError(RuntypeError);
    expect(purchase).toThrowError(/Does not handle asynchronous validation/);
  });
});
