import _ from 'lodash';
import { getRelationLocalField } from '../../utils/filterUtils';

export default (Model) => {
    Model.toSecureObject = (obj, additionalFields) => {
        if (!obj || !Model.settings.secured) {
            return obj;
        }
        let selectedFields = Model.settings.secured;
        if (typeof additionalFields === 'string') {
            additionalFields = [additionalFields];
        }
        if (Array.isArray(additionalFields)) {
            selectedFields = additionalFields.concat(selectedFields);
        }
        let secureObj = obj;
        if (_.isObject(obj) && (obj.constructor.name === 'ModelConstructor')) {
            secureObj = obj.toObject(true, false, false);
        }
        secureObj = _.pick(secureObj, selectedFields);
        const relationNames = Object.keys(Model.relations);
        for (let i = 0, length = relationNames.length; i < length; i++) {
            const relation = Model.relations[relationNames[i]];
            const relProp = getRelationLocalField(relation);
            if (relProp && _.isPlainObject(secureObj[relProp]) && (typeof relation.modelTo.toSecureObject === 'function')) {
                secureObj[relProp] = relation.modelTo.toSecureObject(secureObj[relProp]);
            }
        }
        return secureObj;
    };
}
