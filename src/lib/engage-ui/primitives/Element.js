import React from 'react'
import DataSchema from '../../schema'
import PropsNormalizer from '../PropsNormalizer'
import sizeMe from 'react-sizeme'

function Element({children}) {
    return <div>{children}</div>
    //return <div style={{width:'222px',height:'33px',backgroundColor:'#a22222'}}>Fixed width/height</div>;
}

export default sizeMe({monitorHeight: true, noPlaceholder: true})(Element);