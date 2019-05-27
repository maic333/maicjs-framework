"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var get = require("lodash/get");
var file_helper_1 = require("../helpers/file-helper");
var api_registry_1 = require("./http/api-registry");
var FaimApp = /** @class */ (function () {
    function FaimApp(config) {
        // configuration defaults
        this.config = {
            apiPrefix: 'api'
        };
        // overwrite default configuration
        if (config) {
            this.config = Object.assign(this.config, config);
        }
        // create the express app
        this.app = express();
    }
    /**
     * Start the app, listening on a given port
     */
    FaimApp.prototype.listen = function (port) {
        return __awaiter(this, void 0, void 0, function () {
            var mainDirectoryPath, controllersDefaultPath, servicesDefaultPath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // initialize the ApiRegistry service
                        api_registry_1.default.init(this);
                        mainDirectoryPath = this.getMainScriptDirectoryPath();
                        controllersDefaultPath = path.resolve(mainDirectoryPath, 'controllers');
                        return [4 /*yield*/, this.loadFrameworkFiles(controllersDefaultPath)];
                    case 1:
                        _a.sent();
                        servicesDefaultPath = path.resolve(mainDirectoryPath, 'services');
                        return [4 /*yield*/, this.loadFrameworkFiles(servicesDefaultPath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _this.app.listen(port, function () {
                                    // the app is listening on the configured port
                                    resolve();
                                });
                            })];
                }
            });
        });
    };
    /**
     * Load framework specific files (controllers, services) from a given path
     */
    FaimApp.prototype.loadFrameworkFiles = function (filesPath) {
        return file_helper_1.default.loadFilesFromPath(filesPath);
    };
    /**
     * Register a middleware
     */
    /* tslint:disable-next-line no-any */
    FaimApp.prototype.use = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.app.use(args);
    };
    /**
     * Register a route on a given path
     */
    FaimApp.prototype.route = function (routePath) {
        return this.app.route(routePath);
    };
    /**
     * Get the directory path of the main script
     */
    FaimApp.prototype.getMainScriptDirectoryPath = function () {
        var mainScriptPath = get(require, 'main.filename', '');
        return path.dirname(mainScriptPath);
    };
    return FaimApp;
}());
exports.default = FaimApp;
//# sourceMappingURL=faim-app.js.map