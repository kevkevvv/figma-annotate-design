"use strict";
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
    width: 360,
    height: 612,
    title: "Annotate Design",
    themeColors: true,
});
// Check if something is selected on the artboard
// This function checks if something is selected on the artboard
function checkSelection() {
    if (figma.currentPage.selection.length === 0) {
        figma.ui.postMessage({
            type: "no-element-selected",
        });
    }
    else {
        figma.ui.postMessage({
            type: "element-selected",
        });
    }
}
// Run the checkSelection function
checkSelection();
// Listen for selection changes
figma.on("selectionchange", () => {
    checkSelection();
});
// Load the fonts async function
const loadingFontFunction = () => __awaiter(void 0, void 0, void 0, function* () {
    yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
    yield figma.loadFontAsync({ family: "Inter", style: "Medium" });
    yield figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
});
// HEX to RGB function -- This one returns the RGB color as Figma uses it, with values between 0 and 1
function hexToRGB(hex) {
    // Remove the leading "#" from the hex string
    hex = hex.slice(1);
    // Convert the hex string to a number
    const value = parseInt(hex, 16);
    // Extract the red, green, and blue values from the number
    const r = ((value >> 16) & 255) / 255;
    const g = ((value >> 8) & 255) / 255;
    const b = (value & 255) / 255;
    // Return the RGB values as an object
    return { r, g, b };
}
// Creating variables for colors
const backgroundColor = hexToRGB("#131314");
const textColor = hexToRGB("#FFFFFF");
const borderColor = hexToRGB("#44474A");
// Create annotation function
function createAnnotation(annotationPosition, annotationTitle, annotationContent) {
    let currentSelection = figma.currentPage.selection[0];
    let currentBounds = currentSelection.absoluteBoundingBox;
    let textFrameWidth;
    let textFrameHeight;
    // Annotation dot
    function dot() {
        const annotationDot = figma.createEllipse();
        annotationDot.name = "Dot";
        annotationDot.resize(8, 8);
        annotationDot.fills = [
            {
                type: "SOLID",
                color: backgroundColor,
            },
        ];
        annotationFrame.appendChild(annotationDot);
    }
    // Annotation line
    function line() {
        const annotationLine = figma.createRectangle();
        annotationLine.name = "Line";
        annotationLine.layoutGrow = 1;
        annotationLine.fills = [
            {
                type: "SOLID",
                color: backgroundColor,
            },
        ];
        if (annotationPosition === "right" || annotationPosition === "left") {
            annotationLine.resize(100, 2);
        }
        else if (annotationPosition === "top" ||
            annotationPosition === "bottom") {
            annotationLine.resize(2, 100);
        }
        annotationFrame.appendChild(annotationLine);
    }
    // Text frame
    function textFrame() {
        const annotationTextFrame = figma.createFrame();
        annotationTextFrame.name = "Content";
        annotationTextFrame.layoutMode = "VERTICAL";
        annotationTextFrame.layoutAlign = "STRETCH";
        annotationTextFrame.itemSpacing = 0;
        annotationTextFrame.fills = [
            {
                type: "SOLID",
                color: backgroundColor,
            },
        ];
        annotationTextFrame.strokes = [
            {
                type: "SOLID",
                color: borderColor,
            },
        ];
        annotationTextFrame.effects = [
            {
                type: "DROP_SHADOW",
                color: {
                    r: 0.07450980693101883,
                    g: 0.07450980693101883,
                    b: 0.0784313753247261,
                    a: 0.12,
                },
                offset: { x: 0, y: 3 },
                radius: 8,
                visible: true,
                blendMode: "NORMAL",
            },
        ];
        annotationTextFrame.cornerRadius = 8;
        annotationTextFrame.paddingLeft = 16;
        annotationTextFrame.paddingRight = 16;
        annotationTextFrame.paddingTop = 8;
        annotationTextFrame.paddingBottom = 8;
        annotationFrame.appendChild(annotationTextFrame);
        // Text frame content
        const createText = (nameText, contentText, font) => {
            const text = figma.createText();
            text.name = nameText;
            text.characters = contentText.toString();
            text.fontName = font;
            text.fontSize = 14;
            text.fills = [{ type: "SOLID", color: textColor }];
            return text;
        };
        const content = createText("Content", annotationContent, {
            family: "Inter",
            style: "Regular",
        });
        let titleWidth = 0;
        let titleLayer;
        if (annotationTitle !== "") {
            const title = createText("Title", annotationTitle, {
                family: "Inter",
                style: "Semi Bold",
            });
            annotationTextFrame.appendChild(title);
            titleWidth = title.width;
            titleLayer = title;
        }
        annotationTextFrame.appendChild(content);
        if (titleWidth > 360 || content.width > 360) {
            annotationTextFrame.resize(360, annotationTextFrame.height);
            annotationTextFrame.primaryAxisSizingMode = "AUTO";
            annotationTextFrame.counterAxisSizingMode = "FIXED";
            content.layoutAlign = "STRETCH";
            if (titleLayer) {
                titleLayer.layoutAlign = "STRETCH";
            }
        }
        else {
            annotationTextFrame.primaryAxisSizingMode = "AUTO";
            annotationTextFrame.counterAxisSizingMode = "AUTO";
        }
        textFrameWidth = annotationTextFrame.width;
        textFrameHeight = annotationTextFrame.height;
    }
    // Annotation Frame
    const annotationFrame = figma.createFrame();
    annotationFrame.name = `${currentSelection.name} Annotation`;
    annotationFrame.fills = [];
    annotationFrame.primaryAxisSizingMode = "FIXED";
    annotationFrame.counterAxisSizingMode = "AUTO";
    annotationFrame.primaryAxisAlignItems = "CENTER";
    annotationFrame.counterAxisAlignItems = "CENTER";
    annotationFrame.itemSpacing = -2;
    // Check if there is an existing parent frame that would hold the annotations
    const existingFrame = figma.currentPage.findChild((layer) => layer.name === "🗒️ Annotations" && layer.type === "FRAME");
    // If there is no existing parent frame, create one and add the annotation frame to it
    if (!existingFrame) {
        const parentFrame = figma.createFrame();
        parentFrame.name = "🗒️ Annotations";
        parentFrame.locked = true;
        parentFrame.fills = [];
        parentFrame.clipsContent = false;
        figma.currentPage.appendChild(parentFrame);
        parentFrame.appendChild(annotationFrame);
    }
    else if (existingFrame && existingFrame.type === "FRAME") {
        existingFrame.appendChild(annotationFrame);
    }
    // Function to set the annotation frame properties
    function setAnnotationFrameProperties(annotationPosition) {
        if (annotationPosition === "right" || annotationPosition === "left") {
            annotationFrame.layoutMode = "HORIZONTAL";
            annotationFrame.layoutAlign = "STRETCH";
        }
        else if (annotationPosition === "top" ||
            annotationPosition === "bottom") {
            annotationFrame.layoutMode = "VERTICAL";
            annotationFrame.layoutAlign = "STRETCH";
        }
    }
    // Function to set the annotation frame properties based on the position
    function positionAnnotationFrame(annotationPosition) {
        if (currentBounds !== null) {
            switch (annotationPosition) {
                case "top":
                    annotationFrame.resize(textFrameWidth, textFrameHeight + 80);
                    annotationFrame.x = Math.round(currentBounds.x + currentSelection.width / 2 - textFrameWidth / 2);
                    annotationFrame.y = Math.round(currentBounds.y - annotationFrame.height + 4);
                    break;
                case "bottom":
                    annotationFrame.resize(textFrameWidth, textFrameHeight + 80);
                    annotationFrame.x = Math.round(currentBounds.x + currentSelection.width / 2 - textFrameWidth / 2);
                    annotationFrame.y = Math.round(currentBounds.y + currentSelection.height - 4);
                    break;
                case "left":
                    annotationFrame.resize(textFrameWidth + 80, textFrameHeight);
                    annotationFrame.x = Math.round(currentBounds.x - annotationFrame.width + 4);
                    annotationFrame.y = Math.round(currentBounds.y + currentSelection.height / 2 - textFrameHeight / 2);
                    break;
                case "right":
                    annotationFrame.resize(textFrameWidth + 80, textFrameHeight);
                    annotationFrame.x = Math.round(currentBounds.x + currentSelection.width - 4);
                    annotationFrame.y = Math.round(currentBounds.y + currentSelection.height / 2 - textFrameHeight / 2);
                    break;
            }
        }
    }
    // Calling the function to position the annotation based on the selected position
    if (annotationPosition === "top") {
        textFrame();
        line();
        dot();
        setAnnotationFrameProperties(annotationPosition);
        positionAnnotationFrame(annotationPosition);
        annotationFrame.itemReverseZIndex = true;
    }
    else if (annotationPosition === "bottom") {
        dot();
        line();
        textFrame();
        setAnnotationFrameProperties(annotationPosition);
        positionAnnotationFrame(annotationPosition);
    }
    else if (annotationPosition === "left") {
        textFrame();
        line();
        dot();
        setAnnotationFrameProperties(annotationPosition);
        positionAnnotationFrame(annotationPosition);
        annotationFrame.itemReverseZIndex = true;
    }
    else if (annotationPosition === "right") {
        dot();
        line();
        textFrame();
        setAnnotationFrameProperties(annotationPosition);
        positionAnnotationFrame(annotationPosition);
    }
    else {
        figma.notify("Please select a position for the annotation.");
    }
}
// Getting the information from the UI and calling the function to create the annotation
figma.ui.onmessage = (msg) => {
    if (msg.type === "add-annotation") {
        loadingFontFunction()
            .then(() => {
            createAnnotation(msg.position, msg.title, msg.content);
            figma.notify("Annotation added.");
        })
            .catch(() => {
            figma.notify("Something went wrong. 😔");
        });
    }
};
