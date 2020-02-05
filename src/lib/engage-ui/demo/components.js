import React from 'react';
import Control from './Control'
import Button from '../primitives/Button'
import { Schema as ButtonSchema } from '../primitives/Button'
import CorrectIcon from '../primitives/CorrectIcon'
import { Schema as CorrectIconSchema} from '../primitives/CorrectIcon'
import ProgressiveImage from '../primitives/ProgressiveImage'
import { Schema as ProgressiveImageSchema } from '../primitives/ProgressiveImage'
import TextOption from '../primitives/TextOption'
import { Schema as TextOptionSchema } from '../primitives/TextOption'
import LayoutContainer from '../layout/LayoutContainer';
import { Schema as LayoutContainerSchema } from '../layout/LayoutContainer'
import LayoutItem from '../layout/LayoutItem';
import Element from '../primitives/Element'
import Text from '../primitives/Text'
import { Schema as TextSchema } from '../primitives/Text'
import FbButton from '../primitives/social/FbButton'
import { Schema as FbButtonSchema } from '../primitives/social/FbButton'

const COMPONENTS = [
    <Control id={500} schema={TextSchema} width={800} height={300}>
        <Text id={'text1'} width={360} height={160} fontSize={50} color='red' text='Text example'></Text>
    </Control>
    ,
    <Control id={501} schema={TextSchema} width={800}>
        <Text id={'text2'} top={10} left={10} width={800} height={60}
            fontSize={24}
            color='black'
            backgroundColor={'yellow'}
            text='Long text with typing effect. The user is printing this text on his keyboard.'
            //animationOnAppearance='typing'
        ></Text>
    </Control>
    ,
    <Control id={502} schema={TextOptionSchema} width={800} height={200}>
        <TextOption id={'textoption1'} percent={55} height={60} width={200}/>
    </Control>
    ,
    <Control id={503} schema={TextOptionSchema} width={800} height={200}>
        <TextOption id={'textoption2'} width={400} height={120} correctIndicator='correct' percent={44} text='У меня работают умные сотрудники! Пусть придумают алгоритм создания паролей и на него ориентируются. Главное, не забыть схему.'/>
    </Control>
    ,
    <Control id={504} schema={TextOptionSchema} width={800} height={200}>
        <TextOption id={'textoption2'} width={200} height={50} correctIndicator='wrong' align='center' borderRadius={0} percent={88}/>
    </Control>
    ,
    <Control id={505} schema={ButtonSchema} width={800} height={300}>
        <Button id={'button1'} width={100} height={40} />
    </Control>
    ,
    <Control id={506} schema={ButtonSchema} width={800} height={300}>
        <Button id={'button2'} colorMod="white" sizeMod="small" width={150} height={30}/>
    </Control>
    ,
    <Control id={507} schema={FbButtonSchema} width={800} height={300}>
        <FbButton id={'fbbutton1'} width={150}/>
    </Control>
    ,
    <Control id={508} schema={ProgressiveImageSchema} width={800} height={300}>
        <ProgressiveImage
            id={'img1'}
            width={450}
            height={200}
            src="http://p.testix.me/temp/cat1500x1000.jpg"
            srcThumb="http://p.testix.me/temp/cat1500x1000_thumb.jpg"
            animation="zoom"/>
    </Control>
    ,
    <Control id={509} schema={ProgressiveImageSchema} width={800} height={300}>
        <ProgressiveImage
            id={'img2'}
            width={250}
            height={200}
            src="http://p.testix.me/temp/cat1500x1000.jpg"
            srcThumb="http://p.testix.me/temp/cat1500x1000_thumb.jpg"
            animation="none"
            blur={true}/>
    </Control>
    ,
    <Control id={510} schema={ProgressiveImageSchema} width={800} height={600}>
        <ProgressiveImage
            id={'img3'}
            blur={false}
            width={300}
            height={500}
            animation={'none'}
            src="http://p.testix.me/temp/waterfall1000x1500.jpeg"
            srcThumb="http://p.testix.me/temp/waterfall1000x1500_thumb.jpg"
            />
    </Control>
    ,
    <Control id={511} schema={ProgressiveImageSchema} width={800} height={400}>
        <ProgressiveImage
            id={'img4'}
            blur={false}
            width={400}
            height={300}
            animation={"eight"}
            src="http://p.testix.me/temp/1000x611.jpg"
            srcThumb="http://p.testix.me/temp/4000x2443_thumb.jpg"
            />
    </Control>
    ,
    <Control id={516} schema={ProgressiveImageSchema}  width={770} height={200}>
        <ProgressiveImage id={'img5'}
            left={0}
            leftStrategy={'fixed'}
            top={0}
            width={770}
            widthStrategy={'dynamic'}
            height={200}
            src='//p.testix.me/temp/celebrations.jpg' />
    </Control>
    ,
    <Control id={512} schema={CorrectIconSchema}>
        <CorrectIcon id={'icon1'} mod='wrong_gray'/>
    </Control>
    ,
    <Control id={513} schema={CorrectIconSchema}>
        <CorrectIcon id={'icon2'} mod='wrong'/>
    </Control>
    ,
    <Control id={514} schema={CorrectIconSchema}>
        <CorrectIcon id={'icon3'} mod='empty'/>
    </Control>
    ,
    <Control id={515} schema={CorrectIconSchema}>
        <CorrectIcon id={'icon4'} mod='correct'/>
    </Control>
];

export default COMPONENTS