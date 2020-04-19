// заготовка под задачу след спринта "тестирование адаптаций"

//TODO embed l.js

const LAYOUTS_SAMPLES = [
    `{"backgroundColor":"#4BBBCC","backgroundImage":"https://backend-dev-bucket.s3.eu-central-1.amazonaws.com/697676/media/62394/1970","components":{"_orderedIds":["815exm","x851ma"],"815exm":{"text":"U+60;p class=U+34;ql-align-centerU+34;U+62;U+60;strong class=U+34;ql-size-hugeU+34; style=U+34;color: rgb(255, 255, 255);U+34;U+62;ARE U+60;/strongU+62;U+60;strong class=U+34;ql-size-hugeU+34; style=U+34;color: rgb(230, 0, 0);U+34;U+62;YOUU+60;/strongU+62;U+60;strong class=U+34;ql-size-hugeU+34; style=U+34;color: rgb(255, 255, 255);U+34;U+62; GOOD AT GEOGRAPHY?U+60;/strongU+62;U+60;/pU+62;","fontShadow":false,"fontShadowColor":"rgba(0,0,0,0.2)","fontShadowDistance":3,"animationOnAppearance":"none","id":"none","tags":"remixcomponent","displayName":"Text","width":508,"widthStrategy":"fixed","height":108,"left":146,"leftStrategy":"dynamic","top":185.5,"displayType":"flow","data":{"nextScreenId":""}},"x851ma":{"text":"U+60;p class=U+34;ql-align-centerU+34;U+62;U+60;strong class=U+34;ql-size-largeU+34;U+62;Start quizU+60;/strongU+62;U+60;/pU+62;","sizeMod":"normal","borderRadius":4,"borderWidth":1,"borderColor":"#d8d8d8","dropShadow":true,"backgroundColor":"#70FF7A","id":"none","tags":"__plugin__coverStartBtn option","displayName":"Button","width":175,"widthStrategy":"fixed","height":52,"left":312.5,"leftStrategy":"dynamic","top":369.5,"displayType":"flow","data":{"nextScreenId":"","points":0}}},"tags":"__plugin__coverScreen start","disabled":false,"data":{"nextScreenId":"z6z9sh"}}`,
    `{"backgroundColor":"#4BBBCC","backgroundImage":"https://backend-dev-bucket.s3.eu-central-1.amazonaws.com/697676/media/62394/1970","components":{"_orderedIds":["815exm","x851ma"],"815exm":{"text":"U+60;p class=U+34;ql-align-centerU+34;U+62;U+60;strong class=U+34;ql-size-hugeU+34; style=U+34;color: rgb(255, 255, 255);U+34;U+62;ARE U+60;/strongU+62;U+60;strong class=U+34;ql-size-hugeU+34; style=U+34;color: rgb(230, 0, 0);U+34;U+62;YOUU+60;/strongU+62;U+60;strong class=U+34;ql-size-hugeU+34; style=U+34;color: rgb(255, 255, 255);U+34;U+62; GOOD AT GEOGRAPHY?U+60;/strongU+62;U+60;/pU+62;","fontShadow":false,"fontShadowColor":"rgba(0,0,0,0.2)","fontShadowDistance":3,"animationOnAppearance":"none","id":"none","tags":"remixcomponent","displayName":"Text","width":508,"widthStrategy":"fixed","height":108,"left":146,"leftStrategy":"dynamic","top":185.5,"displayType":"flow","data":{"nextScreenId":""}},"x851ma":{"text":"U+60;p class=U+34;ql-align-centerU+34;U+62;U+60;strong class=U+34;ql-size-largeU+34;U+62;Start quizU+60;/strongU+62;U+60;/pU+62;","sizeMod":"normal","borderRadius":4,"borderWidth":1,"borderColor":"#d8d8d8","dropShadow":true,"backgroundColor":"#70FF7A","id":"none","tags":"__plugin__coverStartBtn option","displayName":"Button","width":175,"widthStrategy":"fixed","height":52,"left":312.5,"leftStrategy":"dynamic","top":369.5,"displayType":"flow","data":{"nextScreenId":"","points":0}}},"tags":"__plugin__coverScreen start","disabled":false,"data":{"nextScreenId":"z6z9sh"}}`,
]

const PROJECT_TYPES = {
    trivia: {
        html: '',
        script: '',
        css: '',
    },
    photostory: {},
}

LAYOUTS_SAMPLES.forEach(json => {
    //TODO create root div

    //TODO load any project type? or no, dummy type?

    new RemixContainer({
        mode: 'preview',
        element: document.getElementById('id-app_preview_remix_cnt'),
        url: projectTypeData.html,
        scriptUrl: projectTypeData.script,
        cssUrl: projectTypeData.css,
        width: 800,
        height: 600,
        containerLog: true,
        defaults: null,
        forceRestart: true,
        onAppChange: event => {
            switch (event) {
                case 'inited': {
                    //TODO add screens LAYOUTS_SAMPLES into each app
                }
            }
        },
    })

    //TODO then container.setSize(300, 600) for all containers
})
