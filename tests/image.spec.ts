import ImageBlot from "../src/blots/ImageBlot";
import { expect, it} from 'vitest'

it('creates an imageblot', () => {
    const node = ImageBlot.create("https://mytest.com/test-image.jpg")
    expect(node).toBeInstanceOf(Node)
});

