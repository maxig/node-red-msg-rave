module.exports = function(RED) {
    "use strict";
    var msgpack = require('msgpack-lite');

    function msgRaveNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        this.on("input", function(msg) {
            if (msg.hasOwnProperty("payload")) {
                if (Buffer.isBuffer(msg.payload)) {
                    try {
                        msg.payload = msgpack.decode(msg.payload);
                        node.send(msg);
                    }
                    catch (e) {
                        node.warn("MsgPack decode failed: " + e);
                        node.status({text: "not a valid msgpack buffer"});
                    }
                }
                else {
                    var jsonLength = JSON.stringify(msg.payload).length;
                    msg.payload = msgpack.encode(msg.payload);
                    node.send(msg);
                    node.status({text: "Saved: " + (jsonLength - msg.payload.length) + " bytes"});
                }
            }
            else {
                node.warn("Ignored message without payload");
            }
        });
    }

    RED.nodes.registerType("msg-rave", msgRaveNode);
}
