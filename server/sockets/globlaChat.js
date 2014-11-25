'use strict';

module.exports = function(data){
    var socket = this;
    socket.emit('bGlobalChat', data);   // this emit it to my self
    socket.broadcast.emit('bGlobalChat', data);   // this emit it to everyone not my self

};
