/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 * 
 */

"use strict";
var subjectObject = {
    "male": [
        "shirt",
        "t-shirt",
        "jeans"],
    
    "female": [
        "Dress",
        "Saree",
        "Western Wear",
        "t-shirt",
        "jeans"
    ]
}
window.onload = function () {
    var subjectSel = document.getElementById("product_category");
    var topicSel = document.getElementById("type");

    for (var x in subjectObject) {
        subjectSel.options[subjectSel.options.length] = new Option(x, x);
    }
    subjectSel.onchange = function () {
        //empty Chapters dropdown
        topicSel.length = 1;
        //display correct values
        var y = subjectObject[this.value];
        for (var i = 0; i < y.length; i++) {
            topicSel.options[topicSel.options.length] = new Option(y[i], y[i]);
        }
    }
}
