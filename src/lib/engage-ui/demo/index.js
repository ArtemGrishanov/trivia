import React from 'react';
import ReactDOM from 'react-dom';

import Control from './Control'
import Button from '../primitives/Button'
import { Schema as ButtonSchema } from '../primitives/Button'
import IsCorrect from '../primitives/IsCorrect';
import { Schema as IsCorrectSchema} from '../primitives/IsCorrect';

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
            <IsCorrect correct={false} disabled={true}/>
        </Control>
        <Control schema={IsCorrectSchema}>
            <IsCorrect/>
        </Control>
    </div>,

    //TODO combobox true | false for boolean values
    //TODO combobox for enum
    //TODO width height for container wrapper
    
    document.getElementById('root'));
