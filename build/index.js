"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var os_1 = __importDefault(require("os"));
var chalk_1 = __importDefault(require("chalk"));
var ModuleScopePlugin = (function () {
    function ModuleScopePlugin(appSrc, allowedFiles) {
        if (allowedFiles === void 0) { allowedFiles = []; }
        this.appSources = Array.isArray(appSrc) ? appSrc : [appSrc];
        this.allowedFiles = new Set(allowedFiles);
    }
    ModuleScopePlugin.prototype.apply = function (compiler) {
        var _this = this;
        var appSources = this.appSources;
        compiler.hooks.file.tapAsync('ModuleScopePlugin', function (request, contextResolver, callback) {
            if (!request.context.issuer) {
                return callback();
            }
            if (request.descriptionFileRoot.indexOf('/node_modules/') !== -1 ||
                request.descriptionFileRoot.indexOf('\\node_modules\\') !== -1 ||
                !request.__innerRequest_request) {
                return callback();
            }
            if (appSources.every(function (appSrc) {
                var relative = path_1.default.relative(appSrc, request.context.issuer);
                return relative.startsWith('../') || relative.startsWith('..\\');
            })) {
                return callback();
            }
            var requestFullPath = path_1.default.resolve(path_1.default.dirname(request.context.issuer), request.__innerRequest_request);
            if (_this.allowedFiles.has(requestFullPath)) {
                return callback();
            }
            if (appSources.every(function (appSrc) {
                var requestRelative = path_1.default.relative(appSrc, requestFullPath);
                return requestRelative.startsWith('../') || requestRelative.startsWith('..\\');
            })) {
                var scopeError = new Error("" + ("You attempted to import " + chalk_1.default.cyan(request.__innerRequest_request) + " which falls outside of the project " + chalk_1.default.cyan('src/') + " directory. " +
                    ("Relative imports outside of " + chalk_1.default.cyan('src/') + " are not supported.")) + os_1.default.EOL + "You can either move it inside " + chalk_1.default.cyan('src/') + ", or add a symlink to it from project's " + chalk_1.default.cyan('node_modules/') + ".");
                Object.defineProperty(scopeError, '__module_scope_plugin', {
                    value: true,
                    writable: false,
                    enumerable: false,
                });
                return callback(scopeError, request);
            }
            return callback();
        });
    };
    return ModuleScopePlugin;
}());
exports.default = ModuleScopePlugin;
//# sourceMappingURL=index.js.map