import React from 'react'

export default class ResultBlock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onRestartClick = this.onRestartClick.bind(this)
  }

  onRestartClick() {
    if (this.props.onRestart) {
      this.props.onRestart()
    }
  }

  render() {
    return (
      <div className="eng-result-slide">
        <p>{this.props.title}</p>
        <p>{this.props.description}</p>
        <div>
          <button className="rmx-button __white" onClick={this.onRestartClick}>
            Начать заново
          </button>
        </div>
      </div>
    )
  }
}
