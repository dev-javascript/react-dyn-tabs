import Publisher from './publisher.js';
export default () => {
    const publishers = {
        beforeSwitchTab: new (Publisher)()
        , onChange: new (Publisher)()
        , onInit: new (Publisher)()
        , onDestroy: new (Publisher)()
    };
    return publishers;
};