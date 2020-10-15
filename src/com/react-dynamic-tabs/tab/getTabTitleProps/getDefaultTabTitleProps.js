export default function ({ id }) {
    const tabObj = this.getTabObj(id)
        , { cssClasses } = this.getSetting(), { accessibility } = this.getOptions();
    let op = { aProps: { className: cssClasses.title } };
    tabObj.iconClass && (op.iconProps = { className: `${cssClasses.icon} ${tabObj.iconClass}` });
    return op;
};