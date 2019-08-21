import React from 'react'
import DataSchema from '../../schema'
import PropsNormalizer from '../PropsNormalizer'

function CorrectIcon({mod = 'empty'}) {
    return (
        <span className='rmx-ci'>
            {mod === 'correct' &&
                <svg xmlns="http://www.w3.org/2000/svg" width='100%' height='100%' viewBox="0 0 24 24">
                    <g fill="none" fillRule="evenodd">
                        <circle cx="12" cy="12" r="12" fill="#65BB5A"/>
                        <path stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.843 12L11 17l7.535-9.24"/>
                    </g>
                </svg>
            }
            {mod === 'wrong' &&
                <svg xmlns="http://www.w3.org/2000/svg" width='100%' height='100%' viewBox="0 0 24 24">
                    <g fill="none" fillRule="evenodd">
                        <circle cx="12" cy="12" r="12" fill="#FF5656"/>
                        <g stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path d="M7 7l10 10M17 7L7 17"/>
                        </g>
                    </g>
                </svg>
            }
            {mod === 'wrong_gray' &&
                <svg xmlns="http://www.w3.org/2000/svg" width='100%' height='100%' viewBox="0 0 20 20">
                    <g fill="none" fillRule="evenodd">
                        <circle cx="10" cy="10" r="10" fill="#D8D8D8"/>
                        <g stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.667">
                            <path d="M5.833 5.833l8.334 8.334M14.167 5.833l-8.334 8.334"/>
                        </g>
                    </g>
                </svg>
            }
            {mod === 'empty' &&
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 40 40">
                    <defs>
                        <filter id="a" width="105.9%" height="139.6%" x="-2.9%" y="-19.8%" filterUnits="objectBoundingBox">
                            <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1"/>
                            <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="4"/>
                            <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0951704545 0"/>
                            <feMerge>
                                <feMergeNode in="shadowMatrixOuter1"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <circle cx="12" cy="12" r="11.5" fill="#FFF" fillRule="evenodd" stroke="#D8D8D8" filter="url(#a)" transform="translate(8 6)"/>
                </svg>
            }
        </span>
    );
}

export const Schema = new DataSchema({
    'mod': {
        type: 'string',
        enum: ['empty','correct','wrong','wrong_gray'],
        default: 'empty'
    }
});

export default PropsNormalizer(CorrectIcon, Schema);