import React from 'react'
import { setComponentProps } from '../../remix'

// https://github.com/zenoamaro/react-quill
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import '../style/rmx-text_editor.css'

const // To add a new font:
    // 1. Add font into this array
    // 2. Add classes as UpperCamelCase in rmx-text_editor.css
    fonts = [
        'Roboto',
        'Roboto Condensed',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Oswald',
        'Merriweather',
        'Ubuntu',
        'Lobster',
        'Pacifico',
        'Vollkorn',
        'Cuprum',
        'Alegreya Sans',
        'Russo One',
        'Playfair Display SC',
        'Alice',
        'Press Start 2P',
        'Bad Script',
        'Yeseva One',
        'Marmelad',
        'Rubik Mono One',
    ],
    importedFonts = {
        // 'Ubuntu': true | false
        // ...
    }

// https://github.com/zenoamaro/react-quill/issues/273
const Font = ReactQuill.Quill.import('formats/font')
Font.whitelist = fonts.map(f => f.replace(/ /g, ''))
ReactQuill.Quill.register(Font, true)

export function getStylesheetLink(family) {
    return `https://fonts.googleapis.com/css?family=${family}`
}

export function addFont(family) {
    if (!importedFonts[family]) {
        const link = document.createElement('link')
        link.href = getStylesheetLink(family)
        link.rel = 'stylesheet'
        document.getElementsByTagName('head')[0].append(link)
        importedFonts[family] = true
    }
}

export class TextEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            html: props.text,
        }
        this.handleChange = this.handleChange.bind(this)
        this.contentRef = React.createRef()
        this.measureInterval = null
        this.measuredRect = {}
    }

    handleChange(html) {
        this.setState({ html })
        // import font which is used in app
        fonts.forEach((f, i) => {
            if (html.includes(`ql-font-${Font.whitelist[i]}`)) {
                addFont(f)
            }
        })
    }

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline'], // toggled buttons
            [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: Font.whitelist }],
            [{ align: [] }],
            ['link', 'clean'],
        ],
    }

    // 1. when you open editor first time in edit mode import all fonts
    // 2. always - check which fonts is used and add styles dynamically
    render() {
        const { readOnly, className } = this.props
        return (
            <div className={`rmx-text-editor ${readOnly ? '__readonly' : ''} ${className}`} ref={this.contentRef}>
                <ReactQuill
                    readOnly={readOnly}
                    modules={this.modules}
                    value={this.state.html}
                    onChange={this.handleChange}
                />
            </div>
        )
    }

    componentDidMount() {
        if (this.props.getContentRect) {
            if (this.contentRef && this.contentRef.current) {
                //TODO попробовать react-size-me в будущем как, возможно, более производительное решение. Хотя этот код измерения текста запускается очень редко и не стоит добавлять лишние библиотеки
                this.measureInterval = setInterval(() => {
                    const { width, height } = this.contentRef.current.getBoundingClientRect()
                    //TODO эксперимент - нужна только высота. Пробую убрать ширину.
                    if (/*this.measuredRect.width !== width ||*/ this.measuredRect.height !== height) {
                        this.measuredRect = { /*width,*/ height }
                        this.props.getContentRect({ /*width,*/ height })
                    }
                }, 400)
            }
        }
    }

    componentWillUnmount() {
        if (this.measureInterval) {
            clearInterval(this.measureInterval)
        }
    }

    componentDidUpdate({ readOnly: prevReadOnly }) {
        const { readOnly, parentId } = this.props
        if (!readOnly) {
            // import all fonts in edit mode
            fonts.forEach(f => addFont(f))
            const { getContentRect } = this.props
            if (getContentRect && this.contentRef && this.contentRef?.current) {
                getContentRect(this.contentRef.current.getBoundingClientRect())
            }
        }
        if (!prevReadOnly && readOnly) {
            // выход из режима ввода текста - делаем сохранение в remix
            setComponentProps(
                {
                    id: this.props.parentId,
                    text: this.state.html,
                },
                { putStateHistory: true },
            )
        }
    }
}

export default TextEditor
