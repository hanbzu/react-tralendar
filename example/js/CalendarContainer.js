var React = require('react'),
    Immutable = require('immutable')

// Remove relative path when used as NPM package
var Calendar = require('../../src/')

var CalendarContainer = React.createClass({

  getInitialState: function() {

    var events = Immutable.Map({
      '2015-04-30': {
      },
      '2015-05-25': {
        className: 'chosen', // If we want it to be labeled 'chosen'
        extra: 'bla' // Any extra information to be displayed along the date 
      },
      '2015-05-26': {
      },
      '2015-05-28': {
      }
    })

    return {
      data: events,
      starts: '2015-04-29',
      span: 30,
      onClick: function(_) { console.log('click! ', _) }
    }
  },

  render: function() {
    return <Calendar data={this.state.data}
                     starts={this.state.starts}
                     span={this.state.span}
                     onClick={this.state.onClick} />
  }
})

module.exports = CalendarContainer