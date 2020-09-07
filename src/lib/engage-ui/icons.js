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

export const correctOption = ({ color = '#2990FB', style = {} }) => (
    <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill={color} />
        <mask id="mask0" masktype="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <circle cx="12" cy="12" r="12" fill={color} />
        </mask>
        <g mask="url(#mask0)">
            <path
                d="M7 11.8947L11.0877 16L18 8"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </svg>
)

export const chainOption = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#2990FB" />
        <rect
            x="4.6665"
            y="8"
            width="9.33333"
            height="5.33333"
            rx="2.66667"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
        />
        <path
            d="M10 13.3332C10 11.8604 11.1939 10.6665 12.6667 10.6665H16.6667C18.1394 10.6665 19.3333 11.8604 19.3333 13.3332V13.3332C19.3333 14.8059 18.1394 15.9998 16.6667 15.9998H12.6667C11.1939 15.9998 10 14.8059 10 13.3332V13.3332Z"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
        />
    </svg>
)

export const whatsapp = ({ color = '#1877F2', style = {} }) => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
        <path
            d="M13.0544 0C5.91892 0 0.11143 5.77952 0.108809 12.8832C0.107498 15.1546 0.703978 17.3712 1.83664 19.3242L0 26L6.8628 24.2087C8.75319 25.2355 10.8822 25.7756 13.0492 25.7769H13.0544C20.1899 25.7769 25.9974 19.9974 26 12.8937C26.0013 9.45206 24.6563 6.21396 22.2114 3.77952C19.7678 1.34377 16.5179 0.00130463 13.0544 0ZM13.0544 23.6008H13.0505C11.1194 23.6008 9.22644 23.0842 7.57334 22.1083L7.18005 21.8761L3.10825 22.9393L4.19503 18.9876L3.93939 18.5819C2.8618 16.8767 2.29285 14.9067 2.29416 12.8832C2.29678 6.97847 7.12368 2.17613 13.0583 2.17613C15.9319 2.17743 18.6338 3.29289 20.6658 5.31637C22.6977 7.33986 23.816 10.0313 23.8147 12.8924C23.812 18.7971 18.9851 23.6008 13.0544 23.6008ZM18.9563 15.5799C18.6325 15.4194 17.0423 14.6406 16.746 14.5323C16.4498 14.4253 16.2334 14.3705 16.0185 14.6928C15.8035 15.015 15.1834 15.7404 14.9946 15.9543C14.8058 16.1696 14.6171 16.1957 14.2932 16.0352C13.9694 15.8735 12.9272 15.5342 11.6923 14.4371C10.7301 13.5838 10.0812 12.5297 9.8924 12.2074C9.70362 11.8852 9.87274 11.7117 10.034 11.5512C10.1795 11.4077 10.3578 11.1755 10.519 10.9876C10.6803 10.7997 10.734 10.6654 10.8428 10.4501C10.9503 10.2361 10.8966 10.047 10.8153 9.8865C10.734 9.72472 10.0877 8.1409 9.81768 7.49641C9.55549 6.86889 9.28805 6.95369 9.0901 6.94325C8.90133 6.93412 8.68633 6.93151 8.47002 6.93151C8.25503 6.93151 7.9037 7.01239 7.60742 7.33464C7.31115 7.65688 6.47476 8.43575 6.47476 10.0196C6.47476 11.6047 7.63364 13.135 7.7962 13.3503C7.95744 13.5643 10.0772 16.8167 13.3218 18.2114C14.094 18.5427 14.6957 18.741 15.1663 18.8898C15.9411 19.135 16.6464 19.0998 17.2035 19.0176C17.8249 18.925 19.1175 18.2387 19.3863 17.4873C19.6563 16.7358 19.6563 16.0913 19.5751 15.9569C19.4964 15.8226 19.2801 15.7417 18.9563 15.5799Z"
            fill={color}
        />
    </svg>
)

export const shop = ({ color = '#1877F2', style = {} }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
        <path
            d="M7.2 19.2C5.88 19.2 4.812 20.28 4.812 21.6C4.812 22.92 5.88 24 7.2 24C8.52 24 9.6 22.92 9.6 21.6C9.6 20.28 8.52 19.2 7.2 19.2ZM0 0V2.4H2.4L6.72 11.508L5.1 14.448C4.908 14.784 4.8 15.18 4.8 15.6C4.8 16.92 5.88 18 7.2 18H21.6V15.6H7.704C7.536 15.6 7.404 15.468 7.404 15.3L7.44 15.156L8.52 13.2H17.46C18.36 13.2 19.152 12.708 19.56 11.964L23.856 4.176C23.952 4.008 24 3.804 24 3.6C24 2.94 23.46 2.4 22.8 2.4H5.052L3.924 0H0ZM19.2 19.2C17.88 19.2 16.812 20.28 16.812 21.6C16.812 22.92 17.88 24 19.2 24C20.52 24 21.6 22.92 21.6 21.6C21.6 20.28 20.52 19.2 19.2 19.2Z"
            fill={color}
        />
    </svg>
)

export const messanger = ({ color = '#1877F2', style = {} }) => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13 0C5.67606 0 0 5.36486 0 12.6104C0 16.4006 1.55372 19.6755 4.0831 21.9381C4.29497 22.1291 4.42314 22.3932 4.4336 22.6784L4.50423 24.9907C4.52777 25.7283 5.28893 26.207 5.96378 25.9114L8.54286 24.7736C8.76258 24.6768 9.00584 24.6585 9.23602 24.7212C10.4209 25.0482 11.6843 25.2208 13 25.2208C20.3239 25.2208 26 19.856 26 12.6104C26 5.36486 20.3239 0 13 0ZM20.8052 9.70173L16.9863 15.7598C16.3795 16.7223 15.0769 16.963 14.1666 16.2803L11.1298 14.002C10.8499 13.7927 10.468 13.7953 10.1907 14.0046L6.08934 17.1173C5.54266 17.5332 4.82596 16.8767 5.19477 16.296L9.01368 10.238C9.62052 9.27537 10.9231 9.03472 11.8334 9.71743L14.8702 11.9957C15.1501 12.205 15.532 12.2024 15.8093 11.9931L19.9107 8.88039C20.4573 8.46449 21.174 9.12104 20.8052 9.70173Z"
            fill={color}
        />
    </svg>
)

export const vkontakte = ({ color = '#1877F2', style = {} }) => (
    <svg style={style} width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.9908 0H9.00917C1.72477 0 0 1.72477 0 9.00917V16.9908C0 24.2752 1.72477 26 9.00917 26H16.9908C24.2752 26 26 24.2752 26 16.9908V9.00917C26 1.72477 24.2752 0 16.9908 0ZM20.7156 8.25675C21.2844 8.25675 21.4129 8.55033 21.2844 8.954C21.084 9.87913 19.4194 12.3332 18.9038 13.0933C18.8059 13.2377 18.7494 13.321 18.7523 13.321C18.5505 13.6512 18.4771 13.798 18.7523 14.165C18.8518 14.3007 19.0628 14.5077 19.3039 14.7443C19.5519 14.9877 19.8318 15.2623 20.0551 15.5228C20.8624 16.4402 21.4863 17.2109 21.6514 17.743C21.7982 18.2751 21.5413 18.5503 20.9909 18.5503H19.1009C18.6001 18.5503 18.3419 18.2627 17.7917 17.6497C17.5558 17.3869 17.2662 17.0642 16.8808 16.6788C15.7615 15.5962 15.2661 15.4494 14.9909 15.4494C14.6055 15.4494 14.4954 15.5412 14.4954 16.0916V17.798C14.4954 18.2568 14.3487 18.532 13.1376 18.532C11.1376 18.532 8.91746 17.321 7.35783 15.0641C5.00921 11.7613 4.367 9.26593 4.367 8.77051C4.367 8.49528 4.45875 8.2384 5.00921 8.2384H6.91746C7.39453 8.2384 7.57801 8.44024 7.7615 8.97235C8.69728 11.6696 10.2569 14.0366 10.8991 14.0366C11.1376 14.0366 11.2477 13.9265 11.2477 13.321V10.532C11.2024 9.73924 10.9265 9.39384 10.7218 9.13772C10.5949 8.97887 10.4954 8.85436 10.4954 8.67877C10.4954 8.45859 10.6789 8.2384 10.9725 8.2384H13.945C14.3487 8.2384 14.4954 8.45859 14.4954 8.93565V12.6971C14.4954 13.1008 14.6606 13.2476 14.789 13.2476C15.0276 13.2476 15.2294 13.1008 15.6698 12.6604C17.0276 11.1375 18 8.78886 18 8.78886C18.1285 8.51363 18.3487 8.25675 18.8257 8.25675H20.7156Z"
            fill={color}
        />
    </svg>
)

export const feedback = ({ color = '#2990FB', style = {} }) => (
    <svg style={style} width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="14" fill={color} />
        <path
            d="M7.5 12C7.5 9.51472 9.51472 7.5 12 7.5H16C18.4853 7.5 20.5 9.51472 20.5 12V20.5H12C9.51472 20.5 7.5 18.4853 7.5 16V12Z"
            stroke="white"
        />
        <line x1="11.5" y1="12.5" x2="16.5" y2="12.5" stroke="white" strokeLinecap="round" />
        <line x1="11.5" y1="15.5" x2="14.5" y2="15.5" stroke="white" strokeLinecap="round" />
    </svg>
)
