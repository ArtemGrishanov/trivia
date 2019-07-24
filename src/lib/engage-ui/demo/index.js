import React from 'react';
import ReactDOM from 'react-dom';

import Control from './Control'
import Button from '../primitives/Button'

ReactDOM.render(
    <div>
        <Control>
            <Button/>
        </Control>
        <Control>
            <Button color="white"/>
        </Control>
        <Control>
            <Button size="small"/>
        </Control>
        <Control>
            <Button color="white" size="small"/>
        </Control>
        <p>

        </p>
    </div>,
    document.getElementById('root'));
