var React = require('react');
var Reflux = require('reflux');

var ComponentItem = require('./componentItem');
var ComponentsActions = require('../actions/componentsActions');

var ComponentList = React.createClass({

  propTypes: {
    components: React.PropTypes.array
  },
  render: function() {
    if (this.props && this.props.components && this.props.components.length) {
      var items = this.props.components.map(function (component) {
          return <ComponentItem  component={component} key={component.id} />;
      });

      return (
        <div>{items}</div>
      );
    } else {
      return (
        <div className="empty-list">There is nothing here! Why dont you add something?</div>
      );
    }
  }
});

module.exports = ComponentList;
