const axios = require('axios');
const { spawn, spawnSync } = require('child_process');

const setupEnvironment = async () => {
  let serve;
  let response;
  let retries = 0;
  try {
    response = await axios.get('http://localhost:5000');
  } catch (err) {
    serve = spawn('npx', ['serve', '-s', 'build'], { stdio: 'inherit' });
  }
  do {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      response = await axios.get('http://localhost:5000');
    } catch (err) {
      if (retries++ > 5) {
        throw new Error('FATAL ERROR - Could not start static server');
      }
    }
  } while (!response);
  const testResult = spawnSync(
    'npx',
    [
      'react-scripts',
      'test',
      '--watchAll=false',
      '--testPathPattern=e2e',
      '--env=node',
      '--reporters=jest-junit',
      '--reporters=default'
    ],
    { stdio: 'inherit' }
  ).status;
  serve.kill();
  process.exit(testResult);
};

setupEnvironment();
