import DataSchema from './lib/schema.js';
import schema from './lib/remix/schemas.js';

const schema = new DataSchema({
    // definition of dynamic editable data here
});

schema.extend(schema);

export default schema;
