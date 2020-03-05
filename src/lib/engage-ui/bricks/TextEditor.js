import React from 'react'

// https://github.com/zenoamaro/react-quill
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import '../style/rmx-text_editor.css';

const
    // To add a new font:
    // 1. Add font into this array
    // 2. Add classes in rmx-text_editor.css
    fonts = ['Ubuntu', 'Inconsolata', 'Roboto', 'Mirza', 'Arial'],
    importedFonts = {
        // 'Ubuntu': true | false
        // ...
    };

// https://github.com/zenoamaro/react-quill/issues/273
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = [...fonts];
ReactQuill.Quill.register(Font, true);

function getStylesheetLink(family) {
    return `https://fonts.googleapis.com/css?family=${family}`;
}

function addFont(family) {
    if (!importedFonts[family]) {
        const link = document.createElement('link');
        link.href = getStylesheetLink(family);
        link.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].append(link);
        importedFonts[family] = true;
    }
}

class TextEditor extends React.Component {

    static getDerivedStateFromProps(props, state) {
        return {
            ...state,
            // props.onChange - значит родитель извне управляет текстом
            stateText: props.onChange ? props.text: state.stateText
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            stateText: props.text
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {
        if (this.props.onChange) {
            // отправить изменение вверх родительскому компоненту
            // он позаботится о сохранении значения и вернет его через props.text
            this.props.onChange(value);
        }
        else {
            this.setState({ stateText: value })
        }
        // import font which is used in app
        fonts.forEach( f => {
            if (value.indexOf(`ql-font-${f}`) >= 0) {
                addFont(f);
            }
        })
    }

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],                   // toggled buttons
            [{ 'size': ['small', false, 'large', 'huge' ] }],  // custom dropdown
            [{ 'color': [] }, { 'background': [] }],           // dropdown with defaults from theme
            [{ 'font': [ 'Ubuntu', 'Inconsolata', 'Roboto', 'Mirza', 'Arial' ] }],
            [{ 'align': [] }],
            ['link', 'clean']
        ]
    }

    // 1. when you open editor first time in edit mode import all fonts
    // 2. always - check which fonts is used and add styles dynamically
    render() {
        return (
            <div className={`rmx-text-editor ${this.props.readOnly ? '__readonly' : ''}`}>
                <ReactQuill readOnly={this.props.readOnly}
                            modules={this.modules}
                            value={this.state.stateText}
                            onChange={this.handleChange} />
            </div>
        )
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        if (!this.props.readOnly) {
            // import all fonts in edit mode
            fonts.forEach( f => addFont(f));
        }
    }
}

export default TextEditor