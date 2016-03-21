'use strict';

var Reflux = require('reflux');
var request = require('superagent');



var ComponentsActions = Reflux.createActions([
    "load",
    "addComponent",
    "removeComponent",
    "changeComponentState",
    "resortList"
]);

ComponentsActions.addComponent.preEmit = function (component) {
    request.post('/api/componets', {component: component}, function () {});
};

ComponentsActions.removeComponent.preEmit = function (id) {
    request.del('/api/components/'+id, function () {});
};

ComponentsActions.changeComponentState.preEmit = function (component, targetState) {
  var changedComponenState = targetState ? 'on':'off'
  var type = 'low';
  if(component.type==='switchAudio'){
    type = 'hight';
  }
  request.put('api/components/'+ component.type + '/' + component.id,  {state: changedComponenState, type: 'low'},function () {});
};



module.exports = ComponentsActions;