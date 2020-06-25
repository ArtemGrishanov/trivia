import React, { useState } from 'react'
import { setComponentProps } from '../remix'
import DataSchema from '../schema'
import RemixWrapper from './RemixWrapper'
import { Input } from '../engage-ui/primitives/Input'
import { Button } from '../engage-ui/primitives/Button'
import { TextEditor } from '../engage-ui/bricks/TextEditor'

import './style/user-data-form.css'

const UserDataForm = ({ id, doubleClicked, firstNameField, lastNameField, phoneField, emailField, needTitle }) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [licenseAgreement, setLicenseAgreement] = useState(false)

    const setData = () => {
        setComponentProps({
            id,
            data: {
                firstName,
                lastName,
                email,
                phone,
            },
        })
    }

    const checkFormCompletion = () => {
        const isFirstName = firstNameField ? firstName !== '' : true
        const isLastName = lastNameField ? lastName !== '' : true
        const isPhone = phoneField ? phone !== '' : true
        const isEmail = emailField ? email !== '' : true

        return licenseAgreement && isFirstName && isLastName && isPhone && isEmail
    }

    return (
        <div className="user-data-form clipped">
            <div className="user-data-form__content">
                {needTitle ? (
                    <div className="user-data-form__title">
                        <TextEditor
                            parentId={id}
                            readOnly={!doubleClicked}
                            text={`<span class="ql-size-huge ql-font-Roboto" style="color: #000000">Your title</span>`}
                        />
                    </div>
                ) : null}
                {firstNameField ? (
                    <div className="user-data-form__text-input">
                        <Input
                            description="First name"
                            dataType="any"
                            dataSize={128}
                            width={252}
                            height={83}
                            setValue={setFirstName}
                        />
                    </div>
                ) : null}
                {lastNameField ? (
                    <div className="user-data-form__text-input">
                        <Input
                            description="Last name"
                            dataType="any"
                            dataSize={128}
                            width={252}
                            height={83}
                            setValue={setLastName}
                        />
                    </div>
                ) : null}
                {phoneField ? (
                    <div className="user-data-form__text-input">
                        <Input
                            description="Phone"
                            dataType="phone"
                            dataSize={32}
                            width={252}
                            height={83}
                            setValue={setPhone}
                        />
                    </div>
                ) : null}
                {emailField ? (
                    <div className="user-data-form__text-input">
                        <Input
                            description="Email"
                            dataType="email"
                            dataSize={64}
                            width={252}
                            height={83}
                            setValue={setEmail}
                        />
                    </div>
                ) : null}
                <div className="user-data-form__submit" onClick={checkFormCompletion() ? setData : void 0}>
                    <Button
                        width={252}
                        height={44}
                        text={`<p class="ql-align-center"><span class="ql-size-large ql-font-Roboto" style="color: #FFFFFF">Next</span></p>`}
                        imageSrc={''}
                        borderRadius={4}
                        borderWidth={0}
                        borderColor=""
                        backgroundColor={checkFormCompletion() ? '#2990FB' : '#BCBCBC'}
                        styleVariant="none"
                        sizeMod="normal"
                        // doubleClicked={doubleClicked}
                        id={`${id}_submitButton`}
                    />
                </div>
                <div className="user-data-form__agree">
                    <input type="checkbox" onChange={event => setLicenseAgreement(event.target.checked)} />
                    <span>
                        Agree with{' '}
                        <a onClick={() => window.open('https://interacty.me/privacy-policy')}>Privacy Policy</a>
                    </span>
                </div>
            </div>
        </div>
    )
}

const schema = {
    needTitle: {
        type: 'boolean',
        default: true,
    },
    firstNameField: {
        type: 'boolean',
        default: true,
    },
    lastNameField: {
        type: 'boolean',
        default: true,
    },
    phoneField: {
        type: 'boolean',
        default: false,
    },
    emailField: {
        type: 'boolean',
        default: false,
    },
    data: {
        type: 'object',
        default: {},
    },
}

export const Schema = new DataSchema(schema)

export default RemixWrapper(UserDataForm, Schema, 'UserDataForm')
