import React from 'react'
import DataSchema from '../../../schema'
import RemixWrapper from '../../RemixWrapper'
import '../../style/rmx-social.css'

const icon = <svg xmlns="http://www.w3.org/2000/svg" width="11" height="23" viewBox="0 0 11 23">
    <path fill="#FFF" fillRule="evenodd" d="M7.418 22.093V11.212h3.004l.398-3.75H7.418l.005-1.877c0-.978.093-1.502 1.498-1.502h1.877V.333H7.794c-3.608 0-4.878 1.82-4.878 4.878v2.252H.666v3.75h2.25v10.88h4.502z"/>
</svg>

function onClick() {
    alert('dummy sharing window');
    Remix.fireEvent('fb_share_requested');
}

function FbButton({shareText="Share", sizeMod = "normal"}) {
    return <button className={`rmx-fb_button __${sizeMod}`} onClick={onClick}>
            <span className='rmx-btn-i'>{icon}</span>{shareText}
        </button>;
}

export const Schema = new DataSchema({
    "shareText": {
        type: 'string',
        minLength: 1,
        maxLength: 128,
        default: 'Share'
    },
    "sizeMod": {
        type: 'string',
        enum: ['circle', 'normal'],
        default: 'normal'
    },
});

export default RemixWrapper(FbButton, Schema, 'FbButton')