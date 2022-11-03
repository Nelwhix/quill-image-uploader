import Quill from "quill";

const InlineBlot = Quill.import("blots/block");

class ImageBlot extends InlineBlot {
    static blotName = "imageBlot";
    static className = "image-uploading";
    static tagName = "span";

    static create(src: string): Node {
        const node = super.create(src);
        const image = document.createElement("img")
        image.setAttribute("src", src);
        node.appendChild(image);
        return node;
    }

    deleteAt(index: number, length: number) {
        super.deleteAt(index, length);
    }

    static value(domNode: HTMLElement) {
        const { src, custom } = domNode.dataset
        return { src, custom};
    }
}

Quill.register({ "formats/imageBlot": ImageBlot})

export default ImageBlot;
