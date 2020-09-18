import DataSchema from '../../schema.js'
import { Schema as ScreenComponentsSchema } from '../../engage-ui/Screen.js'
import { Schema as RouterScreensSchema } from '../../engage-ui/router.js'
import { Schema as PopupSchema } from '../../engage-ui/Popup'

import { Schema as TextSchema } from '../../engage-ui/primitives/Text.js'
import { Schema as ProgressSchema } from '../../engage-ui/primitives/Progress.js'
import { Schema as TextOptionSchema } from '../../engage-ui/primitives/TextOption.js'
import { Schema as ButtonSchema } from '../../engage-ui/primitives/Button.js'
import { Schema as CollageSchema } from '../../engage-ui/primitives/Collage.js'
import { Schema as MemoryPlaygroundSchema } from '../../engage-ui/primitives/MemoryPlayground.js'
import { Schema as FbButton } from '../../engage-ui/primitives/social/FbButton.js'
import { Schema as ProgressiveImageSchema } from '../../engage-ui/primitives/ProgressiveImage.js'
import { Schema as InputSchema } from '../../engage-ui/primitives/Input'
import { Schema as UserDataFormSchema } from '../../engage-ui/UserDataForm'
import { Schema as RankBattlePlaygroundSchema } from '../../engage-ui/RankBattlePlayground'
//INSTRUCTION 1: add your new component schema before this line with name ComponentName+'Schema'

//INSTRUCTION 2: add your new component schema to this object:
const componentSchemas = {
    TextSchema,
    ProgressSchema,
    TextOptionSchema,
    ButtonSchema,
    CollageSchema,
    MemoryPlaygroundSchema,
    FbButton,
    ProgressiveImageSchema,
    InputSchema,
    UserDataFormSchema,
    RankBattlePlaygroundSchema,
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
    'router.showPopup': RouterScreensSchema.getDescription('showPopup'),
    'router.activePopupId': RouterScreensSchema.getDescription('activePopupId'),
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
    // Popups
    'router.[screens HashList]./^[0-9a-z]+$/.popups': ScreenComponentsSchema.getDescription('popups'),
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.margin': PopupSchema.getDescription('margin'),
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.backgroundColor': PopupSchema.getDescription(
        'backgroundColor',
    ),
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.backgroundImage': PopupSchema.getDescription(
        'backgroundImage',
    ),
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.components': PopupSchema.getDescription('components'),
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.staticMarkup': PopupSchema.getDescription(
        'staticMarkup',
    ),
    // Условные свойства компонентов
    // например 'router.screens.u2xt9e.__c.800.fjxjnr.top'
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.top': {
        type: 'number',
        min: -9999,
        max: 9999,
        default: 0,
        conditionOf: ({ screenId, popupId, popupComponentId, propName }) =>
            `router.screens.${screenId}.popups.${popupId}.components.${popupComponentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.left': {
        type: 'number',
        min: -9999,
        max: 9999,
        default: 0,
        conditionOf: ({ screenId, popupId, popupComponentId, propName }) =>
            `router.screens.${screenId}.popups.${popupId}.components.${popupComponentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.width': {
        type: 'number',
        min: 0,
        max: 9999,
        default: 100,
        conditionOf: ({ screenId, popupId, popupComponentId, propName }) =>
            `router.screens.${screenId}.popups.${popupId}.components.${popupComponentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.height': {
        type: 'number',
        min: 0,
        max: 9999,
        default: 100,
        conditionOf: ({ screenId, popupId, popupComponentId, propName }) =>
            `router.screens.${screenId}.popups.${popupId}.components.${popupComponentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.szTop': {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        canBeUndefined: true,
        conditionOf: ({ screenId, popupId, popupComponentId, propName }) =>
            `router.screens.${screenId}.popups.${popupId}.components.${popupComponentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.szLeft': {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        canBeUndefined: true,
        conditionOf: ({ screenId, popupId, popupComponentId, propName }) =>
            `router.screens.${screenId}.popups.${popupId}.components.${popupComponentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.szRight': {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        canBeUndefined: true,
        conditionOf: ({ screenId, popupId, popupComponentId, propName }) =>
            `router.screens.${screenId}.popups.${popupId}.components.${popupComponentId}.${propName}`,
    },
    'router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.adaptedui./^[0-9]+$/.props./^[0-9a-z]+$/.szBottom': {
        type: 'number',
        min: 0,
        max: 1024,
        default: 10,
        canBeUndefined: true,
        conditionOf: ({ screenId, popupId, popupComponentId, propName }) =>
            `router.screens.${screenId}.popups.${popupId}.components.${popupComponentId}.${propName}`,
    },
}

// add common component properties from RemixWrapper
//REMIX_COMPONENTS_COMMON_PROPS_SCHEMA

// grab component schemas in one application schema
// Note: inside RemiwWrapper component schemas were extended with common properties: id, left, top etc..
;[
    `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/`,
    `router.[screens HashList]./^[0-9a-z]+$/.popups./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/`,
].forEach(componentRootPath => {
    Object.keys(componentSchemas).forEach(s => {
        const componentName = s.replace(/Schema/, '')
        Object.keys(componentSchemas[s]._schm).forEach(prop => {
            const path = `${componentRootPath} displayName=${componentName}].${prop}`
            schemaData[path] = componentSchemas[s]._schm[prop]
        })
    })
})

/**
 * Describes all main remix properties:
 *  router, screens, events etc...
 *
 */
const schema = new DataSchema(schemaData)
export default schema
