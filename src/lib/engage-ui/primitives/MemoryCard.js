import React from 'react'

const mainStyleClass = 'rmx-memory'

export default class MemoryCard extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.props.clickHandler(this.props)
    }

    render() {
        const { src, backCoverSrc, width, padding, isActive } = this.props
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
