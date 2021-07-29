import Pub_Sub from './pub_sub.js';
let instance = null;
beforeEach(() => {
  instance = new Pub_Sub();
});
afterEach(() => {
  instance = null;
});
describe('Pub_Sub.prototype.on :  ', () => {
  test('it can attach diferent event handlers function for one event', () => {
    expect(instance._publishers.onSelect.length).toBe(0);
    instance.on('onSelect', () => {});
    instance.on('onSelect', () => {});
    expect(instance._publishers.onSelect.length).toBe(2);
  });
  test('it does not attach an event handler twice', () => {
    expect(instance._publishers.onSelect.length).toBe(0);
    const onSelectHandler = () => {};
    instance.on('onSelect', onSelectHandler);
    instance.on('onSelect', onSelectHandler);
    expect(instance._publishers.onSelect.length).toBe(1);
  });
  test('it can not attach an event handler for beforeSelect or beforeClose event', () => {
    instance.on('beforeSelect', () => {});
    instance.on('beforeClose', () => {});
    expect(typeof instance._publishers.beforeSelect).toBe('undefined');
    expect(typeof instance._publishers.beforeClose).toBe('undefined');
  });
});
