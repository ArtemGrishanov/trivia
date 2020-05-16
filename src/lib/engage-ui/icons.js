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

export const restart = ({ color = 'white', style = {} }) => (
    <svg style={style} width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M15 12C15 15.866 11.866 19 8 19C4.13401 19 1 15.866 1 12C1 8.13401 4.13401 5 8 5H10"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path d="M7 9L11 5L7 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export const arrowLeft = ({ color = 'white', style = {} }) => (
    <svg style={style} width="22" height="20" viewBox="0 0 22 20" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path
            fill={color}
            d="M3 10L2.24074 9.34921C1.91975 9.7237 1.91975 10.2763 2.24074 10.6508L3 10ZM9.75926 3.65079C10.1187 3.23147 10.0701 2.60017 9.65079 2.24074C9.23147 1.88132 8.60017 1.92988 8.24074 2.34921L9.75926 3.65079ZM8.24074 17.6508C8.60017 18.0701 9.23147 18.1187 9.65079 17.7593C10.0701 17.3998 10.1187 16.7685 9.75926 16.3492L8.24074 17.6508ZM3.75926 10.6508L9.75926 3.65079L8.24074 2.34921L2.24074 9.34921L3.75926 10.6508ZM9.75926 16.3492L3.75926 9.34921L2.24074 10.6508L8.24074 17.6508L9.75926 16.3492Z"
        />
        <line x1="3" y1="10" x2="19" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
)

export const arrowRight = ({ color = 'white', style = {} }) => (
    <svg style={style} width="22" height="20" viewBox="0 0 22 20" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path
            fill={color}
            d="M19 10L19.7593 9.34921C20.0802 9.7237 20.0802 10.2763 19.7593 10.6508L19 10ZM12.2407 3.65079C11.8813 3.23147 11.9299 2.60017 12.3492 2.24074C12.7685 1.88132 13.3998 1.92988 13.7593 2.34921L12.2407 3.65079ZM13.7593 17.6508C13.3998 18.0701 12.7685 18.1187 12.3492 17.7593C11.9299 17.3998 11.8813 16.7685 12.2407 16.3492L13.7593 17.6508ZM18.2407 10.6508L12.2407 3.65079L13.7593 2.34921L19.7593 9.34921L18.2407 10.6508ZM12.2407 16.3492L18.2407 9.34921L19.7593 10.6508L13.7593 17.6508L12.2407 16.3492Z"
        />
        <line
            x1="1"
            y1="-1"
            x2="17"
            y2="-1"
            transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 20 11)"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
)

export const triangleLeft = ({ color = 'white', style = {} }) => (
    <svg style={style} width="17" height="36" viewBox="0 0 17 36" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M16 34.0707L0.690561 18L16 1.92926L16 34.0707Z" fill="white" stroke={color} />
    </svg>
)

export const triangleRight = ({ color = 'white', style = {} }) => (
    <svg style={style} width="17" height="36" viewBox="0 0 17 36" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M1 34.0707L16.3094 18L1 1.92926L1 34.0707Z" fill="white" stroke={color} />
    </svg>
)

export const facebook = ({ color = '#1877F2', style = {} }) => (
    <svg style={style} width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M26 13C26 5.82029 20.1797 0 13 0C5.82029 0 0 5.82029 0 13C0 19.4886 4.75389 24.8668 10.9688 25.8421V16.7578H7.66797V13H10.9688V10.1359C10.9688 6.87781 12.9096 5.07812 15.879 5.07812C17.3014 5.07812 18.7891 5.33203 18.7891 5.33203V8.53125H17.1498C15.535 8.53125 15.0312 9.53342 15.0312 10.5615V13H18.6367L18.0604 16.7578H15.0312V25.8421C21.2461 24.8668 26 19.4886 26 13Z"
            fill={color}
        />
    </svg>
)

export const CompletionIcon = ({ color = 'white', style = {} }) => (
    <svg style={style} width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1 3.21238L4.53363 6.99995L10.1572 1"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)
