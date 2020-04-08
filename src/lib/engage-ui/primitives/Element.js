import React from 'react'
import RemixWrapper from '../RemixWrapper'
import DataSchema from '../../schema'

function Element({ children }) {
  return <div>{children}</div>
  //return <div style={{width:'222px',height:'33px',backgroundColor:'#a22222'}}>Fixed width/height</div>;
}

export default RemixWrapper(Element, new DataSchema({}), 'Element')
