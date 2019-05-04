export default example = {
    "fontSize": {
        min: 10,
        max: 80,
        default: 24,
        type: "number"
    },
    "color": {
        type: "string",
        default: "#888",
        format: Format.Color
    },
    "src": {
        type: 'string',
        minLength: 1,
        maxLength: 32,
        default: 'http://example.org/1.jpg',
        format: Format.Url
    },
    "fontFamily": {
        type: "string",
        default: "Arial",
        enum: ["Arial","Roboto","Times New Roman"]
    },
    "isVisible": {
        type: "boolean",
        default: true
    },
    "slides": {
        type: "HashList",
        minLength: 1,
        maxLength: 10,
        elementSchema: new DataSchema({
            "title": {
                type: "string",
                text: "Enter your text",
            },
            "img": {
                type: "string",
                default: "http://example.org/image.jpg",
                format: Format.Url
            }
        })
        // default: [] // specify default array elements
    }
};