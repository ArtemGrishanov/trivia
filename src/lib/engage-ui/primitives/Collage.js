import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'

const { Remix } = window

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
    const images = Remix.getComponents({ displayName: 'ProgressiveImage', tags: 'photostoryitem' })
    const [first, second] = images

    let collage = {}

    if (images.length === 1) {
        /**
         * If only one image exists
         */
        collage = <CollageItem src={first.src} />
    } else if (images.length === 2) {
        /**
         * If two images
         */
        collage = (
            <>
                <CollageItem src={first.src} width={'50%'} isInlineBlock />
                <CollageItem src={second.src} width={'50%'} isInlineBlock />
            </>
        )
    } else if (images.length > 2 && images.length <= 4) {
        /**
         * If many images but less than 4
         */
        collage = (
            <>
                <CollageItem src={first.src} width={`${MAIN_IMG_WIDTH_OPTIONS.oneRow}%`} isInlineBlock />
                <div className="rmx-collage-subitems-wrap" style={{ width: `${100 - MAIN_IMG_WIDTH_OPTIONS.oneRow}%` }}>
                    {images.slice(1).map((item, i) => (
                        <CollageItem key={item.hashlistId} src={item.src} height={'33.333%'} />
                    ))}
                </div>
            </>
        )
    } else {
        /**
         * If many images exist and their count is bigger than 4
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
