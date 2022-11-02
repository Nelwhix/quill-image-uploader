import Quill from "quill";

const InlineBlot = Quill.import("blots/block")

class LoadingImage extends InlineBlot {
    static blotName = "imageBlot";
    className = "image-uploading";
    tagName = "span";

    static create(src: string) {
        const node = super.create(src);
        const image = document.createElement("img")
        image.setAttribute("src", src);
        node.appendChild(image);
        return node;
    }

    deleteAt(index: number, length: number) {
        super.deleteAt(index, length);
        this.cache = {};
    }

    static value(domNode) {
        const { src, custom } = domNode.dataset;
        return { src, custom }
    }
}

Quill.register({ "formats/imageBlot": LoadingImage})

export default LoadingImage;
