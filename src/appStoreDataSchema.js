// import { RemixFormat } from './lib/remix'
import { EngageAppSchema } from './lib/engage-ui/EngageApp.js'
import DataSchema from './lib/schema.js';
import QuizSlide from './lib/engage-ui/quiz/QuizSlide.js';
import HashList from './lib/hashlist.js';
//import { ProgressiveImage } from 'remix-ui'

// Definition of dynamic editable data
const schema = new DataSchema({
    "app.size.width": EngageAppSchema.getDescription("width"),
    "app.size.height": EngageAppSchema.getDescription("height"),

    // // for all properties which match the pattern "quiz.questions.0.text, quiz.questions.1.text ... quiz.questions.999.text ... "

    // quiz.[questions HashList].ugltc7.text - это path без указания типа? откуда мы знаем что надо искать/создавать HashList
    "quiz.[questions HashList]./^[0-9a-z]+$/.text": {
        //createIfNotExist: false,
        type: "string",
        default: "Input your question"
    },
    // //TODO how to make this optional - do not create this properties in store, just normalize
    // "quiz.questions{HashList.elements}.img": {
    //     createIfNotExist: false,
    //     type: "Url",
    //     default: "htts://p.testix.me/images/stub.jpg"
    // },

    "quiz.[questions HashList]": {
        type: "hashlist",
        default: new HashList([
            { text: "Input your question" },
            { text: "Input your question num2" }
        ]),
        minLength: 1,
        maxLength: 20,
        // arrays elements to add by clonning
        prototypes: [
            {id: "text_slide", data: { type: "text_slide", text: "Input your question here" }},
            {id: "text_img_slide", data: { type: "text_img_slide", text: "Input your question here", img: "https://p.testix.me/images/stub.jpg"}}
        ],
        // elementSchema: не схема, а просто объекты которые можно клонировать
        // а схему их просто в отдельных path описать
        // elementSchema: new DataSchema.Prototype({
        //     "text": {
        //         type: "string",
        //         default: "Input your question"
        //     }
        //     //"options": "quiz.questions.options"
        // }),
        //addAction: "ADD_ACTION", // when element was added, this action will be called for client
        //deleteAction: "DELETE_ACTION" // when element was deleted, this action will be called for client
    },

    "quiz.[questions HashList]./^[0-9a-z]+$/.options": {
        type: "hashlist",
        default: new HashList([
            { text: "Option 1", points: 1},
            { text: "Option 2", points: 0}
        ]),
        minLength: 1,
        maxLength: 9,
        prototypes: [
            {id: "text_option", data: { type: "text_option", text: "New option", points: 0}}
        ]
    },

    "quiz.[questions HashList]./^[0-9a-z]+$/.options./^[0-9a-z]+$/.text": {
        type: "string",
        default: "Option text",
        minLength: 1,
        maxLength: 256
    },

    "quiz.[results HashList]": {
        type: "hashlist",
        default: new HashList([
            { title: "Result 1", description: "Result 1 description" },
            { title: "Result 2", description: "Result 2 description" }
        ]),
        minLength: 1,
        maxLength: 9,
        prototypes: [
            {id: "result_with_text", data: { type: "result_with_text", title: "New result", description: "Result description"}}
        ]
    },

    "style.startBackgroundColor": {
        type: "color",
        default: "#777"
        //css: true ?
        // 1) можно делать традиционно через обновление стора-коннект и руками прописать стиль в компонент
        // тогда добавить "css" атрибут и как формировать css строку
        // 
        //
        
        // 2) а можно описать здесь селектор как было в MutApp
        // так проще добавлять новые стили
        // но не будет событий, подписки на события, общего механизма. как отслеживать и обновлять актуальное значение цвета
        //TODO посмотреть что там было
    }

    // quiz.points.setCorrectPoints - how to set correct answer only for one option

    // ,view: {
    //     //TODO надо ли это тут или на уровен редактора надо?
    //     "app_start_screen": {
    //         component: "App",
    //         name: "Main Screen",
    //         group: "default",
    //         canCollapse: false
    //     }
    // },
    // data: {
    //     "list.listBackgroundColor": {
    //         default: "#ddd"
    //     },
    //     "main.slides": {
    //         type: 'array',
    //         minElements: 1,
    //         maxElements: 10,
    //         elementSchema: {
    //             text: 'Enter your text',
    //             imgSrc: 'http://example.org/image.jpg'
    //         },
    //         default: [
    //             {
    //                 title: "Title Cat Title Cat Title Cat Title Cat Title Cat Title Cat Title Cat Title Cat Title Cat Title Cat Title Cat Title Cat ",
    //                 description: "First slide description",
    //                 img: "https://img.playbuzz.com/image/upload/q_auto:good,f_auto,fl_lossy,w_640,c_limit/v1546874039/vpwggndpcqrmhtnoxu6z.jpg"
    //             },
    //             {
    //                 title: "Title Lion",
    //                 description: "Second slide description",
    //                 img: "https://img.playbuzz.com/image/upload/q_auto:good,f_auto,fl_lossy,w_640,c_limit/v1546874061/dqnnnich211glmqxggyx.jpg"
    //             }
    //         ]
    //     },
    //     "main.slides.title": {
    //         maxLength: 300,
    //         type: "string"
    //     },
    //     //"main.slides.{{number}}.img": ProgressiveImage.schema,

    //     //TODO:
    //     // можно импортировать этот кусочек схемы и вставить в приложение
    //     // и для каждого элемента массива вставить например
    //     // как тестировать: почти мини приложение получается
    //     "main.slides.{{number}}.img": {
    //         blur: {
    //             type: "boolean",
    //             default: false
    //         },
    //         animate: {

    //         },
    //         src: {
    //             type: "string",
    //             default: "//p.testix.me/2343"
    //         },
    //         smallSrc: {
    //             type: "string",
    //             default: "//p.testix.me/3455"
    //         },
    //         size: {
    //             enum: ['cover', 'contain', 'actial']
    //         },
    //         width: {

    //         },
    //         height: {

    //         }
    //     }
    //}
});

export default schema;
