import React from 'react'

const TYPES = ['default', 'triangle', 'thin']
const DIRECTIONS = ['center', 'right', 'left']

/**
 * Render arrow pure component.
 * Returns markup due to requested view options.
 * @param {*} param0
 */
export default function Arrow({ type, direction, color, st }) {
    const _type = TYPES.includes(type) ? type : TYPES[0]
    const _direction = DIRECTIONS.includes(direction) ? direction : DIRECTIONS[0]

    const arrows = {
        rightArrows: {
            triangle: (
                <svg
                    style={st}
                    width="17"
                    height="36"
                    viewBox="0 0 17 36"
                    fill={color}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M1 34.0707L16.3094 18L1 1.92926L1 34.0707Z" fill="white" stroke={color} />
                </svg>
            ),
            thin: (
                <svg
                    style={st}
                    width="12"
                    height="26"
                    viewBox="0 0 12 26"
                    stroke={color}
                    fillOpacity="0"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke={color}
                        d="M1 0.999999L11 13L0.999999 25"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            default: (
                <svg
                    style={st}
                    width="22"
                    height="20"
                    viewBox="0 0 22 20"
                    fill={color}
                    xmlns="http://www.w3.org/2000/svg"
                >
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
            ),
        },
        leftArrows: {
            triangle: (
                <svg
                    style={st}
                    width="17"
                    height="36"
                    viewBox="0 0 17 36"
                    fill={color}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16 34.0707L0.690561 18L16 1.92926L16 34.0707Z" fill="white" stroke={color} />
                </svg>
            ),
            thin: (
                <svg
                    style={st}
                    width="12"
                    height="26"
                    viewBox="0 0 12 26"
                    stroke={color}
                    fillOpacity="0"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke={color}
                        d="M11 0.999999L0.999999 13L11 25"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            default: (
                <svg
                    style={st}
                    width="22"
                    height="20"
                    viewBox="0 0 22 20"
                    fill={color}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill={color}
                        d="M3 10L2.24074 9.34921C1.91975 9.7237 1.91975 10.2763 2.24074 10.6508L3 10ZM9.75926 3.65079C10.1187 3.23147 10.0701 2.60017 9.65079 2.24074C9.23147 1.88132 8.60017 1.92988 8.24074 2.34921L9.75926 3.65079ZM8.24074 17.6508C8.60017 18.0701 9.23147 18.1187 9.65079 17.7593C10.0701 17.3998 10.1187 16.7685 9.75926 16.3492L8.24074 17.6508ZM3.75926 10.6508L9.75926 3.65079L8.24074 2.34921L2.24074 9.34921L3.75926 10.6508ZM9.75926 16.3492L3.75926 9.34921L2.24074 10.6508L8.24074 17.6508L9.75926 16.3492Z"
                    />
                    <line x1="3" y1="10" x2="19" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
        },
    }

    if (_direction === DIRECTIONS[1]) {
        return arrows.rightArrows[_type]
    }

    return arrows.leftArrows[_type]
}
