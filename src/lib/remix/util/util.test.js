import { elementToHtml, cutTextEditor, cutRmxEditingBorders, removeUnnecessaryItemsFromScreen } from './util'

describe('elementToHtml', () => {
    it('should transform html element to string', () => {
        const div = document.createElement('div')
        expect(elementToHtml(div)).toEqual('<div></div>')

        const innerSting = `<div><p>some text</p></div>`
        div.innerHTML = innerSting
        expect(elementToHtml(div)).toEqual(`<div>${innerSting}</div>`)
    })
})

describe('cutTextEditor', () => {
    /**
     * Дожен заменить все что находится в .rmx-text-editor на
     * <div class="ql-container ql-snow ql-disabled">
     *     <div class="ql-editor">...</div>
     * </div>
     */
    it('should remove unnecessary editor elements for preview', () => {
        const template = `
            <div class="rmx-text-editor">
                <ul>...</ul>
                <ul>...</ul>
                <ul>...</ul>
                some text
                <div class="ql-editor">
                    <p>Text 1</p>
                    <p>Text 2</p>
                </div>
                <div>unnecessary elements</div>
                <ul>...</ul>
            </div>
            <div class="rmx-text-editor">
                <ul>...</ul>
                <div class="ql-editor">
                    <p>Text 2</p>
                </div>
                <ul>...</ul>
            </div>
        `
        const resultTemplate = `
            <div class="rmx-text-editor">
                <div class="ql-container ql-snow ql-disabled">
                    <div class="ql-editor">
                        <p>Text 1</p>
                        <p>Text 2</p>
                    </div>
                </div>
            </div>
            <div class="rmx-text-editor">
                <div class="ql-container ql-snow ql-disabled">
                    <div class="ql-editor">
                        <p>Text 2</p>
                    </div>
                </div>
            </div>
        `.replace(/ |\n/g, '')

        document.body.innerHTML = template
        const templateAsString = cutTextEditor(document.body).innerHTML.replace(/ |\n/g, '')

        expect(templateAsString).toEqual(resultTemplate)
    })
})

describe('cutRmxEditingBorders', () => {
    /**
     * Дожен удалить все элементы с классом .rmx-layout_item_selection_cnt
     */
    it('should remove unnecessary remix borders elements for preview', () => {
        const template = `
            <div>
                <div>Content</div>
                <div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                </div>
            </div>
        `
        const resultTemplate = `
            <div>
                <div>Content</div>
                <div></div>
            </div>`.replace(/ |\n/g, '')

        document.body.innerHTML = template
        const templateAsString = cutRmxEditingBorders(document.body).innerHTML.replace(/ |\n/g, '')

        expect(templateAsString).toEqual(resultTemplate)
    })
})

describe('removeUnnecessaryItemsFromScreen', () => {
    /**
     * Дожен заменить все что находится в .rmx-text-editor на
     * <div class="ql-container ql-snow ql-disabled">
     *     <div class="ql-editor">...</div>
     * </div>
     * и удалить элементы с классом .rmx-layout_item_selection_cnt (бордеры при выделении элемента)
     */
    it('should remove unnecessary elements (editor and remix borders)', () => {
        const template = `
            <div class="rmx-text-editor">
                <ul>...</ul>
                <ul>...</ul>
                <ul>...</ul>
                some text
                <div class="ql-editor">
                    <p>Text 1</p>
                    <p>Text 2</p>
                    <div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                </div>
                </div>
                <div>unnecessary elements</div>
                <ul>...</ul>
            </div>
            <div class="rmx-text-editor">
                <ul>...</ul>
                <div class="ql-editor">
                    <p>Text 2</p>
                    <div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                    <div class="rmx-layout_item_selection_cnt"></div>
                </div>
                </div>
                <ul>...</ul>
            </div>
        `
        const resultTemplate = `
            <div class="rmx-text-editor">
                <div class="ql-container ql-snow ql-disabled">
                    <div class="ql-editor">
                        <p>Text 1</p>
                        <p>Text 2</p>
                        <div></div>
                    </div>
                </div>
            </div>
            <div class="rmx-text-editor">
                <div class="ql-container ql-snow ql-disabled">
                    <div class="ql-editor">
                        <p>Text 2</p>
                        <div></div>
                    </div>
                </div>
            </div>
        `.replace(/ |\n/g, '')

        document.body.innerHTML = template
        const templateAsString = removeUnnecessaryItemsFromScreen(document.body).innerHTML.replace(/ |\n/g, '')

        expect(templateAsString).toEqual(resultTemplate)
    })
})
