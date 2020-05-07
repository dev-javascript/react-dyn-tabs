import optionManager from './optionManager.factory.js';
{
    const createOptions = (d, o) => o;
    let om = new optionManager({ createOptions });
    var co1 = om.getCurrentOptionsCopy();
    co1.a = '1';
    var io1 = om.getInitialOptionsCopy();
    debugger;
    om.setNewOptions({ b: { c: 1 } });
    var co2 = om.getCurrentOptionsCopy();
    co2.a = '1';
    var io2 = om.getInitialOptionsCopy();
}