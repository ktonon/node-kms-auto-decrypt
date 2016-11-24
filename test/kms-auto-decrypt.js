const BPromise = require('bluebird');
const kmsAutoDecrypt = require('../lib');

describe('kmsAutoDecrypt(obj)', () => {
  it('does nothing if obj does not contain the key kmsCiphertextBlob', () =>
    kmsAutoDecrypt({ foo: 'bar' }).then((obj) => {
      obj.should.deepEqual({ foo: 'bar' });
    })
  );

  it('extends the object with decrypted values found in kmsCiphertextBlob', () =>
    kmsAutoDecrypt(
      { kmsCiphertextBlob: 'blah', foo: 'car' },
      { decryptor: () => BPromise.resolve({ food: 'bar' }) }).then((obj) => {
        obj.should.deepEqual({ foo: 'car', food: 'bar' });
      })
  );

  it('extends deeply nested objects with decrypted values', () =>
    kmsAutoDecrypt({
      kmsCiphertextBlob: 'blah',
      foo: {
        one: '1',
        two: '2',
        three: {
          a: 'A',
          b: 'B',
        },
      },
    }, { decryptor: () => BPromise.resolve({
      foo: {
        four: '4',
        three: {
          c: 'C',
        },
      },
      bar: 'car',
    }) }).then((obj) => {
      obj.should.deepEqual({
        foo: {
          one: '1',
          two: '2',
          three: {
            a: 'A',
            b: 'B',
            c: 'C',
          },
          four: '4',
        },
        bar: 'car',
      });
    })
  );
});
