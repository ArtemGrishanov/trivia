import { EngageAppSchema } from '../../engage-ui/EngageApp.js'
import DataSchema from '../../schema.js'
import { Schema as ScreenComponentsSchema} from '../../engage-ui/Screen.js'
import { Schema as RouterScreensSchema} from '../../engage-ui/router.js'
import { Schema as TextSchema} from '../../engage-ui/primitives/Text.js'
import { Schema as ProgressSchema} from '../../engage-ui/primitives/Progress.js'
import { Schema as TextOptionSchema} from '../../engage-ui/primitives/TextOption.js'
import { Schema as ButtonSchema} from '../../engage-ui/primitives/Button.js'
import { Schema as FbButton } from '../../engage-ui/primitives/social/FbButton.js'
import { Schema as ProgressiveImageSchema } from '../../engage-ui/primitives/ProgressiveImage.js'
//INSTRUCTION 1: add your new component schema before this line with name ComponentName+'Schema'

//INSTRUCTION 2: add your new component schema to this object:
const componentSchemas = {
    TextSchema,
    ProgressSchema,
    TextOptionSchema,
    ButtonSchema,
    FbButton,
    ProgressiveImageSchema
    // put new schema here before just this line
}

const schemaData = {
    "app.size.width": EngageAppSchema.getDescription("width"),
    "app.size.height": EngageAppSchema.getDescription("height"),
    "router.[screens HashList]": RouterScreensSchema.getDescription('screens'),
    "router.currentScreenId": RouterScreensSchema.getDescription('currentScreenId'),
    "router.displayMode": RouterScreensSchema.getDescription('displayMode'),
    "router.backgroundColor": RouterScreensSchema.getDescription('backgroundColor'),
    "router.switchEffect": RouterScreensSchema.getDescription('switchEffect'),

    "router.[screens HashList]./^[0-9a-z]+$/.backgroundColor": ScreenComponentsSchema.getDescription('backgroundColor'),
    "router.[screens HashList]./^[0-9a-z]+$/.components": ScreenComponentsSchema.getDescription('components'),
    "router.[screens HashList]./^[0-9a-z]+$/.tags": ScreenComponentsSchema.getDescription('tags'),
    "router.[screens HashList]./^[0-9a-z]+$/.staticMarkup": ScreenComponentsSchema.getDescription('staticMarkup')
};

// add common component properties from RemixWrapper
//REMIX_COMPONENTS_COMMON_PROPS_SCHEMA

// grab component schemas in one application schema
// Note: inside RemiwWrapper component schemas were extended with common properties: id, left, top etc..
const componentRootPath = `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/`;
Object.keys(componentSchemas).forEach( (s) => {
    const componentName = s.replace(/Schema/,'');
    Object.keys(componentSchemas[s]._schm).forEach( (prop) => {
        const path = `${componentRootPath} displayName=${componentName}].${prop}`;
        schemaData[path] = componentSchemas[s]._schm[prop];
    });
});

/**
 * Describes all main remix properties:
 *  router, screens, events etc...
 *
 */
const schema = new DataSchema(schemaData);
export default schema;