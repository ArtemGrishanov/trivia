/*IFTRUE_isMemory*/
import React from 'react'

const mainStyleClass = 'rmx-memory'

export const backCoverImgBase64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC+ZpjcAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAACxfSURBVHgB7d1djFzlmeDxU9W2AZtkzGRjZoRHY6JdzIK90pK1g7RKlhm0UhKv0EoTI80dcxvfLlxOnNuwF3OxcBuushLW3qCY5IYZK9GuCGiY0fAhnNUCoxCNYjQDSrDB3e6qradOn+7qU6fK1V1vVZ1T9ftJHfeX7f4wXf+873Pe0/q3f7XRzQAASKXbzgAASEpgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABITWAAAiQksAIDEBBYAQGICCwAgMYEFAJCYwAIASExgAQAkJrAAABI7kNVMu5Vla638+bX2zvPtgecL8XJ7BonY6WTZZnfn5Xg+Xjf48ubWyxudDABgl+SBVQRSxNHBta3nW0UgtfK3t3fep4imeN8m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\n'

const noSrcImageBase64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC+ZpjcAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABJrSURBVHgB7d0LU1NJGsfhE+7iDa35/h8REC8BUbPzxjkzFouK8E9yus/zVKVqa2t2iOCan93v6V6cn5+vBgAAUlZ7AwAAUQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsA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Kqo8gUVvlsvlsL+/b+gdnkBgwSPVVmANBZ+dnQ0A8COBBY+0WCw8cQXAvcxgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUMAGQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIE1gAAGECCwAgTGABAIQJLACAMIEFABAmsAAAwgQWAECYwAIACBNYAABhAgsAIExgAQCECSwAgDCBBQAQJrAAAMIEFgBAmMACAAgTWAAAYQILACBMYAEAhAksAIAwgQUAECawAADCBBYAQJjAAgAIOxgAANqxGqZv9T81/6m4jM+kuwAAAABJRU5ErkJggg==\n'

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
                <FlipCard isActive={isActive} src={src} backCoverSrc={backCoverSrc} />
            </div>
        )
    }
}

function FlipCard({ isActive, src, backCoverSrc }) {
    return (
        <div className={`${mainStyleClass}-image flip-card ${isActive ? 'active' : ''}`}>
            <div className="flip-card-inner">
                <div className="flip-card-front" style={{ backgroundImage: `url(${backCoverSrc})` }}></div>
                <div className="flip-card-back" style={{ backgroundImage: `url(${src || noSrcImageBase64})` }}></div>
            </div>
        </div>
    )
}
/*FITRUE_isMemory */
