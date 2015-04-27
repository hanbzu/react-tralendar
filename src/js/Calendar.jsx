var React = require('react'),
    moment = require('moment'),
    Immutable = require('immutable'),
    assign = require('object-assign')


var Day = React.createClass({
  render: function() {
    return (
      <li className={this.props.className}>
        {this.props.dayNum}
      </li>
    )
  }
})

var Month = React.createClass({
  render: function() {

    var firstDay = moment(this.props.dayList.get(0).date, 'YYYY-MM-DD'),
        monthReadable = firstDay.format('MMMM')

    var dayListItems = this.props.dayList.map(function(_) {
          var key = _.date,
              dayNum = parseInt(_.date.substring(8)),
              className = _.chosen ? 'chosen' : ''
          return <Day key={key} dayNum={dayNum} chosen={className} />
        })

    return (
      <li>
        <h1 className="monthname">{monthReadable}</h1>
        <ol>
          {dayListItems}
        </ol>
      </li>
    )  
  }
})

var Calendar = React.createClass({

  _dayMap: function(props) {

    var starts = moment(props.starts, 'YYYY-MM-DD'),
        dayMap = Immutable.Map()

    function extendedSpan() {
      var last = starts.clone().add(props.span, 'days').endOf('month').endOf('day')
      return last.diff(starts, 'days') + 1
    }

    Immutable.Range(0, extendedSpan())
      .forEach(function(n) {
        function insert(_) {
          var month = _.date.substring(0, 7), // YYYY-MM
              updatedDateList = dayMap.has(month) ?
                dayMap.get(month).push(_) :
                Immutable.List.of(_)
          dayMap = dayMap.set(month, updatedDateList)
        }
        var day = starts.clone().add(n, 'days').format('YYYY-MM-DD')
        if (props.data.has(day))
          insert(props.data.get(day))
        else
          insert({ date: day })
      })

    return dayMap
  },

  render: function() {
    var dayMap = this._dayMap(this.props)
    var listItems = dayMap.keySeq().map(function(month) {
      return <Month key={month} dayList={dayMap.get(month)} />
    })

    return (
      <ol className="tralendar">
        {listItems}
      </ol>
    )
  }
})

module.exports = Calendar
