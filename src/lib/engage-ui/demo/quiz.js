import React from 'react';
import Control from './Control'
import TextOption from '../primitives/TextOption';
import ProgressiveImage from '../primitives/ProgressiveImage'
import Text from '../primitives/Text'
import Progress from '../primitives/Progress'

const QUIZ_SAMPLES = [
        <Control id={106} width={800} height={600} label={'What is this city?'}>
            {/* <Progress left={382} top={32} width={35} height={30}></Progress> */}
            <Text id={'text'} text={`<p class="ql-align-center"><strong class="ql-size-huge" style="color: rgb(136, 136, 136);">WHAT IS THIS CITY?</strong></p>`} left={198} top={62} width={404} height={55}/>
            <ProgressiveImage id={'img'} left={171} top={133} width={457} height={216} src='https://backend-dev-bucket.s3.eu-central-1.amazonaws.com/697676/media/62394/1974'/>
            <TextOption id={'opt1'} left={198} top={368} width={193} height={81} text={`<p class="ql-align-center"><strong class="ql-size-large" style="color: rgb(240, 102, 102);">ATHENS</strong></p>`}/>
            <TextOption id={'opt2'} left={409} top={368} width={193} height={81} text={`<p class="ql-align-center"><strong class="ql-size-large" style="color: rgb(240, 102, 102);">MILAN</strong></p>`}/>
            <TextOption id={'opt3'} left={198} top={466} width={193} height={81} text={`<p class="ql-align-center"><strong class="ql-size-large" style="color: rgb(240, 102, 102);">ROME</strong></p>`}/>
            <TextOption id={'opt4'} left={409} top={466} width={193} height={81} text={`<p class="ql-align-center"><strong class="ql-size-large" style="color: rgb(240, 102, 102);">DUBAI</strong></p>`}/>
        </Control>
        ,
        <Control id={107} width={800} height={600} label={'What is this city?'}>
            <Text id={'text'} text={`<p class="ql-align-center"><strong class="ql-size-huge" style="color: rgb(136, 136, 136);">WHAT IS THIS CITY?</strong></p>`} left={198} top={62} width={404} height={55}/>
            <ProgressiveImage id={'img'} left={171} top={133} width={457} height={216} src='https://backend-dev-bucket.s3.eu-central-1.amazonaws.com/697676/media/62394/1974'/>
            <TextOption id={'opt1'} left={96} top={368} width={193} height={81} text={`<p class="ql-align-center"><strong class="ql-size-large" style="color: rgb(240, 102, 102);">ATHENS</strong></p>`}/>
            <TextOption id={'opt2'} left={300} top={368} width={193} height={81} text={`<p class="ql-align-center"><strong class="ql-size-large" style="color: rgb(240, 102, 102);">MILAN</strong></p>`}/>
            <TextOption id={'opt3'} left={504} top={368} width={193} height={81} text={`<p class="ql-align-center"><strong class="ql-size-large" style="color: rgb(240, 102, 102);">ROME</strong></p>`}/>
        </Control>
        ,
        <Control id={101} width={800} height={400} label={'Photo question'}>
            <ProgressiveImage id={'img'} left={140} top={40} width={520} height={180} src='https://s3.eu-central-1.amazonaws.com/proconstructor/43d927ad-17a1-4d07-84c2-c273dff1a831%2Fres%2Fcadillak-eldorado.jpg'/>
            <TextOption id={'opt1'} left={135} top={240} width={235} height={60} correctIndicator='correct' text={'Верный ответ'} percent={44} widthStrategy={'dynamic'}/>
            <TextOption id={'opt2'} left={435} top={310} width={235} height={60} correctIndicator='wrong' text={'Неверный ответ'} percent={66} widthStrategy={'dynamic'}/>
            <TextOption id={'opt3'} left={135} top={310} width={235} height={60} correctIndicator='wrong' text={'Еще один ответ'} percent={66} widthStrategy={'dynamic'}/>
            <TextOption id={'opt4'} left={435} top={240} width={235} height={60} correctIndicator='wrong' text={'Альтернативный ответ'} percent={66} widthStrategy={'dynamic'}/>
        </Control>
        ,
        <Control id={102} width={800} height={400} label={'Text question'}>
            <Text id={'text'} text={'Question text here...'} left={325} fontSize={18} top={40} width={150} height={100} src='http://p.testix.me/images/products/common/i/image-sample1.jpg'/>
            <TextOption id={'opt1'} left={200} top={110} width={400} height={60} correctIndicator='correct' text={'Верный ответ'} percent={44} widthStrategy={'dynamic'}/>
            <TextOption id={'opt2'} left={200} top={200} width={400} height={60} correctIndicator='gray' text={'Неверный ответ'} percent={33} widthStrategy={'dynamic'}/>
            <TextOption id={'opt3'} left={200} top={290} width={400} height={60} correctIndicator='gray' text={'Еще один ответ'} percent={66} widthStrategy={'dynamic'}/>
        </Control>
        ,
        <Control id={103} width={800} height={600} label={'Photo and text question'}>
            <Text id={'text'} text={'Question text about this photo'} left={275} fontSize={18} top={20} width={250} height={100}/>
            <ProgressiveImage id={'img'} left={170} top={60} width={460} height={200} src='http://p.testix.me/images/products/common/i/image-sample1.jpg'/>
            <TextOption id={'opt1'} left={200} top={280} width={400} height={60} correctIndicator='correct' text={'Верный ответ'} percent={44} widthStrategy={'dynamic'}/>
            <TextOption id={'opt2'} left={200} top={360} width={400} height={60} correctIndicator='gray' text={'Неверный ответ'} percent={33} widthStrategy={'dynamic'}/>
            <TextOption id={'opt3'} left={200} top={440} width={400} height={60} correctIndicator='gray' text={'Еще один ответ'} percent={66} widthStrategy={'dynamic'}/>
        </Control>
        ,
        <Control id={104} width={800} height={400} label={'Photo options'}>
            <Text id={'text'} text={'Пьер Огюст Ренуар. Где оригинал?'} left={275} fontSize={18} top={20} width={250} height={100}/>
            <ProgressiveImage id={'img11'} left={120} top={120} width={260} height={260} src='https://s3.eu-central-1.amazonaws.com/proconstructor/fe49d4c1-18eb-4490-b16b-86f8f93690b7%2Fres%2Frenuar-normal.jpg'/>
            <ProgressiveImage id={'img22'} left={420} top={120} width={260} height={260} src='https://s3.eu-central-1.amazonaws.com/proconstructor/fe49d4c1-18eb-4490-b16b-86f8f93690b7%2Fres%2Frenuar-flipped.jpg'/>
        </Control>
        ,
        <Control id={105} width={800} height={400} label={'Photo options'}>
            <Text id={'text'} text={'You\'ve just known about pay boost!'} left={275} fontSize={18} top={20} width={250} height={100}/>
            <ProgressiveImage id={'img11'} left={110} top={120} width={180} height={200} src='https://s3.eu-central-1.amazonaws.com/proconstructor/fe49d4c1-18eb-4490-b16b-86f8f93690b7%2Fres%2Figor2-21111712125512.jpg'/>
            <ProgressiveImage id={'img22'} left={310} top={120} width={180} height={200} src='https://s3.eu-central-1.amazonaws.com/proconstructor/fe49d4c1-18eb-4490-b16b-86f8f93690b7%2Fres%2Fhqdefault%20_1_.jpg'/>
            <ProgressiveImage id={'img33'} left={510} top={120} width={180} height={200} src='https://s3.eu-central-1.amazonaws.com/proconstructor/fe49d4c1-18eb-4490-b16b-86f8f93690b7%2Fres%2Fc0b7e14b-f062-49d9-a0ac-d301a6efc1ae.jpg'/>
        </Control>
];

export default QUIZ_SAMPLES