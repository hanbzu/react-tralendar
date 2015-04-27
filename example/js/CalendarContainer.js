var React = require('react'),
    Immutable = require('immutable')

// Remove relative path when used as NPM package
var Calendar = require('../../src/')

var CalendarContainer = React.createClass({

  getInitialState: function() {

    var events = Immutable.List.of(
      {
        date: '2015-05-25',
        chosen: true, // It can be true or false/undefined
        extra: 'bla' // Any extra information to be displayed along the date 
      },
      {
        date: '2015-05-26'
      }
    )

    return {
      data: events,
      starts: '2015-04-26',
      span: 30
    }
  },

  render: function() {
    return <Calendar data={this.state.data} starts={this.state.starts} span={this.state.span} />
  }
})

module.exports = CalendarContainer