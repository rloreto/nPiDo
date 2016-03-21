'use strict';

/**
 * Basic Todo model.
 *
 * @key Number Internal id
 * @title String Represents what to do
 * @isChecked Determines if a Todo is completed
 * @createdAt When the Todo was created.
 */
var Component = function (id, name, type, value, gpios) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.isActive = value===1?true:false;
    this.gpios = gpios;
};

module.exports = Component;
