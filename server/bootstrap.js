var DeviceService = require('./services/device');
var rp = require('request-promise');
var request = require('sync-request');
var http = require('http');

module.exports.init = function(cb) {

    var totalRequest = 0;
    var completeRequest =0;
    var errorRequest=0;
    var number =0;
    var totalRetry = 20;
    var ip = DeviceService.getIp();
    console.log(ip);

    Device.find({ isMaster: true}).then(function(device){

      if(device && device.length>0 && device[0] && ip === device[0].ip){
        Component.find({ type: 'switch'}).populate('gpios').then(function(components){

          totalRequest = components.length;
          number =1;
          console.log("Trying to start the switch components...");
          var id = setInterval(function(){
            if(completeRequest === totalRequest || number === totalRetry){
              console.log("Switch inicialize completed");
              number = totalRetry;
              clearInterval(id);
              id= 0;
              return;
            }

            console.log("Retry " + number +" of "+ totalRetry);
            completeRequest = 0;
            errorRequest = 0;
            components.forEach(function(component){

              if(component.gpios){
                for (var i = 0; i < component.gpios.length; i++) {
                  if(component.gpios[i].action ==='switch'){

                    return rp({
                        method: 'Get',
                        uri: "http://" + component.gpios[i].ip + ":"+ DeviceService.getAppPort() +"/api/gpios/" + component.gpios[i].number  ,
                        resolveWithFullResponse: true
                    }).then(function(response){
                      var data = JSON.parse(response.body);
                      var gpio = data.gpio;
                      if(gpio.mode === 'in'){
                        return rp({
                            method: 'Put',
                            uri: "http://" + component.gpios[i].ip + ":"+ DeviceService.getAppPort() +"/api/gpios/" + component.gpios[i].number +"/action" ,
                            resolveWithFullResponse: true,
                            formData: { state: 'on', type: 'inOut' }
                        }).then(function(result){
                          completeRequest++;
                          if(id>0){
                            console.log("complete " + completeRequest);
                          }
                        }, function(){
                          errorRequest++;
                          if(id>0){
                          console.log("error " + errorRequest);
                          }
                        });
                      } else {
                        completeRequest++;
                      }
                    })
                    break;
                  }
                }
              }
            });

            number++;
          }, 5 * 1000);
        });
      }

    });


};
