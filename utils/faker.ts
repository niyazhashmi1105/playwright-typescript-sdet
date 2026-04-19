import { faker } from '@faker-js/faker';

export class FakerUtils {
  private constructor() {}
  static generateFName() {
    return faker.person.firstName();
  }

  static generateLName() {
    return faker.person.lastName();
  }

  static generateUsername() {
    const letters = faker.string.alpha({ length: 6 }).toLowerCase();
    const digits = faker.string.numeric(5);
    return `test${letters}${digits}`;
  }

  static generateEmail() {
    return faker.internet.email().toLowerCase();
  }

  static generatePassword() {
    return `P@${faker.string.alphanumeric(10)}a1`;
  }

  static generateUserData() {
    const password = this.generatePassword();
    return {
      firstName: this.generateFName(),
      lastName: this.generateLName(),
      username: this.generateUsername(),
      email: this.generateEmail(),
      password: password,
      confirmPassword: password,
    };
  }
}
