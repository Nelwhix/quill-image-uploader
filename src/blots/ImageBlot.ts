import Quill from "quill";
import Parchment from 'parchment'

class ImageBlot extends Parchment.Block {
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
}

Quill.register({ "formats/imageBlot": ImageBlot})

export default ImageBlot;
