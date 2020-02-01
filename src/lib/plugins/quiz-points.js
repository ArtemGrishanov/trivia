/**
 * Плагин добавляет
 *
 * @param {array} options.pointElementTag
 */
export default function initQuizPoints(options = {remix: null, tag: null}) {

    const pointElementTag = options.tag,
        remix = options.remix;

    remix.extendSchema({
        "router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ tags=~option].data.points": {
            type: 'number',
            min: 0,
            max: 1,
            default: 0
        }
    });

    //TODO
    // 'points" добавляется к лишним компонентам не по тегу
    // в итоге контролов лишних на установку поинтов создается слишком много
    //  schema по тегу

    //
    // можно ли положиться на тег? Если теги могут меняться?
    //      -- другие плагины уже полагаются
    // ...
    // подумать над автотестами, а то как то слишком много зависимостей?
    //
    //
    //
}