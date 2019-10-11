import { EngageAppSchema } from '../../engage-ui/EngageApp.js'
import DataSchema from '../../schema.js';
import { Schema as ScreenComponentsSchema} from '../../engage-ui/Screen.js'
import { Schema as RouterScreensSchema} from '../../engage-ui/router.js'
import { Schema as TextSchema} from '../../engage-ui/primitives/Text.js'
import { Schema as ProgressSchema} from '../../engage-ui/primitives/Progress.js'


/**
 * Describes all main remix properties:
 *  router, screens, events etc...
 *
 */
const schema = new DataSchema({
    "app.size.width": EngageAppSchema.getDescription("width"),
    "app.size.height": EngageAppSchema.getDescription("height"),
    "router.[screens HashList]": RouterScreensSchema.getDescription('screens'),
    "router.currentScreenId": RouterScreensSchema.getDescription('currentScreenId'),
    "router.[screens HashList]./^[0-9a-z]+$/.backgroundColor": ScreenComponentsSchema.getDescription('backgroundColor'),
    "router.[screens HashList]./^[0-9a-z]+$/.components": ScreenComponentsSchema.getDescription('components'),
    "router.[screens HashList]./^[0-9a-z]+$/.components./^[0-9a-z]+$/.color": TextSchema.getDescription('color'),
    "router.[screens HashList]./^[0-9a-z]+$/.components./^[0-9a-z]+$/.tags": TextSchema.getDescription('tags'),
    "router.[screens HashList]./^[0-9a-z]+$/.components./^[0-9a-z]+$/.displayName": TextSchema.getDescription('displayName'),
    "router.[screens HashList]./^[0-9a-z]+$/.components./^[0-9a-z]+$/.width": TextSchema.getDescription('width'),

    "router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ displayName=Progress].max": ProgressSchema.getDescription('max'),
    "router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ displayName=Progress].step": ProgressSchema.getDescription('step')
});

export default schema;