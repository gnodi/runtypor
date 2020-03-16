/* eslint-disable @typescript-eslint/no-var-requires */
const { createRuntype, Runtype, RuntypeError } = require('../dist/index');

describe('Building Runtypor', () => {
  test('should succeed', () => {
    expect(createRuntype({})).toBeInstanceOf(Runtype);
    expect(new Runtype({})).toBeInstanceOf(Runtype);
    expect(new RuntypeError()).toBeInstanceOf(Error);
  });
});
