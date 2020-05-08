import ProgressiveImage from './ProgressiveImage'
import React from 'react'

const mainStyleClass = 'rmx-memory'

export default class MemoryCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.props.clickHandler(this.props)
    }

    render() {
        const { width, relationKey } = this.props
        const cardStyles = {
            width: `${width}px`,
            height: `${width}px`,
        }
        return (
            <div onClick={this.handleClick} style={cardStyles} className={`${mainStyleClass}-card`}>
                {relationKey}
                <ProgressiveImage left={0} top={0} {...this.props} />
            </div>
        )
    }
}
