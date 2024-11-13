/* eslint-disable camelcase */
const common = ['--require-module ts-node/register']

const mooc_backend = [
  ...common,
  'test/apps/mooc/backend/features/**/*.feature',
  '--require test/apps/mooc/backend/features/step_definitions/*.steps.ts'
].join(' ')

module.exports = {
  mooc_backend
}
