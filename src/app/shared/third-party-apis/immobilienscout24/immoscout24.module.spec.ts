import { Immoscout24Module } from './immoscout24.module';


describe('Immoscout24Module', () => {
  let moduleUnterTest: Immoscout24Module;

  beforeEach(() => {
    moduleUnterTest = new Immoscout24Module();
  });

  it('should create an instance', () => {
    expect(moduleUnterTest).toBeTruthy();
  });
});
