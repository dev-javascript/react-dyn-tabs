import api from './api.js';
import validation from '../validation/index'
export default function (options) {
    return new api({
        initialOptions: new (validation)(options).validate()
    });
};