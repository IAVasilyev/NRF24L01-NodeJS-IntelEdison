# Requirements
libmraa0 must be installed.

# Connections
Example for Edison.
Pin: Mini breakout pin number / Arduino board pin number. 

<table align="center">
  <tr>
    <td rowspan="2">Pin</td>
    <td colspan="4" align=center>NRF</td>
    <td rowspan="2">Pin</td>
  </tr>
  <tr>
    <td>pin</td>
    <td>Type</td>
    <td>Type</td>
    <td>pin</td>
  </tr>
  <tr>
    <td>n/c</td>
    <td>8</td>
    <td>IRQ </td>
    <td>MISO</td>
    <td>7</td>
    <td>J18-11 / D12</td>
  </tr>
  <tr>
    <td>J17-12 / D11</td>
    <td>6</td>
    <td>MOSI </td>
    <td>CLK</td>
    <td>5</td>
    <td>J17-11 / D13</td>
  </tr>
  <tr>
    <td>J18-10 / D10<sup>1</sup></td>
    <td>4</td>
    <td>CSN </td>
    <td>CE</td>
    <td>3</td>
    <td>J17-8 / D7</td>
  </tr>
  <tr>
    <td>3V3</td>
    <td>2</td>
    <td>VCC</td>
    <td>GND</td>
    <td>1</td>
    <td>GND</td>
  </tr>
</table>
1 - if use SPIn=1, then J17-10 / D9

Don't forget use logic level shifter if you use mini breakout board. Board logic level - 1.8V, NRF logic level - 3.3V (VCC pin)

# Methods

##init(SPIn, ce, payld, chnl)
- 'SPIn' - SPI line number. 0 or 1 (see MRAA SPI)
- 'ce' - Chip Enabple pin. 
- 'payld' - payload size in bytes. 
- 'chnl' - RF Channel 0 - 127 or 0 - 84 in the US.
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
