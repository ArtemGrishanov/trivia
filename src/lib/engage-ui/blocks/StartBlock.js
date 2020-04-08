import React from 'react'

/**
 * Блок старта приложения
 */
export default class StartBlock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="">
        <p>Start title</p>
        <p>Description text</p>
        <button className="rmx-button" onClick={() => this.props.onStart()}>
          Start
        </button>
      </div>
    )
  }
}
