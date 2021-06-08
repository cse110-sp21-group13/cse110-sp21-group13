module.exports = {
  launch: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 500,
    testTimeout: 30000,
  },
};