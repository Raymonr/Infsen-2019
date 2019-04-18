"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lesson1_1 = require("./Lesson1");
exports.None = function () {
    return {
        kind: "none"
    };
};
exports.Some = function (v) {
    return {
        kind: "some",
        value: v
    };
};
var arithmeticOp = function (operator) {
    return Lesson1_1.Fun(function (x) {
        return Lesson1_1.Fun(function (y) {
            return operator.f(x).f(y);
        });
    });
};
var div = function () {
    var divF = Lesson1_1.Fun(function (x) {
        return Lesson1_1.Fun(function (y) {
            if (y == 0) {
                return exports.None();
            }
            else {
                return exports.Some(x / y);
            }
        });
    });
    return arithmeticOp(divF);
};
exports.mapOption = function (f) {
    return Lesson1_1.Fun(function (opt) {
        if (opt.kind == "none") {
            return exports.None();
        }
        else {
            return exports.Some(f.f(opt.value));
        }
    });
};
var vectorMap = function (f) {
    return Lesson1_1.Fun(function (t) {
        return {
            x: f.f(t.x),
            y: f.f(t.y),
            z: f.f(t.z)
        };
    });
};
