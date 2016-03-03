/**
 * ComponentController
 * @description :: Server-side logic for managing components
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var ComponentActions = require('../../services/componentActions');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Component = mongoose.model('Component');
const Gpio = mongoose.model('Gpio');

var self = {
  getById: function(req, res) {
    debugger;
    var id = req.query.id;
    if (!id) {
      throw new Error('The id "' + id + '" is required.');
      return;
    }

    Component.find({
        id: id
      }).populate('gpios')
      .exec()
      .then(function(component) {
        if (!component) {
          throw new Error('The component ' + id + ' not found');
        }
        return ComponentActions.updateGpiosValues(component[0]);
      })
      .catch(function(e) {
        res.json({
          status: 'failed',
          error: e.message
        });
      })
      .then(function(result) {
        res.json(result);
      });
  },
  socket: function(req, res) {

    var state = req.param('state');
    var id = req.param('id');

    if (state !== 'on' && state !== 'off') {
      throw new Error('The state should be "on" or "off"');
    }

    Component.findOne({_id: id}).populate('gpios')
      .exec()
      .then(function(component) {
        if (!component) {
          throw new Error('The component' + id + ' not found');
        }
        if (component && component.type !== 'socket') {
          throw new Error('The component type should be "socket" not "' + component.type + '".');
        }
        if (component && !component.gpios) {
          throw new Error('The component' + id + ' not found');
        }
        if (component && component.gpios && component.gpios.length !== 1) {
          throw new Error('The number of gpios fos the component with id:"' + id + '"should be 1.');
        }

        return ComponentActions.changeOnOffState(component, state, 'out01');
      })
      .catch(function(e) {
        res.json({
          status: 'failed',
          error: e.message
        });
      })
      .then(function(result) {
        res.json(result);
      });
  },
  dimmer: function(req, res) {
    var state = req.param('state');
    var id = req.param('id');

    if (state !== 'on' && state !== 'off' && state !== 'change' && state !== 'start' && state !== 'stop' && state !== 'low' && state !== 'mediun' && state !== 'hight') {
      throw new Error('The state should be "on","off","change","start","stop","low","mediun" or "hight"');
    }

    Component.findOne({_id: id}).populate('gpios')
      .exec()
      .then(function(component) {
        if (!component) {
          throw new Error('The component' + id + ' not found');
        }
        if (component && component.type !== 'dimmer') {
          throw new Error('The component type should be "dimmer" not "' + component.type + '".');
        }
        if (component && !component.gpios) {
          throw new Error('The component' + id + ' not found');
        }
        if (component && component.gpios && component.gpios.length !== 1) {
          throw new Error('The number of gpios for the component with id:"' + id + '"should be 1.');
        }
        return ComponentActions.changeDimmerState(component, state);

      })
      .catch(function(e) {
        res.json({
          status: 'failed',
          error: e.message
        });
      })
      .then(function(result) {
        res.json(result);
      });
  },
  switch: function(req, res) {
    var state = req.param('state');
    var id = req.param('id');

    if (state !== 'on' && state !== 'off') {
      throw new Error('The state should be "on" or "off"');
    }

    Component.findOne({_id: id}).populate('gpios')
      .exec()
      .then(function(component) {
        if (!component) {
          throw new Error('The component' + id + ' not found');
        }
        if (component && component.type !== 'switch') {
          throw new Error('The component type should be "switch" not "' + component.type + '".');
        }
        if (component && !component.gpios) {
          throw new Error('The component' + id + ' not found');
        }
        if (component && component.gpios && component.gpios.length !== 3) {
          throw new Error('The number of gpios fos the component with id:"' + id + '"should be 3.');
        }

        return ComponentActions.changeSwitchState(component, state);
      })
      .catch(function(e) {
        res.json({
          status: 'failed',
          error: e.message
        });
      })
      .then(function(result) {
        res.json(result);
      });


  },
  switchBlind: function(req, res) {
    var state = req.param('state');
    var id = req.param('id');

    if (state !== 'up' && state !== 'down' && state !== '0' && state !== '25' && state !== '50' && state !== '75' && state !== '100') {
      throw new Error('The state should be "up", "down",  "0", "25", "50", "75" or "100"');
    }

    return Component.findOne({_id: id}).populate('gpios')
      .exec()
      .then(function(component) {
        if (!component) {
          throw new Error('The component ' + id + ' not found');
        }
        if (component && component.type !== 'switchBlind') {
          throw new Error('The component type should be "switchBlind" not "' + component.type + '".');
        }
        if (component && !component.gpios) {
          throw new Error('The component ' + id + ' require gpios.');
        }
        if (component && component.gpios && component.gpios.length !== 2) {
          throw new Error('The number of gpios fos the component with id:"' + id + '"should be 2.');
        }

        return ComponentActions.changeBlindPosition(component, state);
      })
      .catch(function(e) {
        res.json({
          status: 'failed',
          error: e.message
        });
      })
      .then(function(result) {
        res.json(result);
      });
  },
  switchAudio: function(req, res) {
    var state = req.param('state');
    var id = req.param('id');

    if (state !== 'on' && state !== 'off') {
      throw new Error('The state should be "on" or "off"');
    }

    Component.findOne({_id: id}).populate('gpios')
      .exec()
      .then(function(component) {
        if (!component) {
          throw new Error('The component' + id + ' not found');
        }
        if (component && component.type !== 'switchAudio') {
          throw new Error('The component type should be "switchAudio" not "' + component.type + '".');
        }
        if (component && !component.gpios) {
          throw new Error('The component' + id + ' not found');
        }
        if (component && component.gpios && component.gpios.length !== 1) {
          throw new Error('The number of gpios fos the component with id:"' + id + '"should be 1.');
        }

        return ComponentActions.changeOnOffState(component, state, 'out01');
      })
      .catch(function(e) {
        res.json({
          status: 'failed',
          error: e.message
        });
      })
      .then(function(result) {
        console.log(result);
        res.json(result);
      });
  },
  testAC: function(req, res) {
    res.json(true);
  },
  temperatureSensor: function(req, res) {
    var id = req.param('id');

    Component.findOne({_id: id}).populate('gpios')
      .exec()
      .then(function(component) {
        if (!component) {
          throw new Error('The component ' + id + ' not found');
        }
        if (component && component.type !== 'temperatureSensor') {
          throw new Error('The component type should be "temperatureSensor" not "' + component.type + '".');
        }
        if (component && !component.gpios) {
          throw new Error('The component ' + id + ' require gpios.');
        }
        if (component && component.gpios && component.gpios.length !== 1) {
          throw new Error('The number of gpios fos the component with id:"' + id + '"should be 1.');
        }

        return ComponentActions.getDhtSensorTemperature(component);
      })
      .catch(function(e) {
        res.json({
          status: 'failed',
          error: e.message
        });
      })
      .then(function(result) {
        res.json(result);
      });

  },
  luminanceSensor: function(req, res) {
    var id = req.param('id');

    Component.findOne({_id: id}).populate('gpios')
      .exec()
      .then(function(component) {
        if (!component) {
          throw new Error('The component ' + id + ' not found');
        }
        if (component && component.type !== 'luminanceSensor') {
          throw new Error('The component type should be "luminanceSensor" not "' + component.type + '".');
        }
        if (component && !component.gpios) {
          throw new Error('The component ' + id + ' require gpios.');
        }
        if (component && component.gpios && component.gpios.length !== 1) {
          throw new Error('The number of gpios fos the component with id:"' + id + '"should be 1.');
        }

        return ComponentActions.getLuminanceSensor(component);
      })
      .catch(function(e) {
        res.json({
          status: 'failed',
          error: e.message
        });
      })
      .then(function(result) {
        res.json(result);
      });

  },
  get: function(req, res) {
    var filter = req.params.filter || {};
    Component.find(filter).populate('gpios')
      .exec()
      .catch(function(e) {
        res.json({
          status: 'failed',
          error: e.message
        });
      })
      .then(function(result) {
        res.json(result);
      });
  },
  create: function(req, res) {
    var obj = req.body;
    var type = obj.type;
    var ip = obj.ip;
    var name = obj.name;
    var number1 = obj.number1;
    var number2 = obj.number2;
    var number3 = obj.number3;
    var number1Type = 'digital';
    var number2Type = 'digital';
    var number3Type = 'digital';

    if (obj.number1Type) {
      number1Type = obj.number1Type;
    }
    if (obj.number2Type) {
      number2Type = obj.number2Type;
    }
    if (obj.number1Type) {
      number3Type = obj.number3Type;
    }

    if (!type) {
      res.json({
        status: 'failed',
        error: 'The "{type:<switch|switchBlind|switchAudio|dimmer|socket|testAC|temperatureSensor|motionSensor|luminanceSensor>}" is required.'
      });
      return;
    }

    if (!ip) {
      res.json({
        status: 'failed',
        error: 'The "{ip:<ip>}" is required.'
      });
      return;
    }

    var gpios = {
      ip: ip,
      number1: number1,
      number2: number2,
      number3: number3,
      name: name
    };
    switch (obj.type) {
      case 'socket':
        if (!number1) {
          res.json({
            status: 'failed',
            error: 'The "{number1:<number1>}" is required.'
          });
          return;
        }
        self._createSocket(gpios)
          .catch(function(e) {
            res.json({
              status: 'failed',
              error: e.message
            });
          })
          .then(function(result) {
            res.json(result);
          });
        break;
      case 'dimmer':
        if (!number1) {
          res.json({
            status: 'failed',
            error: 'The "{number1:<number1>}" is required.'
          });
          return;
        }
        /*if(!number2){
        	res.json({ status: 'failed', error: 'The "{number2:<number2>}" is required.'});
        	return;
        }*/
        self._createDimmer(gpios)
          .catch(function(e) {
            res.json({
              status: 'failed',
              error: e.message
            });
          })
          .then(function(result) {
            res.json(result);
          });
        break;
      case 'testAC':
        if (!number1) {
          res.json({
            status: 'failed',
            error: 'The "{number1:<number1>}" is required.'
          });
          return;
        }
        self._createTestAC(gpios)
          .catch(function(e) {
            res.json({
              status: 'failed',
              error: e.message
            });
          })
          .then(function(result) {
            res.json(result);
          });
        break;
      case 'temperatureSensor':
        if (!number1) {
          res.json({
            status: 'failed',
            error: 'The "{number1:<number1>}" is required.'
          });
          return;
        }
        self._createTemperatureSensor(gpios)
          .catch(function(e) {
            res.json({
              status: 'failed',
              error: e.message
            });
          })
          .then(function(result) {
            res.json(result);
          });
        break;
      case 'motionSensor':
        if (!number1) {
          res.json({
            status: 'failed',
            error: 'The "{number1:<number1>}" is required.'
          });
          return;
        }
        self._createMovementSensor(gpios)
          .catch(function(e) {
            res.json({
              status: 'failed',
              error: e.message
            });
          })
          .then(function(result) {
            res.json(result);
          });
        break;
      case 'switch':
        if (!number1) {
          res.json({
            status: 'failed',
            error: 'The "{number1:<number1>}" is required.'
          });
          return;
        }
        if (!number2) {
          res.json({
            status: 'failed',
            error: 'The "{number2:<number2>}" is required.'
          });
          return;
        }
        if (!number3) {
          res.json({
            status: 'failed',
            error: 'The "{number3:<number3>}" is required.'
          });
          return;
        }
        self._createSwitch(gpios)
          .catch(function(e) {
            res.json({
              status: 'failed',
              error: e.message
            });
          })
          .then(function(result) {
            res.json(result);
          });
        break;
      case 'switchBlind':
        if (!number1) {
          res.json({
            status: 'failed',
            error: 'The "{number1:<number1>}" for up mode is required.'
          });
          return;
        }
        if (!number2) {
          res.json({
            status: 'failed',
            error: 'The "{number2:<number2>}" for down mode is required.'
          });
          return;
        }
        self._createSwitchBlind(gpios)
          .catch(function(e) {
            res.json({
              status: 'failed',
              error: e.message
            });
          })
          .then(function(result) {
            res.json(result);
          });
        break;
      case 'luminanceSensor':
        if (!number1) {
          res.json({
            status: 'failed',
            error: 'The "{number1:<number1>}" is required.'
          });
          return;
        }
        if (number1Type !== 'analog') {
          res.json({
            status: 'failed',
            error: 'The "number1Type" should be "analog" .'
          });
          return;
        }



        self._createLuminanceSensor(gpios)
          .catch(function(e) {
            res.json({
              status: 'failed',
              error: e.message
            });
          })
          .then(function(result) {
            res.json(result);
          });
        break;
      case 'switchAudio':
        if (!number1) {
          res.json({
            status: 'failed',
            error: 'The "{number1:<number1>}" is required.'
          });
          return;
        }
        self._createSwitchAudio(gpios)
          .catch(function(e) {
            res.json({
              status: 'failed',
              error: e.message
            });
          })
          .then(function(result) {
            res.json(result);
          });
        break;

    }
  },
  destroy: function(req, res) {
    var id = req.param('id');
    var currentComponent;
    if (!id) {
      throw new Error('The id "' + id + '" is required.');
    }

    Component.findOne({_id: id}).populate('gpios')
      .then(function(component) {
        if (!component) {
          throw new Error('The component "' + id + '" not found.');
        }
        currentComponent = component;
        if (component.gpios.length === 1) {
          return Gpio.update({
            id: component.gpios[0].id
          }, {
            owner: null
          });
        }
        if (component.gpios.length === 2) {
          return Gpio.update({
              id: component.gpios[0].id
            }, {
              owner: null
            })
            .then(function() {
              return Gpio.update({
                id: component.gpios[1].id
              }, {
                owner: null
              });
            });
        }
        if (component.gpios.length === 3) {
          return Gpio.update({
              id: component.gpios[0].id
            }, {
              owner: null
            })
            .then(function() {
              return Gpio.update({
                  id: component.gpios[1].id
                }, {
                  owner: null
                })
                .then(function() {
                  return Gpio.update({
                    id: component.gpios[2].id
                  }, {
                    owner: null
                  });
                });
            });
        }

      })
      .then(function(obj) {
        console.log(currentComponent);
        return Component.destroy({
          id: id
        });
      })
      .catch(function(e) {
        res.json({
          status: 'failed',
          error: e.message
        });
      })
      .then(function(result) {
        res.json(result);
      });
  },
  //{ip, number1, number2}
  _createSwitch: function(obj) {
    return self._createComponentGpio('switch', obj.name, obj.ip, {
      number: obj.number1,
      direction: 'out',
      type: 'digital',
      action: 'switch'
    }, {
      number: obj.number2,
      direction: 'out',
      type: 'digital',
      action: 'switch'
    }, {
      number: obj.number3,
      direction: 'in',
      type: 'digital',
      action: 'testAC'
    });
  },
  //{ip, number1, number2}
  _createSwitchBlind: function(obj) {
    return self._createComponentGpio('switchBlind', obj.name, obj.ip, {
      number: obj.number1,
      direction: 'out',
      type: 'digital',
      action: 'up'
    }, {
      number: obj.number2,
      direction: 'out',
      type: 'digital',
      action: 'down'
    });
  },
  //{ip, number1}
  _createSwitchAudio: function(obj) {
    return self._createComponentGpio('switchAudio', obj.name, obj.ip, {
      number: obj.number1,
      direction: 'out',
      type: 'digital'
    });
  },
  //{ip, number1}
  _createDimmer: function(obj) {
    //return self._createComponentGpio('dimmer', obj.name, obj.ip, {number: obj.number1, direction:'out', type: 'digital', action: 'dimmer'}, {number: obj.number2, direction:'in', type: 'digital', action: 'testAC'});
    return self._createComponentGpio('dimmer', obj.name, obj.ip, {
      number: obj.number1,
      direction: 'out',
      type: 'digital',
      action: 'dimmer'
    });
  },
  //{ip, number1}
  _createSocket: function(obj) {
    return self._createComponentGpio('socket', obj.name, obj.ip, {
      number: obj.number1,
      direction: 'out',
      type: 'digital'
    });
  },
  //{ip, number1}
  _createTestAC: function(obj) {
    return self._createComponentGpio('testAC', obj.name, obj.ip, {
      number: obj.number1,
      direction: 'in',
      type: 'digital',
      action: 'testAC'
    });
  },
  //{ip, number1}
  _createTemperatureSensor: function(obj) {
    return self._createComponentGpio('temperatureSensor', obj.name, obj.ip, {
      number: obj.number1,
      direction: 'out',
      type: 'digital'
    });
  },
  _createMotionSensor: function(obj) {
    return self._createComponentGpio('motionSensor', obj.name, obj.ip, {
      number: obj.number1,
      direction: 'out',
      type: 'digital'
    });
  },
  _createLuminanceSensor: function(obj) {
    return self._createComponentGpio('luminanceSensor', obj.name, obj.ip, {
      number: obj.number1,
      direction: 'out',
      type: 'analog'
    });
  },
  _createComponentGpio: function(componentType, name, ip, gpio1, gpio2, gpio3) {


    var componentId;
    var number1 = null;

    if (gpio1 && gpio1.number) {
      number1 = gpio1.number;
    }
    var type1 = null;
    if (gpio1 && gpio1.type) {
      type1 = gpio1.type;
    }
    var number2 = null;
    if (gpio2 && gpio2.number) {
      number2 = gpio2.number;
    }
    var type2 = null;
    if (gpio2 && gpio2.type) {
      type2 = gpio2.type;
    }

    var number3 = null;
    if (gpio3 && gpio3.number) {
      number3 = gpio3.number;
    }
    var type3 = null;
    if (gpio3 && gpio3.type) {
      type3 = gpio3.type;
    }

    var direction1 = null;
    if (gpio1 && gpio1.direction) {
      direction1 = gpio1.direction;
    }
    var direction2 = null;
    if (gpio2 && gpio2.direction) {
      direction2 = gpio2.direction;
    }

    var direction3 = null;
    if (gpio3 && gpio3.direction) {
      direction3 = gpio3.direction;
    }

    var action1 = null;
    if (gpio1 && gpio1.action) {
      action1 = gpio1.action;
    }
    var action2 = null;
    if (gpio2 && gpio2.action) {
      action2 = gpio2.action;
    }

    var action3 = null;
    if (gpio3 && gpio3.action) {
      action3 = gpio3.action;
    }

    return self._checkGpios(ip, gpio1, gpio2, gpio3)
      .then(function() {
        if ((number1 && number2 && (number1 === number2)) ||
          (number2 && number3 && (number2 === number3)) ||
          (number1 && number3 && (number1 === number3))) {
          throw new Error('The gpios should be distints.');
        }

        var objectToCreate = {
          type: componentType,
          name: name
        };

        return Component.create(objectToCreate);
      })
      .then(function(item) {
        componentId = item.id;

        if (number1 && !number2 && !number3) {
          return Gpio.findOne({
              number: number1,
              ip: ip,
              type: type1
            })
            .then(function(found) {

              var objToUpdate = {
                direction: direction1,
                action: action1,
                owner: componentId
              }
              return Gpio.update({
                _id: found.id
              }, objToUpdate);
            });
        }
        if (number1 && number2 && !number3) {
          return Gpio.findOne({
              number: number1,
              ip: ip,
              type: type1
            })
            .then(function(found) {
              if (!found) {
                throw new Error('The gpio' + found.number + ' (' + found.ip + ')  not found.');
              }
              var objToUpdate = {
                direction: direction1,
                action: action1,
                owner: componentId
              }
              return Gpio.update({
                _id: found.id
              }, objToUpdate);
            })
            .then(function() {
              return Gpio.findOne({
                number: number2,
                ip: ip,
                type: type2
              });
            })
            .then(function(found) {
              if (!found) {
                throw new Error('The gpio' + found.number + ' (' + found.ip + ')  not found.');
              }
              var objToUpdate = {
                direction: direction2,
                action: action2,
                owner: componentId
              }
              return Gpio.update({
                _id: found.id
              }, objToUpdate);
            });
        }
        if (number1 && number2 && number3) {
          return Gpio.findOne({
              number: number1,
              ip: ip,
              type: type1
            })
            .then(function(found) {
              if (!found) {
                throw new Error('The gpio' + found.number + ' (' + found.ip + ')  not found.');
              }
              var objToUpdate = {
                direction: direction1,
                action: action1,
                owner: componentId
              }
              return Gpio.update({
                _id: found.id
              }, objToUpdate);
            })
            .then(function() {
              return Gpio.findOne({
                number: number2,
                ip: ip,
                type: type2
              });
            })
            .then(function(found) {
              if (!found) {
                throw new Error('The gpio' + found.number + ' (' + found.ip + ')  not found.');
              }
              var objToUpdate = {
                direction: direction2,
                action: action2,
                owner: componentId
              }
              return Gpio.update({
                _id: found.id
              }, objToUpdate);
            })
            .then(function() {
              return Gpio.findOne({
                number: number3,
                ip: ip,
                type: type3
              });
            })
            .then(function(found) {
              if (!found) {
                throw new Error('The gpio' + found.number + ' (' + found.ip + ')  not found.');
              }
              var objToUpdate = {
                direction: direction3,
                action: action3,
                owner: componentId
              }
              return Gpio.update({
                _id: found.id
              }, objToUpdate);
            });
        }


      })
      .catch(function(e) {
        console.log(e);
        throw e;
      })
      .then(function(a) {
				console.log(componentId);
        return Gpio.find({
          owner: componentId
        }, "_id").then(function(result) {
          var gpios = [];
          if (gpios) {
            result.forEach(function(gpio) {
              gpios.push(gpio._id);
            });
          }
					console.log(gpios);
          return Component.update({
            _id: componentId
          }, {
            gpios: gpios
          }).then(function() {
            return Component.findOne(componentId).populate('gpios');
          });
        });
      });
  },
  _checkGpios: function(ip, gpio1, gpio2, gpio3) {
    var numberToCheck1;
    var numberToCheck2;
    var numberToCheck3;
    var gpio1Type;
    var gpio2Type;
    var gpio3Type;

    if (gpio1 && !gpio2 && !gpio3) {
      numberToCheck1 = gpio1.number;
      gpio1Type = gpio1.type;
    }
    if (gpio1 && gpio2 && !gpio3) {
      numberToCheck1 = gpio1.number;
      gpio1Type = gpio1.type;
      numberToCheck2 = gpio2.number;
      gpio2Type = gpio2.type;
    }
    if (gpio1 && gpio2 && gpio3) {
      numberToCheck1 = gpio1.number;
      gpio1Type = gpio1.type;
      numberToCheck2 = gpio2.number;
      gpio2Type = gpio2.type;
      numberToCheck2 = gpio3.number;
      gpio3Type = gpio3.type;
    }


    if (numberToCheck1 && !numberToCheck2 && !numberToCheck3) {

      return Gpio.findOne({
          ip: ip,
          number: numberToCheck1,
          type: gpio1Type
        })
        .then(function(gpio) {
          if (!gpio) {
            throw new Error('The gpio ' + numberToCheck1 + ' (' + ip + ') not found.');
          }
          if (gpio && gpio.owner) {
            throw new Error('The gpio ' + numberToCheck1 + ' (' + ip + ') is used by ' + gpio.owner);
          }
        });

    }

    if (numberToCheck1 && numberToCheck2 && !numberToCheck3) {
      return Gpio.findOne({
          ip: ip,
          number: numberToCheck1,
          type: gpio1Type
        })
        .then(function(gpio1) {
          if (!gpio1) {
            throw new Error('The gpio' + numberToCheck1 + ' (' + ip + ') not found.');
          }
          if (gpio1 && gpio1.owner) {
            throw new Error('The gpio' + numberToCheck1 + ' (' + ip + ') is used by ' + gpio1.owner);
          }

          return Gpio.findOne({
            ip: ip,
            number: numberToCheck2,
            type: gpio2Type
          });
        })
        .then(function(gpio2) {
          if (!gpio2) {
            throw new Error('The gpio' + numberToCheck2 + ' (' + ip + ') not found.');
          }
          if (gpio2 && gpio2.owner) {
            throw new Error('The gpio' + numberToCheck2 + ' (' + ip + ') is used by ' + gpio2.owner);
          }
        });
    }


    if (numberToCheck1 && numberToCheck2 && numberToCheck3) {
      return Gpio.findOne({
          ip: ip,
          number: numberToCheck1,
          type: gpio1Type
        })
        .then(function(gpio1) {
          if (!gpio1) {
            throw new Error('The gpio' + numberToCheck1 + ' (' + ip + ') not found.');
          }
          if (gpio1 && gpio1.owner) {
            throw new Error('The gpio' + numberToCheck1 + ' (' + ip + ') is used by ' + gpio1.owner);
          }

          return Gpio.findOne({
            ip: ip,
            number: numberToCheck2,
            type: gpio2Type
          });
        })
        .then(function(gpio2) {
          if (!gpio2) {
            throw new Error('The gpio' + numberToCheck2 + ' (' + ip + ') not found.');
          }
          if (gpio2 && gpio2.owner) {
            throw new Error('The gpio' + numberToCheck2 + ' (' + ip + ') is used by ' + gpio2.owner);
          }
          return Gpio.findOne({
            ip: ip,
            number: numberToCheck3,
            type: gpio3Type
          });
        })
        .then(function(gpio3) {
          if (!gpio3) {
            throw new Error('The gpio' + numberToCheck3 + ' (' + ip + ') not found.');
          }
          if (gpio3 && gpio3.owner) {
            throw new Error('The gpio' + numberToCheck3 + ' (' + ip + ') is used by ' + gpio3.owner);
          }
        });
    }

  }
};


module.exports = self;
