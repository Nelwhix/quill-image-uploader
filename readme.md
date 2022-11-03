# Quill Image Uploader
    A quilljs plugin that allows you to upload the following type of images directly to your backend:
* images drag/dropped into the editor
* images inserted using the toolbar
* images copy/pasted from the clipboard

## Demo
![Image of Yaktocat](/static/quill-example.gif)

## Usage: 
First install on npm:
```bash
    npm i quill-image-uploader-ts
```

then configure it on your project like so:
```
import Quill from "quill";
import ImageUploader from "ImageUploader";

Quill.register("modules/imageUploader", ImageUploader);

const quill = new Quill(editor, {
  // ...
  modules: {
    // ...
    imageUploader: {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/480px-JavaScript-logo.png"
            );
          }, 3500);
        });
      },
    },
  },
});
```

## Inspiration
This library is a typescript port of [quill-image-uploader](https://github.com/NoelOConnell/quill-image-uploader). It seems the package is currently not maintained.
