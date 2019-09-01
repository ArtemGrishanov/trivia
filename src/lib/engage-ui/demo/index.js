import React from 'react';
import ReactDOM from 'react-dom';

import Control from './Control'
import Button from '../primitives/Button'
import { Schema as ButtonSchema } from '../primitives/Button'
import CorrectIcon from '../primitives/CorrectIcon'
import { Schema as CorrectIconSchema} from '../primitives/CorrectIcon'
import ProgressiveImage from '../primitives/ProgressiveImage'
import { Schema as ProgressiveImageSchema } from '../primitives/ProgressiveImage'
import TextOption from '../primitives/TextOption';
import { Schema as TextOptionSchema } from '../primitives/TextOption'
import QuizBlock from '../blocks/quiz/QuizBlock';
import { Schema as QuizBlockSchema } from '../blocks/quiz/QuizBlock';
import HashList from '../../hashlist';
import LayoutContainer from '../layout/LayoutContainer';
import { Schema as LayoutContainerSchema } from '../layout/LayoutContainer'
import LayoutItem from '../layout/LayoutItem';
import Element from '../primitives/Element'
import Text from '../primitives/Text'
import { Schema as TextSchema } from '../primitives/Text'

ReactDOM.render(
    <div>
        {/* <Control schema={LayoutContainerSchema} width={600} height={400}>
            <LayoutContainer mode={'absolute'} border={true}>
                <LayoutItem top={20}>
                    <Element>
                        <div style={{width:'222px',height:'33px',backgroundColor:'#a22222'}}>Fixed width/height</div>
                    </Element>
                </LayoutItem>
                <LayoutItem top={80}>
                    <Element>
                        <div style={{width:'100%',height:'60px',backgroundColor:'#22a222'}}>Dynamic width<br/>fixed height</div>
                    </Element>
                </LayoutItem>
                <LayoutItem top={160}>
                    <Element>
                        <div style={{width:'70px',height:'100%',backgroundColor:'#5555a2'}}>Fixed width<br/>dynamic height</div>
                    </Element>
                </LayoutItem>
            </LayoutContainer>
        </Control>
        <Control schema={LayoutContainerSchema} width={600} height={400}>
            <LayoutContainer mode={'absolute'} border={true}>
                <LayoutItem top={200} left={70}>
                    <Button/>
                </LayoutItem>
                <LayoutItem top={120} left={20}>
                    <TextOption correctIndicator='correct' percent={44}/>
                </LayoutItem>
            </LayoutContainer>
        </Control> */}
        <Control schema={LayoutContainerSchema} width={600} height={400}>
            <LayoutContainer globalTestId={'test1'} mode={'absolute'} border={true}>
                <LayoutItem>
                    <Text></Text>
                </LayoutItem>
                <LayoutItem>
                    <ProgressiveImage
                        src="http://p.testix.me/temp/cat1500x1000.jpg"
                        srcThumb="http://p.testix.me/temp/cat1500x1000_thumb.jpg"
                        animation="zoom"
                        maxWidth={300}
                        />
                </LayoutItem>
                <LayoutItem>
                    <TextOption correctIndicator='correct' percent={44}/>
                </LayoutItem>
                <LayoutItem>
                    <TextOption correctIndicator='wrong' percent={66}/>
                </LayoutItem>
                <LayoutItem>
                    <Button text='Next'></Button>
                </LayoutItem>
                <LayoutItem>
                    <ProgressiveImage src='http://www.earthtimes.org/newsimage/wwf-50-Years-Conservation_153.jpg'/>
                </LayoutItem>
            </LayoutContainer>
        </Control>
        {/* <Control schema={QuizBlockSchema} width={600} height={400}>
            <QuizBlock options={new HashList(['Answer1', 'Answer2', 'Answer3'])}/>
        </Control> */}
        <Control schema={TextOptionSchema}>
            <TextOption percent={55}/>
        </Control>
        <Control schema={TextOptionSchema}>
            <TextOption correctIndicator='correct' percent={34}/>
        </Control>
        <Control schema={TextOptionSchema}>
            <TextOption correctIndicator='wrong_gray' borderRadius={100} percent={33}/>
        </Control>
        <Control schema={TextOptionSchema}>
            <TextOption correctIndicator='wrong' textAlign='center' borderRadius={0} percent={77}/>
        </Control>
        <Control schema={TextOptionSchema} width={400}>
            <TextOption correctIndicator='wrong' percent={12}
                text='У меня работают умные сотрудники! Пусть придумают алгоритм создания паролей и на него ориентируются. Главное, не забыть схему.'
            />
        </Control>
        <Control schema={TextOptionSchema} width={300}>
            <TextOption/>
        </Control>
        <Control schema={TextOptionSchema} width={300}>
            <TextOption correctIndicator='correct' text='У меня работают умные сотрудники! Пусть придумают алгоритм создания паролей'/>
        </Control>
        <Control schema={TextOptionSchema} width={300}>
            <TextOption correctIndicator='wrong' percent={49} text='У меня работают умные сотрудники! Пусть придумают алгоритм создания паролей'/>
        </Control>
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
        <Control schema={CorrectIconSchema}>
            <CorrectIcon mod='empty'/>
        </Control>
        <Control schema={CorrectIconSchema}>
            <CorrectIcon mod='correct'/>
        </Control>
        <Control schema={CorrectIconSchema}>
            <CorrectIcon mod='wrong'/>
        </Control>
        <Control schema={CorrectIconSchema}>
            <CorrectIcon mod='wrong_gray'/>
        </Control>
        <Control schema={TextSchema}>
            <Text fontSize={50} color='red' text='Text example'></Text>
        </Control>
        <Control schema={TextSchema} width={800}>
            <Text fontSize={24} color='black' backgroundColor={'yellow'} text='Long text with typing effect. The user is printing this text on his keyboard.' animationOnAppearance='typing'></Text>
        </Control>
        <Control schema={ProgressiveImageSchema} width={500} height={300}>
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
                />
        </Control>
        <Control schema={ProgressiveImageSchema} width={500} height={500}>
            <ProgressiveImage
                blur={false}
                maxWidth={500}
                maxHeight={500}
                animation={"zoom"}
                src="http://p.testix.me/temp/shore259x194.jpeg"
                border={true}
                />
        </Control>
        <Control schema={ProgressiveImageSchema} width={500} height={500}>
            <ProgressiveImage
                blur={false}
                maxWidth={1600}
                maxHeight={400}
                src="http://p.testix.me/temp/1000x611.jpg"
                />
        </Control>
        <Control schema={ProgressiveImageSchema} width={500} height={500}>
            <ProgressiveImage
                blur={false}
                maxWidth={500}
                animation={"eight"}
                src="http://p.testix.me/temp/1000x611.jpg"
                srcThumb="http://p.testix.me/temp/4000x2443_thumb.jpg"
                />
        </Control>
    </div>,
    document.getElementById('root'));
