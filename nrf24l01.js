/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

var mraa = require("mraa"),
    spi;

var CONFIG=0x00,
    RF_CH=0x05,
    STATUS=0x07,
    RX_ADDR_P0=0x0A,
    RX_ADDR_P1=0x0B,
    TX_ADDR=0x10,
    RX_PW_P0=0x11,
    RX_PW_P1=0x12,
    FIFO_STATUS=0x17,
    EN_CRC=3,
    CRCO=2,
    PWR_UP=1,
    PRIM_RX=0,
    RX_DR=6,
    TX_DS=5,
    MAX_RT=4,
    RX_EMPTY=0,
    R_REGISTER=0x00,
    W_REGISTER=0x20,
    REGISTER_MASK=0x1F,
    R_RX_PAYLOAD=0x61,
    W_TX_PAYLOAD=0xA0,
    FLUSH_TX=0xE1,
    FLUSH_RX=0xE2,
    mirf_ADDR_LEN = 5,
    mirf_CONFIG = ((1<<EN_CRC) | (0<<CRCO) );

var cePin = 8,
    channel = 1,
    payload = 16,
    PTX,
    buf = new Buffer(1);

function transferSync(RX, dataout, len){ 
    return (spi.write(Buffer.concat([new Buffer([RX]), dataout]))).slice(1,1+len);
}

function rxFifoEmpty(){
    return (readRegister(FIFO_STATUS) & (1 << RX_EMPTY));
}

function configRegister( reg,  value)
{
    spi.write(new Buffer([(W_REGISTER | (REGISTER_MASK & reg)), value]));
}

function readRegister( reg )
{
    return spi.write(new Buffer([R_REGISTER | (REGISTER_MASK & reg), 0x00]))[1];
}

function writeRegister( reg,  value,  len) 
{
    return transferSync(W_REGISTER | (REGISTER_MASK & reg), value, len);
}

function getStatus(){
    return readRegister(STATUS);
}

function powerUpRx(){
    PTX = 0;
    cePin.write(0);
    configRegister(CONFIG,  mirf_CONFIG | ( (1<<PWR_UP) | (1<<PRIM_RX) ));
    cePin.write(1);
    configRegister(STATUS,(1 << TX_DS) | (1 << MAX_RT)); 
}

function flushRx(){
    buf[0] = FLUSH_RX;
    spi.write( buf );
}

function powerUpTx(){
    PTX = 1;
    configRegister(CONFIG,  mirf_CONFIG | ( (1<<PWR_UP) | (0<<PRIM_RX) ) );
}

module.exports = {
    isSending : function (){
            if(PTX){
                if((getStatus() & ((1 << TX_DS)  | (1 << MAX_RT)))){
                    powerUpRx();
                    return false; 
                }
                return true;
            }
            return false;
        },
    
    powerDown : function(){
            cePin.write(0);
            configRegister(CONFIG, mirf_CONFIG );
        },
    
    init : function(SPIn, ce, payld, chnl) 
        {   
            cePin = new mraa.Gpio(ce);
            cePin.dir(mraa.DIR_OUT);
            
            payload = payld;
            channel = chnl;

            cePin.write(0);

            spi = new mraa.Spi(SPIn);
            
            spi.mode(mraa.SPI_MODE0);
            spi.bitPerWord(8);
            spi.frequency(2e6); //2 MHz
        },
    
    config : function () 
        {
            configRegister(RF_CH,channel);

            configRegister(RX_PW_P0, payload);
            configRegister(RX_PW_P1, payload);

            powerUpRx();
            flushRx();
        },

    setRADDR : function( adr) 
        {
            adr = new Buffer(adr,'ascii');
            cePin.write(0);
            writeRegister(RX_ADDR_P1,adr,mirf_ADDR_LEN);
            cePin.write(1);
        },

    setTADDR : function ( adr)
        {
            adr = new Buffer(adr,'ascii');
            writeRegister(RX_ADDR_P0,adr,mirf_ADDR_LEN);
            writeRegister(TX_ADDR,adr,mirf_ADDR_LEN);
        },

    dataReady : function () 
        {
            if ( getStatus() & (1 << RX_DR) ) return 1;
            return !rxFifoEmpty();
        },
    getData : function ( data) 
        {
            data = transferSync(R_RX_PAYLOAD, data,payload);
            configRegister(STATUS, 1<<RX_DR);
            return data;
        },
    
    send : function ( value) 
        {
            while (PTX) {
                if((getStatus() & ((1 << TX_DS)  | (1 << MAX_RT)))){
                    PTX = 0;
                    break;
                }
            }            

            cePin.write(0);

            powerUpTx();      

            buf[0] = FLUSH_TX;
            spi.write( buf );     
            
            transferSync(W_TX_PAYLOAD, value,payload);

            cePin.write(1);     
        },
    getCH : function()
        {
            return readRegister(RF_CH);
        },
    getPayload : function()
        {
            return readRegister(RX_PW_P0);
        },
    getRADDR : function()
        {
            return transferSync(R_REGISTER | (REGISTER_MASK & RX_ADDR_P1), new Buffer(5), 5).toString('ascii');
        },
    getTADDR : function()
        {
            return transferSync(R_REGISTER | (REGISTER_MASK & TX_ADDR), new Buffer(5), 5).toString('ascii');
        }

};
