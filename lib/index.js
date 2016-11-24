const BPromise = require('bluebird');
const kmsDecryptor = require('./kms-decryptor');

const mix = (obj, extra) => {
  const copy = Object.assign({}, obj);
  Object.keys(extra).forEach((key) => {
    copy[key] = (typeof extra[key] === 'object') && (typeof obj[key] === 'object')
      ? mix(obj[key], extra[key])
      : extra[key];
  });
  return copy;
};

// ({ kmsCiphertextBlob, ... }, {
//   decryptor = kmsDecryptor
// }) => { ... }
const kmsAutoDecrypt = (obj, opt) => {
  const decryptor = (opt && opt.decryptor) || kmsDecryptor(opt);
  const copy = Object.assign({}, obj);
  const blob = obj.kmsCiphertextBlob;
  if (blob) {
    delete copy.kmsCiphertextBlob;
    return decryptor(blob).then(extra => mix(copy, extra));
  }
  return BPromise.resolve(copy);
};

module.exports = kmsAutoDecrypt;
