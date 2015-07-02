/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

var nrf = require('./nrf24l01');

//Step by step
nrf.init(0, 7, 4, 1); //SPIn (0 or 1), ChipEnable pin, Payload (1 to 32 bytes), Channel (0 to 127)

nrf.config();
console.log("CH is " + nrf.getCH());
console.log("Payload is " + nrf.getPayload());

console.log("set ADDR");
nrf.setRADDR("serv1");
nrf.setTADDR("test1");

console.log("RADDR is " + nrf.getRADDR());
console.log("TADDR is " + nrf.getTADDR());

console.log("Finish config\n");

console.log("Send msg");
nrf.send(new Buffer([102,0,0,0]));
console.log("Wait send finish");
while(nrf.isSending()){}
console.log("Send complete");

console.log("Wait a msg");
while(!nrf.dataReady){}{}

console.log('Get msg');
var nrfRsp = nrf.getData(new Buffer([0x00,0x00,0x00,0x00]));
console.log(nrfRsp.readUInt32BE(0));
