const { TranslocoExtractKeysWebpackPlugin } = require('@ngneat/transloco-keys-manager');
 
module.exports = {
  plugins: [new TranslocoExtractKeysWebpackPlugin()]
};
