import React from 'react'
import { shallow } from 'enzyme'

import { TextEditor, getStylesheetLink, addFont } from './../TextEditor'

import store from './../../../../store'
import Remix from './../../../../lib/remix'

describe('<TextEditor />', () => {
    let wrapper
    let props

    beforeAll(() => {
        props = {
            readOnly: true,
            text: `
                <p class="ql-align-center">
                    <strong class="ql-size-huge" style="color: rgb(255, 255, 255);">ARE YOU GOOD AT GEOGRAPHY?</strong>
                </p>`,
        }
        Remix.setStore(store)
    })

    it('should match <TextEditor /> snapshot', () => {
        wrapper = shallow(<TextEditor {...props} />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should match <TextEditor /> snapshot in readOnly mode', () => {
        wrapper = shallow(<TextEditor {...props} readOnly={false} />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should change font familly', () => {
        const newText = `
            <p class="ql-align-center">
                <strong class="ql-size-huge ql-font-Yeseva-One" style="color: rgb(255, 255, 255);">ARE YOU GOOD AT GEOGRAPHY?</strong>
            </p>`
        wrapper = shallow(<TextEditor {...props} />)
        const instance = wrapper.instance()
        instance.handleChange(newText)
        expect(wrapper.state().html).toEqual(newText)
        expect(wrapper.find('Quill').props().value).toEqual(newText)
    })
})

describe('getStylesheetLink', () => {
    it('should be equal fontFamily', () => {
        const fontFamily = 'SupaFont'
        const link = `https://fonts.googleapis.com/css?family=${fontFamily}`
        expect(getStylesheetLink(fontFamily)).toEqual(link)
    })
})

describe('addFont', () => {
    it('should add font', () => {
        const fontFamily = 'SupaFont'
        const link = `<link href="https://fonts.googleapis.com/css?family=${fontFamily}" rel="stylesheet">`
        addFont(fontFamily)
        expect(document.getElementsByTagName('head')[0].innerHTML).toEqual(link)
    })
})
