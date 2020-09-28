import DataSchema from '../../schema.js'
import { Schema as ScreenComponentsSchema } from '../../engage-ui/Screen.js'
import { Schema as RouterScreensSchema } from '../../engage-ui/router.js'
import { Schema as TextSchema } from '../../engage-ui/primitives/Text.js'
import { Schema as ButtonSchema } from '../../engage-ui/primitives/Button.js'
import { Schema as FbButton } from '../../engage-ui/primitives/social/FbButton.js'
import { Schema as ProgressiveImageSchema } from '../../engage-ui/primitives/ProgressiveImage.js'
/*IFTRUE_useCollage*/
import { Schema as CollageSchema } from '../../engage-ui/primitives/Collage.js'
/*FITRUE_useCollage*/
/*IFTRUE_useProgress*/
import { Schema as ProgressSchema } from '../../engage-ui/primitives/Progress.js'
/*FITRUE_useProgress*/
/*IFTRUE_useTextOption*/
import { Schema as TextOptionSchema } from '../../engage-ui/primitives/TextOption.js'
/*FITRUE_useTextOption*/
/*IFTRUE_isMemory*/
import { Schema as MemoryPlaygroundSchema } from '../../engage-ui/primitives/MemoryPlayground.js'
/*FITRUE_isMemory*/
/*IFTRUE_useUserDataForm*/
import { Schema as InputSchema } from '../../engage-ui/primitives/Input'
import { Schema as UserDataFormSchema } from '../../engage-ui/UserDataForm'
/*FITRUE_useUserDataForm*/
/*IFTRUE_isRankBattle*/
import { Schema as RankBattlePlaygroundSchema } from '../../engage-ui/RankBattlePlayground'
/*FITRUE_isRankBattle*/
/*IFTRUE_isBeforeAfter*/
import { Schema as BeforeAfterSchema } from '../../engage-ui/BeforeAfter'
/*FITRUE_isBeforeAfter*/

//INSTRUCTION 1: add your new component schema before this line with name ComponentName+'Schema'

//INSTRUCTION 2: add your new component schema to this object:
const componentSchemas = {
    TextSchema,
    ButtonSchema,
    FbButton,
    ProgressiveImageSchema,
    /*IFTRUE_useCollage*/
    CollageSchema,
    /*FITRUE_useCollage*/
    /*IFTRUE_useProgress*/
    ProgressSchema,
    /*FITRUE_useProgress*/
    /*IFTRUE_useTextOption*/
    TextOptionSchema,
    /*FITRUE_useTextOption */
    /*IFTRUE_isMemory*/
    MemoryPlaygroundSchema,
    /*FITRUE_isMemory */
    /*IFTRUE_useUserDataForm*/
    InputSchema,
    UserDataFormSchema,
    /*FITRUE_useUserDataForm */
    /*IFTRUE_isRankBattle*/
    RankBattlePlaygroundSchema,
    /*FITRUE_isRankBattle*/
    /*IFTRUE_isBeforeAfter*/
    BeforeAfterSchema,
    /*FITRUE_isBeforeAfter*/
    // put new schema here before just this line
}

const schemaData = {
    'app.size.height': {
        type: 'number',
        min: 100,
        max: 4000,
        default: 600,
    },
    'app.screen': {
        type: 'string',
        enum: ['mobile', 'desktop'],
        default: 'desktop',
    },
    'app.sessionsize.width': {
        type: 'number',
        min: 300,
        max: 4000,
        default: 800,
        serialize: false,
    },
    'app.sessionsize.height': {
        type: 'number',
        min: 100,
        max: 12000,
        default: 600,
        serialize: false,
    },
    'router.[screens HashList]': RouterScreensSchema.getDescription('screens'),
    'router.currentScreenId': RouterScreensSchema.getDescription('currentScreenId'),
    'router.displayMode': RouterScreensSchema.getDescription('displayMode'),
    'router.backgroundColor': RouterScreensSchema.getDescription('backgroundColor'),
    'router.switchEffect': RouterScreensSchema.getDescription('switchEffect'),
    'router.[screens HashList]./^[0-9a-z]+$/.backgroundColor': ScreenComponentsSchema.getDescription('backgroundColor'),
    'router.[screens HashList]./^[0-9a-z]+$/.backgroundImage': ScreenComponentsSchema.getDescription('backgroundImage'),
    'router.[screens HashList]./^[0-9a-z]+$/.components': ScreenComponentsSchema.getDescription('components'),
    'router.[screens HashList]./^[0-9a-z]+$/.tags': ScreenComponentsSchema.getDescription('tags'),
    'router.[screens HashList]./^[0-9a-z]+$/.staticMarkup': ScreenComponentsSchema.getDescription('staticMarkup'),
    'router.[screens HashList]./^[0-9a-z]+$/.disabled': ScreenComponentsSchema.getDescription('disabled'),
    // Условные свойства компонентов
    // например 'router.screens.u2xt9e.__c.800.fjxjnr.top'
    'router.[screens HashList]./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.top': {
        type: 'number',
        min: -9999,
        max: 9999,
        default: 0,
        conditionOf: ({ screenId, componentId, propName }) =>
            `router.screens.${screenId}.components.${componentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.left': {
        type: 'number',
        min: -9999,
        max: 9999,
        default: 0,
        conditionOf: ({ screenId, componentId, propName }) =>
            `router.screens.${screenId}.components.${componentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.width': {
        type: 'number',
        min: 0,
        max: 9999,
        default: 100,
        conditionOf: ({ screenId, componentId, propName }) =>
            `router.screens.${screenId}.components.${componentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.height': {
        type: 'number',
        min: 0,
        max: 9999,
        default: 100,
        conditionOf: ({ screenId, componentId, propName }) =>
            `router.screens.${screenId}.components.${componentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.szTop': {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        canBeUndefined: true,
        conditionOf: ({ screenId, componentId, propName }) =>
            `router.screens.${screenId}.components.${componentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.szLeft': {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        canBeUndefined: true,
        conditionOf: ({ screenId, componentId, propName }) =>
            `router.screens.${screenId}.components.${componentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.szRight': {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        canBeUndefined: true,
        conditionOf: ({ screenId, componentId, propName }) =>
            `router.screens.${screenId}.components.${componentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.szBottom': {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        canBeUndefined: true,
        conditionOf: ({ screenId, componentId, propName }) =>
            `router.screens.${screenId}.components.${componentId}.${propName}`,
    },
}

// add common component properties from RemixWrapper
//REMIX_COMPONENTS_COMMON_PROPS_SCHEMA

// grab component schemas in one application schema
// Note: inside RemiwWrapper component schemas were extended with common properties: id, left, top etc..
const componentRootPath = `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/`
Object.keys(componentSchemas).forEach(s => {
    const componentName = s.replace(/Schema/, '')
    Object.keys(componentSchemas[s]._schm).forEach(prop => {
        const path = `${componentRootPath} displayName=${componentName}].${prop}`
        schemaData[path] = componentSchemas[s]._schm[prop]
    })
})

/**
 * Describes all main remix properties:
 *  router, screens, events etc...
 *
 */
const schema = new DataSchema(schemaData)
export default schema
