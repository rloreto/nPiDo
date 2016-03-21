'use strict';
var React = require('react');
import {Button, IconButton} from 'react-toolbox/lib/button';
var Component = require('../entities/component.js');
var ComponentsActions = require('../actions/componentsActions.js');

/**
 * Represents one list item and triggers the following actions
 *
 * @completeTodo TodoActions#completeTodo->#onCompleteTodo
 * @removeTodo TodoActions#removeTodo->onRemoveTodo
 */
var ComponentList = React.createClass({
    displayName: 'Component',
    propTypes: {
        component: React.PropTypes.instanceOf(Component).isRequired
    },
    getInitialState: function () {
      return {
        isActive: this.props.component.isActive
      };
    },
    removeComponent: function () {
      ComponentsActions.removeComponent(this.props.component.id);
    },
    changeComponentState: function () {
      this.state.isActive = !this.state.isActive ;
      ComponentsActions.changeComponentState(this.props.component, this.state.isActive );
    },
    render: function () {
      return (
        <div>
          <Button icon='bookmark' label={this.props.component.name} key={this.props.component.id} data-id={this.props.component.id} accent raised={this.state.isActive  || this.props.component.isActive} onClick={this.changeComponentState}/>
          <Button icon='delete' label='Delete' flat onClick={this.removeComponent}/>
        </div>
      );
    }
});

module.exports = ComponentList;
