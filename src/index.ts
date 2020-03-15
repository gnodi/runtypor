/* eslint-disable max-classes-per-file */
import Ajv from 'ajv';

class RuntypeError extends Error {
  constructor(message: string) {
    super(`[runtyper] ${message}`);
  }
}

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  removeAdditional: true,
  useDefaults: true,
});

class Runtype<T> {
  private _validate: Ajv.ValidateFunction;

  private _validatedValue?: T;

  constructor(schema: object) {
    this._validate = ajv.compile(schema);
    this._validatedValue = undefined;
  }

  get badType(): RuntypeError {
    const validationErrorText = ajv.errorsText(this._validate.errors);
    return new RuntypeError(`Bad type: ${validationErrorText}`);
  }

  get validatedValue(): T {
    if (this._validatedValue === undefined) {
      throw new RuntypeError('Bad usage');
    }
    return this._validatedValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  match(value: any): value is T {
    this._validatedValue = undefined;
    const naiveClone = JSON.parse(JSON.stringify(value));

    const validated = this._validate(naiveClone);

    if (typeof validated !== 'boolean') {
      throw new RuntypeError('Does not handle asynchronous validation');
    }

    if (validated) {
      this._validatedValue = naiveClone;
    }

    return validated;
  }
}

function createRuntype<T>(schema: object): Runtype<T> {
  return new Runtype<T>(schema);
}

export {
  createRuntype,
  Runtype,
  RuntypeError,
};
