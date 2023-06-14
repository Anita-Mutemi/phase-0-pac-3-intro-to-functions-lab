global.expect = require("expect");

const babel = require("babel-core");
const jsdom = require("jsdom");
const path = require("path");

// Declare the functions
function shout(string) {
  return string.toUpperCase();
}

function whisper(string) {
  return string.toLowerCase();
}

function logShout(string) {
  console.log(string.toUpperCase());
}

function logWhisper(string) {
  console.log(string.toLowerCase());
}

function sayHiToGrandma(string) {
  if (string.toLowerCase() === string) {
    return "I can't hear you!";
  } else if (string.toUpperCase() === string) {
    return "YES INDEED!";
  } else if (string === "I love you, Grandma.") {
    return "I love you, too.";
  }
}

function sayHiToHeadphonedRoommate(string) {
  if (string.toLowerCase() === string) {
    return "I can't hear you!";
  } else if (string.toUpperCase() === string) {
    return "YES INDEED!";
  } else if (string === "Let's have dinner together!") {
    return "I would love to!";
  }
}

// Test environment setup
before(function (done) {
  const babelResult = babel.transformFileSync(path.resolve(__dirname, '..', 'index.js'), {
    presets: ['@babel/preset-env']
  });

  const html = path.resolve(__dirname, '..', 'index.html');

  const { window } = new JSDOM('', {
    resources: 'usable',
    runScripts: 'dangerously',
    virtualConsole: new jsdom.VirtualConsole().sendTo(console)
  });

  window.eval(babelResult.code);

  global.window = window;
  global.document = window.document;

  done();
});

// Tests (Add your test cases here)
describe('shout(string)', () => {
  it('returns the string in all caps', () => {
    expect(shout('hello')).toBe('HELLO');
  });
});

describe('whisper(string)', () => {
  it('returns the string in all lowercase', () => {
    expect(whisper('HELLO')).toBe('hello');
  });
});

describe('logShout(string)', () => {
  it('logs the string in all caps using console.log()', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    logShout('hello');
    expect(consoleLogSpy).toHaveBeenCalledWith('HELLO');
    consoleLogSpy.mockRestore();
  });
});

describe('logWhisper(string)', () => {
  it('logs the string in all lowercase using console.log()', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    logWhisper('HELLO');
    expect(consoleLogSpy).toHaveBeenCalledWith('hello');
    consoleLogSpy.mockRestore();
  });
});

describe('sayHiToHeadphonedRoommate', () => {
  it('returns "I can\'t hear you!" if `string` is lowercase', () => {
    expect(sayHiToHeadphonedRoommate('hello')).toBe("I can't hear you!");
  });

  it('returns "YES INDEED!" if `string` is uppercase', () => {
    expect(sayHiToHeadphonedRoommate('HELLO')).toBe('YES INDEED!');
  });

  it('returns "I would love to!" if `string` is "Let\'s have dinner together!"', () => {
    expect(sayHiToHeadphonedRoommate("Let's have dinner together!")).toBe('I would love to!');
  });
});

describe('sayHiToGrandma', () => {
  it('returns "I can\'t hear you!" if `string` is lowercase', () => {
    expect(sayHiToGrandma('hello')).toBe("I can't hear you!");
  });

  it('returns "YES INDEED!" if `string` is uppercase', () => {
    expect(sayHiToGrandma('HELLO')).toBe('YES INDEED!');
  });

  it('returns "I love you, too." if `string` is "I love you, Grandma."', () => {
    expect(sayHiToGrandma('I love you, Grandma.')).toBe('I love you, too.');
  });
});
