import ProgressiveImage from './ProgressiveImage'
import React from 'react'

const mainStyleClass = 'rmx-memory'

function MemoryImage({ src, width, height, isInlineBlock }) {
    const st = {
        width: width || '100%',
        height: height || '100%',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: '50%',
    }
    if (isInlineBlock) {
        st.display = 'inline-block'
    }
    return <div className={`${mainStyleClass}-image`} style={st}></div>
}

export default class MemoryCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isActive: false,
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState({
            isActive: true,
        })
        this.props.clickHandler({ ...this.props, ...this.state })
    }

    render() {
        const { isActive } = this.state
        const { src, backCoverSrc, width, padding, relationKey } = this.props
        const cardStyles = {
            width: width,
            padding: padding,
            height: `100%`,
        }
        return (
            <div onClick={this.handleClick} style={cardStyles} className={`${mainStyleClass}-card`}>
                {isActive ? (
                    <MemoryImage left={1} top={0} src={src} />
                ) : (
                    <MemoryImage left={1} top={0} src={backCoverSrc} />
                )}
            </div>
        )
    }
}
