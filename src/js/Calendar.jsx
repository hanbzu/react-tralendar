var React = require('react'),
    moment = require('moment'),
    Immutable = require('immutable'),
    assign = require('object-assign')


var Day = React.createClass({
  render: function() {
    var dayNum = this.props.date ? parseInt(this.props.date.substring(8)) : 'padding',
        onClick = this.props.onClick !== undefined ? this.props.onClick.bind(this, this.props.date) : undefined
    return (
      <li className={this.props.className} onClick={onClick} >
        {dayNum}
      </li>
    )
  }
})

var Month = React.createClass({
  render: function() {

    var dayOne = moment(this.props.dayList.get(0).date, 'YYYY-MM-DD')

    // As many undefined items as additional days are in the first week
    function dayPadding() {
      var weekdayOne = moment(dayOne).weekday(0)
      if (dayOne != weekdayOne)
        return Immutable.Range(0, dayOne.diff(weekdayOne, 'days'))
                 .map(function(_) {
                    return <Day key={'blank' + _} className={'blank'} />
                  })
                 .toList()
      else
        return Immutable.List()
    }

    var dayListItems = this.props.dayList.map(function(_) {
          return <Day key={_.date}
                      date={_.date}
                      className={_.className}
                      onClick={_.onClick} />
        })

    return (
      <li>
        <h1 className="monthname">{dayOne.format('MMMM')}</h1>
        <ol>
          {dayPadding().concat(dayListItems)}
        </ol>
      </li>
    )  
  }
})

var Calendar = React.createClass({

  // Day map is a map of dates classified by month
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
          insert(assign({ date: day, onClick: props.onClick }, props.data.get(day)))
        else
          insert({ date: day, className: 'disabled' })
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
