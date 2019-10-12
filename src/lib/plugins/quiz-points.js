/**
 * Плагин добавляет
 *
 * @param {array} options.pointElementTag
 */
export default function initQuizPoints(options = {remix: null, pointElementTag: null}) {

    const pointElementTag = options.pointElementTag,
        remix = options.remix;

    remix.extendSchema({
        "router.[screens HashList]./^[0-9a-z]+$/.components./^[0-9a-z]+$/.data.points": {
            type: 'string',
            default: ''
        }
    });

    //TODO написать автоматическое добавление и регулировку points у каждого компонента (с тегом pointElementTag) ?
    // может быть новый тип события добавить component added
}