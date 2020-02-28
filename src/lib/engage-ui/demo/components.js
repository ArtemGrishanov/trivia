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
import Screen from '../Screen'

const COMPONENTS = [
    <Control id={500} schema={TextSchema} width={800} height={300}>
        <Text id={'text1'} width={360} height={160} fontSize={50} color='red'
            text='<p class="ql-align-center"><br/></p><p class="ql-align-center"><br/></p><p class="ql-align-center"><span style="color: rgb(230, 0, 0);">Text</span> <strong>ex</strong><strong style="background-color: rgb(0, 138, 0);">amp</strong><strong>le</strong></p>'>
        </Text>
    </Control>
    ,
    // not implemented yet
    // <Control id={501} schema={TextSchema} width={800}>
    //     <Text id={'text2'} top={10} left={10} width={800} height={60}
    //         fontSize={24}
    //         color='black'
    //         backgroundColor={'yellow'}
    //         text='Long text with typing effect. The user is printing this text on his keyboard.'
    //         //animationOnAppearance='typing'
    //     ></Text>
    // </Control>
    // ,
    <Control id={502} schema={TextOptionSchema} width={800} height={200}>
        <TextOption id={'textoption1'} percent={55} height={60} width={200}/>
    </Control>
    ,
    <Control id={503} schema={TextOptionSchema} width={800} height={200}>
        <TextOption id={'textoption2'} width={400} height={120} correctIndicator='correct' percent={44} text='У меня работают умные сотрудники! Пусть придумают алгоритм создания паролей и на него ориентируются. Главное, не забыть схему.'/>
    </Control>
    ,
    <Control id={504} schema={TextOptionSchema} width={800} height={200}>
        <TextOption id={'textoption3'} width={200} height={50} correctIndicator='wrong' align='center' borderRadius={0} percent={88}/>
    </Control>
    ,
    <Control id={517} schema={TextOptionSchema} width={800} height={200}>
        <TextOption id={'textoption4'} width={250} height={150} top={20} correctIndicator='correct' align='center' borderRadius={20} percent={68}
            imageSrc={'https://interactive-examples.mdn.mozilla.net/media/examples/grapefruit-slice-332-332.jpg'}
            text={'<p><span style="color: rgb(255, 255, 255);">option</span></p><p><span style="color: rgb(255, 255, 255);">with</span></p><p><span style="color: rgb(255, 255, 255);">background</span></p><p><span style="color: rgb(255, 255, 255);">image</span></p>'}
            />
    </Control>
    ,
    <Control id={518} schema={TextOptionSchema} width={800} height={200}>
        <TextOption id={'textoption5'} width={250} height={150} top={20} correctIndicator='correct' align='center' borderRadius={10} percent={68}
            backgroundColor={'blue'}
            text={'<p><span style="color: rgb(255, 255, 255);">option</span></p><p><span style="color: rgb(255, 255, 255);">with</span></p><p><span style="color: rgb(255, 255, 255);">background</span></p><p><span style="color: rgb(255, 255, 255);">color</span></p>'}
            />
    </Control>
    ,
    <Control id={505} schema={ButtonSchema} width={800} height={300}>
        <Button id={'button1'} width={180} height={60} text='<p class="ql-align-center"><em class="ql-size-large" style="color: rgb(255, 255, 255);">Button</em><span class="ql-size-large"> </span><span class="ql-size-large" style="background-color: rgb(230, 0, 0); color: rgb(255, 255, 102);">text</span></p>'/>
    </Control>
    ,
    <Control id={506} schema={ButtonSchema} width={800} height={300}>
        <Button id={'button2'} colorMod="white" sizeMod="small" width={150} height={30} text='<p class="ql-align-center">Button text</p>'/>
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
    ,
    <Control id={519} schema={TextOptionSchema} width={800} height={600}>
        <Screen id={'screen1'} width={800} height={600} top={0}
            backgroundColor={'#a7a7d2'}
            />
    </Control>
    ,
    <Control id={520} schema={TextOptionSchema} width={800} height={600}>
        <Screen id={'screen2'} width={800} height={600} top={0}
            backgroundImage={'https://cdn.thinglink.me/gfx/pages16/images/frontpage/march2019/landing-image-03-04@2x.jpg'}
            />
    </Control>
];

export default COMPONENTS