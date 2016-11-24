const AWS = require('aws-sdk');
const BPromise = require('bluebird');

AWS.config.setPromisesDependency(BPromise);
const kms = new AWS.KMS();

const kmsDecryptor = (opt) => {
  const logger = (opt && opt.logger) || console;
  return blob => kms.decrypt({ CiphertextBlob: Buffer(blob, 'base64') })
    .promise()
    .then(data => JSON.parse(data.Plaintext.toString()))
    .catch((err) => {
      logger.error(err);
      return {};
    });
};

module.exports = kmsDecryptor;
