var React = require('react');
var Reflux = require('reflux');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var ComponentList = require('./componentList');
var ComponentStore = require('../stores/componentStore');
var ComponentsActions = require('../actions/componentsActions');

var ImageGrid = React.createClass({
  mixins: [Reflux.connect(ComponentStore, "list")],
  componentDidMount: function () {
      ComponentsActions.load();
  },
  render: function() {
      return (
        <section>
          <h5>Components</h5>
          <ComponentList components={this.state.list}/>
       </section>
      );
  }
});

module.exports = ImageGrid;
