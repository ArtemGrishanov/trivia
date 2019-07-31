import React from 'react';
import ReactDOM from 'react-dom';

import Control from './Control'
import Button from '../primitives/Button'
import { Schema as ButtonSchema } from '../primitives/Button'
import IsCorrect from '../primitives/IsCorrect'
import { Schema as IsCorrectSchema} from '../primitives/IsCorrect'
import ProgressiveImage from '../primitives/ProgressiveImage'
import { Schema as ProgressiveImageSchema } from '../primitives/ProgressiveImage'

ReactDOM.render(
    <div>
        <Control schema={ButtonSchema}>
            <Button/>
        </Control>
        <Control schema={ButtonSchema}>
            <Button colorMod="white"/>
        </Control>
        <Control schema={ButtonSchema}>
            <Button sizeMod="small"/>
        </Control>
        <Control schema={ButtonSchema}>
            <Button colorMod="white" sizeMod="small"/>
        </Control>
        <Control schema={IsCorrectSchema}>
            <IsCorrect correct={false}/>
        </Control>
        <Control schema={IsCorrectSchema}>
            <IsCorrect correct={false} gray={true}/>
        </Control>
        <Control schema={IsCorrectSchema}>
            <IsCorrect/>
        </Control>
        <Control schema={ProgressiveImageSchema}>
            <ProgressiveImage
                src="http://p.testix.me/temp/cat1500x1000.jpg"
                srcThumb="http://p.testix.me/temp/cat1500x1000_thumb.jpg"
                animation="zoom"/>
        </Control>
        <Control schema={ProgressiveImageSchema} width={500} height={500}>
            <ProgressiveImage
                blur={true}
                maxWidth={500}
                maxHeight={200}
                animation={'none'}
                src="http://p.testix.me/temp/cat1500x1000.jpg"
                srcThumb="http://p.testix.me/temp/cat1500x1000_thumb.jpg"
                border={true}
                />
        </Control>
        <Control schema={ProgressiveImageSchema} width={500} height={900}>
            <ProgressiveImage
                blur={false}
                maxWidth={1400}
                maxHeight={400}
                animation={'none'}
                src="http://p.testix.me/temp/waterfall1000x1500.jpeg"
                srcThumb="http://p.testix.me/temp/waterfall1000x1500_thumb.jpg"
                border={true}
                />
        </Control>
        {/*<Control>
            <ProgressiveImage
                blur={false}
                width={500}
                height={500}
                animation={"zoom"}
                src="http://p.testix.me/temp/shore259x194.jpeg"
                border={true}
                />
        </Control>
        <Control>
            <ProgressiveImage
                blur={false}
                width={1600}
                height={400}
                src="http://p.testix.me/temp/1000x611.jpg"
                border={true}
                />
        </Control>
        <Control>
            <ProgressiveImage
                blur={false}
                width={500}
                //height={400}
                animation={"eight"}
                src="http://p.testix.me/temp/1000x611.jpg"
                srcThumb="http://p.testix.me/temp/4000x2443_thumb.jpg"
                border={true}
                />
        </Control> */}
    </div>,

    //TODO combobox true | false for boolean values
    //TODO width height for container wrapper
    
    document.getElementById('root'));
