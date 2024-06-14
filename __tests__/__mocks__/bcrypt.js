import { jest } from '@jest/globals';

const bcrypt = {
  hash: jest.fn((password, saltRounds) => {
    return Promise.resolve(`hashed_${password}`);
  }),
  compare: jest.fn((password, hashedPassword) => {
    return Promise.resolve(password === hashedPassword);
  }),
};

export { bcrypt };
