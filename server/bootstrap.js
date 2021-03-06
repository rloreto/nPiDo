var DeviceService = require('./services/device');
var rp = require('request-promise');
var request = require('sync-request');
var http = require('http');
const mongoose = require('mongoose');
const Device = mongoose.model('Device');
const Component = mongoose.model('Component');
const suspend = require('suspend');
var os = require("os");


var self = {
  init: function*(cb) {
    var totalRequest = 0;
    var completeRequest = 0;
    var errorRequest = 0;
    var number = 0;
    var totalRetry = 100000;
    var ip = DeviceService.getIp();

    var hostname = os.hostname();
    console.log('Device ip: ' + ip);
    console.log('Device hostname: ' + hostname);
    var masterDevice = yield Device.find({
      isMaster: true,
      name: hostname
    }).exec();
    if (masterDevice) {
      var switchComponents = yield Component.find({
        type: 'switch'
      }).populate('gpios').exec();

      if (switchComponents && switchComponents.length > 0) {

        totalRequest = switchComponents.length;
        number = 0;
        console.log("Trying to start the switch components...");
        var id = setInterval(function() {

          suspend(function*() {

            completeRequest = 0;
            errorRequest = 0;
            for (var i = 0; i < switchComponents.length; i++) {
              var component = switchComponents[i];
              if (component.gpios) {
                for (var k = 0; k < component.gpios.length; k++) {
                  if (component.gpios[k].action === 'switch') {
                    try {
                      console.log( "http://" + component.gpios[k].ip + ":" + DeviceService.getAppPort() + "/api/gpios/" + component.gpios[k].number);
                      var response = yield rp({
                        method: 'Get',
                        uri: "http://" + component.gpios[k].ip + ":" + DeviceService.getAppPort() + "/api/gpios/" + component.gpios[k].number,
                        resolveWithFullResponse: true
                      });
                      var data = JSON.parse(response.body);
                      var gpio = data.gpio;
                      if (gpio.mode === 'in') {
                        var responseActon = yield rp({
                          method: 'Put',
                          uri: "http://" + component.gpios[k].ip + ":" + DeviceService.getAppPort() + "/api/gpios/" + component.gpios[k].number + "/action",
                          resolveWithFullResponse: true,
                          formData: {
                            state: 'on',
                            type: 'inOut'
                          }
                        });
                        completeRequest++;
                        break;
                      } else {
                        completeRequest = totalRequest;
                        break;
                      }

                    } catch (e) {
                      //console.log(e.message);
                    }
                  }
                }
              }
            };
            if (completeRequest === totalRequest || number === totalRetry) {
              console.log("Switches initialized successfully");
              number = totalRetry + 1;
              clearInterval(id);
              id = 0;
            } else {
              console.log("Retry " + number + " of " + totalRetry);
            }

          })();

          number++;
        }, 5 * 1000);
      }
    }

  }
}

module.exports = self;
