import eventModes from './eventModes';
import defaultClasses from './defaultClasses';
import defaultEvents from './defaultEvents';
import defaultTabObj from './defaultTabObj';
import factory from './defaultOptions.factory';
export default factory.bind(null, {
    eventModes,
    defaultClasses,
    defaultEvents,
    defaultTabObj
});