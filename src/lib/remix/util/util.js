export function getUniqueId() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

export function isHashlistInstance(obj) {
    return obj && obj._orderedIds && obj._orderedIds.length >= 0;
    //return obj.constructor && typeof obj.constructor.name === "string" && obj.constructor.name.toLowerCase() === "hashlist";
}