'use strict';
var Reflux = require('reflux');
var _ = require('underscore');
var request = require('superagent');
var Component = require('../entities/component.js');
var ComponentsActions = require('../actions/componentsActions.js');

/**
 * Store handles all logic related to Todo Data.
 * Such as adding, removing, and toggling of one or multiple Todos
 *
 * The store listens to actions triggered by TodoActions
 */
var TodoListStore = Reflux.createStore({
    listenables: [ComponentsActions],
    init: function () {
        this.listenTo(ComponentsActions.load, this.fetchData);
    },
    getInitialState: function () {
        this.list = [];
        return this.list;
    },
    fetchData: function () {
        request.get('/api/components', function (obj,res) {
            var components = JSON.parse(res.text);
            this.list = components.map(function (component) {
                 return new Component(component._id, component.name, component.type, component.value, component.gpios);
             });
            this.trigger(this.list);
        }.bind(this));
    },
    onAddTodo: function (todo) {
        this.updateList([
            new Todo(this.todoCounter++, todo, false, new Date())
        ].concat(this.list));
    },
    onRemoveComponent: function (id) {
        var list = _.reject(this.list, function (item) {
            return item.id === id;
        });


        this.updateList(list);
    },
    onChangeComponentState: function (component) {
      var item = _.find(this.list, function (item) {
          return item.id === component.id;
      });

      item.isActive = !component.isActive;
      this.updateList(this.list);
    },
    onResortList: function (from, to) {
        var y = _.find(this.list, function (todo) { return todo.key === to; });
        var x = _.find(this.list, function (todo) { return todo.key === from; });

        var list = _.compact(this.list.move(_.indexOf(this.list, y), _.indexOf(this.list, x)));
        this.updateList(list);
    },
    updateList: function (list) {
        this.list = list;
        this.trigger(list);
    }
});

module.exports = TodoListStore;
