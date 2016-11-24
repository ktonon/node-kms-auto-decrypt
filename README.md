# node-kms-auto-decrypt

[![CircleCI](https://circleci.com/gh/ktonon/node-kms-auto-decrypt.svg?style=svg)](https://circleci.com/gh/ktonon/node-kms-auto-decrypt)

__Install__

```
npm install kms-auto-decrypt
```

__Usage__

First configure an AWS access and secret key. Then use [aws kms encrypt][] to encrypt a `JSON.stringify`ed object containing secret values. For example, consider this object:

```json
{
  "foo": {
    "two": {
      "b": "secret"
    },
    "three": "secret"
  }
}
```

After encrypting, you will have a `CiphertextBlob`. Insert this as a root key, `kmsCiphertextBlob`, in an object containing other non-encrypted values.

```js
const kmsAutoDecrypt = require('kms-auto-decrypt');

const myConf = {
  kmsCiphertextBlob: 'encrypted-secrets',
  foo: {
    one: '1',
    two: {
      a: 'A'
    }
  }
};

kmsAutoDecrypt(myConf).then((decryptedConf) => { /* ... */ });
```

Now you can use `decryptedConf` which will contain both decrypted and plain (originally non-encrypted) values:

```js
{
  foo: {
    one: '1',
    two: {
      a: 'A',
      b: 'secret'
    },
    three: 'secret'
  }
};
```

[aws kms encrypt]:http://docs.aws.amazon.com/cli/latest/reference/kms/encrypt.html
