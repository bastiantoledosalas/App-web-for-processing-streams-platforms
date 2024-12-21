"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const shortid_1 = require("shortid");
exports.makeInjectableMixin = (name) => mixinClass => {
    Object.defineProperty(mixinClass, 'name', {
        value: `${name}-${shortid_1.generate()}`
    });
    common_1.Injectable()(mixinClass);
    return mixinClass;
};
//# sourceMappingURL=mixins.js.map