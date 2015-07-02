# Methods

##init(SPIn, ce, payld, chnl)
- SPIn - SPI line number. 0 or 1 (see MRAA SPI)
- ce - Chip Enabple pin. 
- payld - payload size in bytes. 
- chnl - RF Channel 0 - 127 or 0 - 84 in the US.
Initialize SPI, set payload and channel (don't write to module, see `config`).

##config()
Write channel and payload to NRF module. Also PowerUp and Flush Rx.

##setRADDR(adr)
- 'adr' - string of 5 characters
Write to module receiver (source, self) address.

##setTADDR(adr)
- 'adr' - string of 5 characters
Write to module transmiter (destination) address.

##send(value)
- 'value' - must be a Buffer with size equal payload (see `Init`)
Return Buffer.

##getData(data)
- 'data' - must be a Buffer with size equal payload (see `Init`)
Return Buffer with data.

##isSending()
Return `true` if module is sending.

##dataReady()
Return `true` if data is ready.

##getCH()
Return channel number.

##getPayload()
Return payload size in bytes.

##getRADDR()
Return String with reciever address.

##getTADDR()
Return String with transmitter address.

##powerDown()
