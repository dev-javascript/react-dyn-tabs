export default function ({ isSelected, api, id }) {
    const op = api.optionsManager.options, setting = api.optionsManager.setting
        , result = {
            'tab-id': id,
            className: setting.panelClass,
        };
    // check if it is selected
    if (isSelected) {
        result.className += ` ${setting.selectedClass}`;
    };
    // check if accessibility is enable
    if (op.accessibility) {
        result.role = 'tabpanel';
        result.id = setting.panelIdTemplate(id);
        result['aria-hidden'] = isSelected ? false : true;
        result['aria-labelledby'] = setting.ariaLabelledbyIdTemplate(id);
    };
    return result;
};