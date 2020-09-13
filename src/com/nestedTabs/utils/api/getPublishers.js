import Publisher from './publisher.js';
export default () => {
    const publishers = {
        beforeSwitchTabPublisher: new (Publisher)()
        , onSwitchTabPublisher: new (Publisher)()
        , onCloseTabPublisher: new (Publisher)()
        , onOpenTabPublisher: new (Publisher)()
        , rootComponentDidUpdatePublisher: new (Publisher)()
        , rootComponentDidMountPublisher: new (Publisher)()
        , rootComponentWillUnmountPublisher: new (Publisher)()
        , beforeSetDataPublisher: new (Publisher)()
        , onSetDataPublisher: new (Publisher)()
    };
    return publishers;
};