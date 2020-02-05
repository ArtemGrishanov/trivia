import React from 'react'

// https://github.com/zenoamaro/react-quill
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

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
    }

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],                  // toggled buttons
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'clean']
        ]
    }

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
    }
}

export default TextEditor