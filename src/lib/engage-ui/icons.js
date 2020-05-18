import React from 'react'

export const link = ({ color = 'white', style = {} }) => (
    <svg style={style} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M17.7778 17.7778H2.22222V2.22222H10V0H2.22222C0.988889 0 0 1 0 2.22222V17.7778C0 19 0.988889 20 2.22222 20H17.7778C19 20 20 19 20 17.7778V10H17.7778V17.7778ZM12.2222 0V2.22222H16.2111L5.28889 13.1444L6.85556 14.7111L17.7778 3.78889V7.77778H20V0H12.2222Z"
            fill={color}
        />
    </svg>
)

export const download = ({ color = 'white', style = {} }) => (
    <svg style={style} width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18 7.41176H12.8571V0H5.14286V7.41176H0L9 16.0588L18 7.41176ZM0 18.5294V21H18V18.5294H0Z"
            fill={color}
        />
    </svg>
)

export const CompletionIcon = ({ color = 'white', style = {}, className = '' }) => (
    <svg
        style={style}
        className={className}
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1 3.21238L4.53363 6.99995L10.1572 1"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)
