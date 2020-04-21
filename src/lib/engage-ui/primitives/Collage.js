import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import { getComponents } from '../../remix'

const MAIN_IMG_WIDTH_OPTIONS = {
    oneRow: 70,
    twoRows: 60,
}

function CollageItem({ src, width, height, isInlineBlock }) {
    const st = {
        width: width || '100%',
        height: height || '100%',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: '50%',
    }
    if (isInlineBlock) {
        st.display = 'inline-block'
    }
    return <div className="rmx-collage-item" style={st}></div>
}

function Collage(props) {
    const images = getComponents({ displayName: 'ProgressiveImage', tags: 'photostoryitem' })
    const [first] = images

    if (!first) {
        //TODO[DM]: Proper handler media for user notification
        const userNotificationMessage = 'No images were found'
        return <div> {userNotificationMessage} </div>
    }

    let collage = {}

    if (images.length >= 1 && images.length < 4) {
        /**
         * If less than 4
         */
        collage = <CollageItem src={first.src} />
    } else if (images.length >= 4 && images.length < 7) {
        /**
         * If many images but less than 7
         */
        collage = (
            <>
                <CollageItem src={first.src} width={`${MAIN_IMG_WIDTH_OPTIONS.oneRow}%`} isInlineBlock />
                <div className="rmx-collage-subitems-wrap" style={{ width: `${100 - MAIN_IMG_WIDTH_OPTIONS.oneRow}%` }}>
                    {images.slice(1, 4).map((item, i) => (
                        <CollageItem key={item.hashlistId} src={item.src} height={'33.333%'} />
                    ))}
                </div>
            </>
        )
    } else {
        /**
         * If many images exist and their count is bigger than 6
         */
        collage = (
            <>
                <CollageItem src={first.src} width={`${MAIN_IMG_WIDTH_OPTIONS.twoRows}%`} isInlineBlock />
                <div
                    className="rmx-collage-subitems-wrap"
                    style={{ width: `${(100 - MAIN_IMG_WIDTH_OPTIONS.twoRows) / 2}%` }}
                >
                    {images.slice(1, 4).map((item, i) => (
                        <CollageItem key={item.hashlistId} src={item.src} height={'33.333%'} />
                    ))}
                </div>
                <div
                    className="rmx-collage-subitems-wrap"
                    style={{ width: `${(100 - MAIN_IMG_WIDTH_OPTIONS.twoRows) / 2}%` }}
                >
                    {images.slice(4, 7).map((item, i) => (
                        <CollageItem key={item.hashlistId} src={item.src} height={'33.333%'} />
                    ))}
                </div>
            </>
        )
    }

    return <div className="rmx-collage"> {collage} </div>
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    sizeMod: {
        type: 'string',
        enum: ['small', 'normal'],
        default: 'normal',
    },
})

export default RemixWrapper(Collage, Schema, 'Collage')
