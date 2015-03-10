/// <reference path="./../typings/tsd.d.ts" />

import underscore = require('underscore');
import persist = require('./persist');
import PlayerInfo = require('./PlayerInfo');

var
    rpc = require('sock-rpc');

export function init() {
    registerAll();
}

function registerAll() {
    /**
     *  Echo back all arguments passed.
     *  echo(...,callback);
     */
    rpc.register('echo', function () {

        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();

        console.log(args);

        callback(null, args);
    });

    /**
     *  Get date (no arguments)
     */
    rpc.register('getDate', function (callback) {
        console.log('getDate called :)');
        callback(null, new Date().toString());
    });

    rpc.register('setPosition', function (name, position, callback) {
        console.log(name + ': ' + position.map(function (p) {
            return p.toFixed(0);
        }).join('/'));

        persist.setPlayerPosition(name, new PlayerInfo.Point(position[0].toFixed(0), position[1].toFixed(0)));
        callback(null, 201);
    });

    rpc.register('setStatus', function (playerName: string, status: string, callback) {
        persist.setPlayerStatus(playerName, status);
        callback(null, 201);
    });

    rpc.register('missionStart', function (missionName: string, callback: Function) {
        persist.setMissionName(missionName);
        callback(null, 201);
    });

    rpc.register('setPrivate', function (isPrivate: boolean, cb: Function) {
        persist.setIsPrivate(isPrivate);
        cb(null, 201);
    });

    rpc.register('setPlayerSide', function (playerName: string, side: string, cb) {
        persist.setPlayerSide(playerName, PlayerInfo.Side.fromGameSide(side), cb);
    });

    rpc.listen("::1", 5555);
}
