import DataSchema from './lib/schema.js'
import componentSchema from './lib/remix/schemas/components.js'

const schema = new DataSchema({
    // definition of dynamic editable data for specific project
})

schema.extend(componentSchema)

export default schema
