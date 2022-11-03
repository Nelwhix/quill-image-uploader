import Quill, { RangeStatic } from "quill";
import ImageBlot from "./blots/ImageBlot";

import "./style.css";

type quillOptions = {
    upload: (file: File) => Promise<string>;
}

class ImageUploader {
    quill: Quill;
    options: quillOptions;
    range: RangeStatic | null;
    fileHolder: HTMLInputElement;

    constructor(quill: Quill, options: quillOptions) {
        this.quill = quill;
        this.options = options;
        this.range = null;

        let toolbar = this.quill.getModule("toolbar");
        toolbar.addHandler("image", this.selectLocalImage.bind(this));

        this.handleDrop = this.handleDrop.bind(this);
        this.handlePaste = this.handlePaste.bind(this);

        this.quill.root.addEventListener("drop", this.handleDrop, false);
        this.quill.root.addEventListener("paste", this.handlePaste, false);
    }

    selectLocalImage() {
        this.quill.focus();
        this.range = this.quill.getSelection();
        this.fileHolder = document.createElement("input");
        this.fileHolder.setAttribute("type", "file");
        this.fileHolder.setAttribute("accept", "image/*");
        this.fileHolder.setAttribute("style", "visibility:hidden");

        this.fileHolder.onchange = this.fileChanged.bind(this);

        document.body.appendChild(this.fileHolder);
        this.fileHolder.click()

        window.requestAnimationFrame(() => {
            document.body.removeChild(this.fileHolder);
        })
    }

    fileChanged() {
        if (this.fileHolder.files) {
            const file = this.fileHolder.files[0]
            this.readAndUpload(file)
        }
    }

    handleDrop(evt: DragEvent) {
        evt.stopPropagation();
        evt.preventDefault();

        if (evt.dataTransfer && evt.dataTransfer.files && evt.dataTransfer.files.length) {
            const selection = document.getSelection();
            const range = document.caretRangeFromPoint(evt.clientX, evt.clientY);

            if (selection && range) {
                selection.setBaseAndExtent(
                    range.startContainer,
                    range.startOffset,
                    range.startContainer,
                    range.startOffset
                )
            }
        }

        this.quill.focus();
        this.range = this.quill.getSelection();
        let file = evt.dataTransfer?.files[0];

        if (file) {
            this.readAndUpload(file)
        }
    }

    handlePaste(evt: ClipboardEvent) {
        let clipboard = evt.clipboardData;

        if (clipboard && clipboard.items) {
            let items = clipboard.items;
            const IMAGE_MIME_REGEX = /^image\/(jpe?g|gif|png|svg|webp)$/i;

            for (let i = 0; i < items.length; i++) {
                if (IMAGE_MIME_REGEX.test(items[i].type)) {
                    let file = items[i].getAsFile()

                    this.quill.focus();
                    this.range = this.quill.getSelection()
                    evt.preventDefault()

                    if (file) {
                        this.readAndUpload(file)
                    }
                }
            }
        }
    }

    readAndUpload(file: File) {
        let isUploadReject = false;

        const fileReader = new FileReader();

        fileReader.addEventListener("load", () => {
            if (!isUploadReject) {
                let base64ImgSrc = fileReader.result;

                if (typeof(base64ImgSrc) == "string") {
                    this.insertBase64Image(base64ImgSrc)
                }
            }
        }, false)

        if (file) {
            fileReader.readAsDataURL(file);
        }

        this.options.upload(file).then(
            (imageUrl: string) => {
                this.insertToEditor(imageUrl);
            },
            (error: Error) => {
                isUploadReject = true;
                this.removeBase64Image();
                console.warn(error);
            }
        )
    }

    insertBase64Image(url: string) {
        const range = this.range;

        if (range?.index) {
            this.quill.insertEmbed(
                range.index,
                ImageBlot.blotName,
                `${url}`,
                "user"
            )
        }
    }

    insertToEditor(url: string) {
        const range = this.range;

        if (range?.index) {
            this.quill.deleteText(range.index, 3, "user");
            this.quill.insertEmbed(range.index, "image", `${url}`, "user");

            range.index++;
            this.quill.setSelection(range, "user");
        }
    }

    removeBase64Image() {
        const range = this.range;
        
        if (range?.index) {
            this.quill.deleteText(range?.index, 3, "user");
        }
    }
}

export default ImageUploader;