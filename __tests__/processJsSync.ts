import tmp from 'tmp';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';
import path from 'path';

import rcs from '../lib';
import reset from './helpers/reset';

let testCwd;
const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

beforeAll(() => {
  testCwd = tmp.dirSync();

  reset();

  rcsCore.selectorsLibrary.fillLibrary(fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'));
});

afterEach(() => {
  testCwd.removeCallback();
});

test('should process js files', () => {
  rcs.process.jsSync('js/main.js', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/js/main.js'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.js'), 'utf8');

  expect(newFile).toBe(expectedFile);
});

test('should process jsx files', () => {
  rcs.process.jsSync('js/react.js', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
    espreeOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/js/react.js'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/react.js'), 'utf8');

  expect(newFile).toBe(expectedFile);
});

test('should not process jsx files', () => {
  rcs.process.jsSync('js/react.js', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/js/react.js'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(testCwd.name, '/js/react.js'), 'utf8');

  expect(newFile).toBe(expectedFile);
});

test('should process complex files', () => {
  rcs.process.jsSync('js/complex.js', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/js/complex.js'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(testCwd.name, '/js/complex.js'), 'utf8');

  expect(newFile).toBe(expectedFile);
});

test('should not process multiple files', () => {
  rcs.process.jsSync('js/*.js', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
    espreeOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/js/complex.js'), 'utf8');
  const newFileTwo = fs.readFileSync(path.join(testCwd.name, '/js/main.js'), 'utf8');
  const newFileThree = fs.readFileSync(path.join(testCwd.name, '/js/react.js'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/complex.js'), 'utf8');
  const expectedFileTwo = fs.readFileSync(path.join(resultsCwd, '/js/main.js'), 'utf8');
  const expectedFileThree = fs.readFileSync(path.join(resultsCwd, '/js/react.js'), 'utf8');

  expect(newFile).toBe(expectedFile);
  expect(newFileTwo).toBe(expectedFileTwo);
  expect(newFileThree).toBe(expectedFileThree);
});
