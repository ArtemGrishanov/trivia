import React from 'react'
import { shallow } from 'enzyme'

import { Progress, ProgressArrowItem, ProgressDotItem } from './../Progress'

describe('<Progress />', () => {
    let wrapper
    let props

    beforeAll(() => {
        props = {
            step: 2,
            max: 5,
            fontSize: 14,
            color: 'green',
        }
    })

    it('should match <Progress /> snapshot as variant0', () => {
        wrapper = shallow(<Progress {...props} variant="variant0" />)
        expect(wrapper).toMatchSnapshot()
    })
    it('should match <Progress /> snapshot as variant1', () => {
        wrapper = shallow(
            <Progress
                {...props}
                text="Progress:"
                variant="variant1"
                progressText="Progress:"
                background="#f3f3f3"
                completionBackground="#c5e5e5"
                borderColor="#000"
                borderRadius={5}
                borderWidth={1}
                width={32}
            />,
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('should match <Progress /> snapshot as variant2', () => {
        wrapper = shallow(<Progress {...props} variant="variant2" color="grey" completionColor="blue" />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should match <Progress /> snapshot as variant3', () => {
        wrapper = shallow(<Progress {...props} variant="variant3" color="grey" radius={10} completionColor="blue" />)
        expect(wrapper).toMatchSnapshot()
    })
})

describe('<ProgressArrowItem />', () => {
    let wrapper
    let props

    beforeAll(() => {
        props = {
            height: 16,
            width: 125,
            color: 'grey',
            completionColor: 'blue',
            isFirst: false,
            isLast: false,
            isCompleted: false,
        }
    })

    it('should match snapshot', () => {
        wrapper = shallow(<ProgressArrowItem {...props} />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should match <ProgressArrowItem /> snapshot when it is first', () => {
        wrapper = shallow(<ProgressArrowItem {...props} isFirst={true} />)
        expect(wrapper).toMatchSnapshot()
    })
    it('should match <ProgressArrowItem /> snapshot when it is last', () => {
        wrapper = shallow(<ProgressArrowItem {...props} isLast={true} />)
        expect(wrapper).toMatchSnapshot()
    })
    it('should match <ProgressArrowItem /> snapshot when it is completed', () => {
        wrapper = shallow(<ProgressArrowItem {...props} isCompleted={true} />)
        expect(wrapper).toMatchSnapshot()
    })
})

describe('<ProgressDotItem />', () => {
    let wrapper
    let props

    beforeAll(() => {
        props = {
            radius: 10,
            color: 'grey',
            completionColor: 'blue',
            isCompleted: false,
        }
    })

    it('should match snapshot', () => {
        wrapper = shallow(<ProgressDotItem {...props} />)
        expect(wrapper).toMatchSnapshot()
    })
    it('should match <ProgressDotItem /> snapshot when it is completed', () => {
        wrapper = shallow(<ProgressDotItem {...props} isCompleted={true} />)
        expect(wrapper).toMatchSnapshot()
    })
})
