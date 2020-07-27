import React from 'react'
import { setComponentProps } from '../remix'
import DataSchema from '../schema'
import RemixWrapper from './RemixWrapper'
import { Input } from './primitives/Input'
import { Button } from './primitives/Button'
import { TextEditor } from './bricks/TextEditor'
// import BasicImage from './bricks/BasicImage'
import { getTranslation } from './translations'

import './style/rmx-user-data-form.css'

class UserDataForm extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseAgreement: false,
    }

    setFirstName = value => this.setState({ ...this.state, firstName: value })

    setLastName = value => this.setState({ ...this.state, lastName: value })

    setEmail = value => this.setState({ ...this.state, email: value })

    setPhone = value => this.setState({ ...this.state, phone: value })

    setLicenseAgreement = value => this.setState({ ...this.state, licenseAgreement: value })

    setData = () => {
        const { id } = this.props
        const { firstName, lastName, email, phone } = this.state

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

    checkFormCompletion = () => {
        const { firstNameField, lastNameField, phoneField, emailField } = this.props
        const { firstName, lastName, email, phone, licenseAgreement } = this.state

        const isFirstName = firstNameField ? firstName !== '' : true
        const isLastName = lastNameField ? lastName !== '' : true
        const isPhone = phoneField ? phone !== '' : true
        const isEmail = emailField ? email !== '' : true

        return licenseAgreement && isFirstName && isLastName && isPhone && isEmail
    }

    componentDidMount() {
        // console.log(window)
    }

    render() {
        const {
            id,
            doubleClicked,
            firstNameField,
            lastNameField,
            phoneField,
            emailField,
            needTitle,
            authorPrivacyPolicy,
        } = this.props

        return (
            <div className="user-data-form clipped">
                <div className="user-data-form__bg">
                    {/* <BasicImage
                        width={this.props.width}
                        height={this.props.height}
                        backgroundSize={'cover'}
                        blur={false}
                        grayscale={false}
                        borderRadius={4}
                        borderColor="#"
                        borderWidth={0}
                        backgroundColor="#ffffff"
                    ></BasicImage> */}
                </div>
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
                                description={getTranslation('firstName')}
                                dataType="any"
                                dataSize={128}
                                width={252}
                                height={83}
                                setValue={this.setFirstName}
                            />
                        </div>
                    ) : null}
                    {lastNameField ? (
                        <div className="user-data-form__text-input">
                            <Input
                                description={getTranslation('lastName')}
                                dataType="any"
                                dataSize={128}
                                width={252}
                                height={83}
                                setValue={this.setLastName}
                            />
                        </div>
                    ) : null}
                    {phoneField ? (
                        <div className="user-data-form__text-input">
                            <Input
                                description={getTranslation('phone')}
                                dataType="phone"
                                dataSize={32}
                                width={252}
                                height={83}
                                setValue={this.setPhone}
                            />
                        </div>
                    ) : null}
                    {emailField ? (
                        <div className="user-data-form__text-input">
                            <Input
                                description={getTranslation('email')}
                                dataType="email"
                                dataSize={64}
                                width={252}
                                height={83}
                                setValue={this.setEmail}
                            />
                        </div>
                    ) : null}
                    <div
                        className="user-data-form__submit"
                        onClick={this.checkFormCompletion() ? this.setData : void 0}
                    >
                        <Button
                            width={252}
                            height={44}
                            text={`<p class="ql-align-center"><span class="ql-size-large ql-font-Roboto" style="color: #FFFFFF">${getTranslation(
                                'next',
                            )}</span></p>`}
                            imageSrc={''}
                            borderRadius={4}
                            borderWidth={0}
                            borderColor=""
                            backgroundColor={this.checkFormCompletion() ? '#2990FB' : '#BCBCBC'}
                            styleVariant="none"
                            sizeMod="normal"
                            id={`${id}_submitButton`}
                        />
                    </div>
                    <div className="user-data-form__agree">
                        <input type="checkbox" onChange={event => this.setLicenseAgreement(event.target.checked)} />
                        <span>
                            {getTranslation('agree_with')}{' '}
                            <a
                                onClick={() =>
                                    window.open(
                                        `https://interacty.me/policy${
                                            authorPrivacyPolicy.length ? `?authorPolicy=${authorPrivacyPolicy}` : ''
                                        }`,
                                    )
                                }
                            >
                                {getTranslation('privacy_policy')}
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
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
    authorPrivacyPolicy: {
        type: 'string',
        default: '',
    },
    data: {
        type: 'object',
        default: {},
    },
}

export const Schema = new DataSchema(schema)

export default RemixWrapper(UserDataForm, Schema, 'UserDataForm')
