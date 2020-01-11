import React from 'react';
import Control from './Control'
import Button from '../primitives/Button'
import ProgressiveImage from '../primitives/ProgressiveImage'

const BASE_SAMPLES = [
        <Control id={1} width={600} height={200} label="left - fixed, width - fixed">
            <ProgressiveImage id={'img101'} backgroundSize={'cover'} left={0} leftStrategy={'fixed'} top={0} width={600} widthStrategy={ 'dynamic'} height={200} displayType={'decor'} src='//p.testix.me/temp/celebrations.jpg'></ProgressiveImage>
            <ProgressiveImage id={'img102'} left={500} leftStrategy={'dynamic'} top={-10} width={100} height={100} displayType={'decor'} src='//p.testix.me/temp/xmas-icon.png'></ProgressiveImage>
            <Button id={'b1'} text={'long component'} left={50} leftStrategy={'fixed'} top={30} width={500} widthStrategy={'fixed'} height={60}/>
        </Control>
,
        <Control id={2} width={600} height={200} label="left - fixed, width - dynamic">
            <Button id={'b1'} text={'long component'} left={50} leftStrategy={'fixed'} top={30} width={500} widthStrategy={ 'dynamic'} height={60}/>
        </Control>
,
        <Control id={7} width={600} height={200} label="left - dynamic, width - fixed">
            <Button id={'b1'} text={'long component'} left={50} leftStrategy={ 'dynamic'} top={30} width={500} widthStrategy={'fixed'} height={60}/>
        </Control>
,
        <Control id={8} width={600} height={200} label="left - dynamic, width - dynamic">
            <Button id={'b1'} text={'long component'} left={50} leftStrategy={ 'dynamic'} top={30} width={500} widthStrategy={ 'dynamic'} height={60}/>
        </Control>
,
        <Control id={4} width={600} height={300} label="left - fixed">
            <Button id={'b1'} text={'1'} left={10} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b2'} text={'2'} left={80} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b3'} text={'3'} left={150} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b4'} text={'4'} left={220} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b5'} text={'5'} left={290} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b6'} text={'6'} left={360} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b7'} text={'7'} left={430} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b8'} text={'8'} left={500} leftStrategy={'fixed'} top={10} width={60} height={60}/>
        </Control>
,
        <Control id={5} width={600} height={400} label="left - fixed">
            <Button id={'b1'} text={'1'} left={10} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b2'} text={'2'} left={80} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b3'} text={'3'} left={150} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b4'} text={'4'} left={220} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b5'} text={'5'} left={290} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b6'} text={'6'} left={360} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b7'} text={'7'} left={430} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b8'} text={'8'} left={500} leftStrategy={'fixed'} top={10} width={60} height={60}/>
            <Button id={'b9'} text={'9'} left={10} leftStrategy={'fixed'} top={80} width={60} height={60}/>
            <Button id={'b10'} text={'10'} left={80} leftStrategy={'fixed'} top={80} width={60} height={60}/>
            <Button id={'b11'} text={'11'} left={150} leftStrategy={'fixed'} top={80} width={60} height={60}/>
            <Button id={'b12'} text={'12'} left={220} leftStrategy={'fixed'} top={80} width={60} height={60}/>
            <Button id={'b13'} text={'13'} left={290} leftStrategy={'fixed'} top={80} width={60} height={60}/>
            <Button id={'b14'} text={'14'} left={360} leftStrategy={'fixed'} top={80} width={60} height={60}/>
            <Button id={'b15'} text={'15'} left={430} leftStrategy={'fixed'} top={80} width={60} height={60}/>
            <Button id={'b16'} text={'16'} left={500} leftStrategy={'fixed'} top={80} width={60} height={60}/>
        </Control>
,
        <Control id={6} width={600} height={300} label="left - dynamic">
            <Button id={'b1'} text={'1'} left={10} leftStrategy={'dynamic'} top={10} width={60} height={60}/>
            <Button id={'b2'} text={'2'} left={90} leftStrategy={'dynamic'} top={10} width={60} height={60}/>
            <Button id={'b3'} text={'3'} left={170} leftStrategy={'dynamic'} top={10} width={60} height={60}/>
            <Button id={'b4'} text={'4'} left={250} leftStrategy={'dynamic'} top={10} width={60} height={60}/>
            <Button id={'b5'} text={'5'} left={330} leftStrategy={'dynamic'} top={10} width={60} height={60}/>
            <Button id={'b6'} text={'6'} left={410} leftStrategy={'dynamic'} top={10} width={60} height={60}/>
            <Button id={'b7'} text={'7'} left={490} leftStrategy={'dynamic'} top={10} width={60} height={60}/>
        </Control>
];

export default BASE_SAMPLES