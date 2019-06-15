'use strict';

let explorerConfig = {
  mountPath: '/explorer',
  generateOperationScopedModels: true,
};

if (process.env.IS_DISABLE_EXPLORER === 'true') {
  explorerConfig = null;
}

module.exports = {
  'loopback-component-explorer': explorerConfig,
};
