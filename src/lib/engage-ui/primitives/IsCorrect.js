import React from 'react'
import DataSchema from '../../schema'
import PropsNormalizer from '../PropsNormalizer'

function IsCorrect({correct = true, size = 24, gray = false}) {
    return (
        <div>
            {correct === true &&
                <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
                    <g fill="none" fill-rule="evenodd">
                        <circle cx="12" cy="12" r="12" fill="#65BB5A"/>
                        <path stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.843 12L11 17l7.535-9.24"/>
                    </g>
                </svg>
            }
            {correct === false && gray === false &&
                <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
                    <g fill="none" fill-rule="evenodd">
                        <circle cx="12" cy="12" r="12" fill="#FF5656"/>
                        <g stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M7 7l10 10M17 7L7 17"/>
                        </g>
                    </g>
                </svg>
            }
            {correct === false && gray === true &&
                <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20">
                    <g fill="none" fill-rule="evenodd">
                        <circle cx="10" cy="10" r="10" fill="#D8D8D8"/>
                        <g stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.667">
                            <path d="M5.833 5.833l8.334 8.334M14.167 5.833l-8.334 8.334"/>
                        </g>
                    </g>
                </svg>
            }
        </div>
    );
}

export const Schema = new DataSchema({
    "size": {
        type: 'number',
        min: 5,
        max: 256,
        default: 24
    },
    "gray": {
        type: 'boolean',
        default: false
    }
});

export default PropsNormalizer(IsCorrect, Schema);