/**
 * @fileoverview
 * This file contains the AnchorPoint class. This class is responsible for
 * modifying the text of the page to bold the first syllable of each word.
 *
 */

export class AnchorPoint {
  private originalTextNodes: { node: Node, text: string }[] = [];

  constructor() { }

  private boldFirstSyllable(word: string): DocumentFragment | Text {
    let index: number = word.search(/[aeiou]/i);

    if (index === -1) {
      return document.createTextNode(word);
    }

    let firstSyllable: string = word.substring(0, index + 1);
    let remaining: string = word.substring(index + 1);

    let fragment: DocumentFragment = document.createDocumentFragment();

    let bold: HTMLElement = document.createElement('b');
    bold.textContent = firstSyllable;
    fragment.appendChild(bold);

    fragment.appendChild(document.createTextNode(remaining));

    return fragment;
  }

  private getTextNodes(node: Node | ChildNode): Node[] {
    let all: Node[] = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
      if (node.nodeType == 3) all.push(node);
      else all = all.concat(this.getTextNodes(node));
    }
    return all;
  }

  public modifyText(): void {
    let textNodes: Node[] = this.getTextNodes(document.body);

    textNodes.forEach((node: Node) => {
      // Store original text content
      this.originalTextNodes.push({ node, text: node.nodeValue });

      let words: string[] = node.nodeValue.split(' ');

      let fragment: DocumentFragment = document.createDocumentFragment();

      words.forEach((word: string, i: number) => {
        fragment.appendChild(this.boldFirstSyllable(word));

        if (i < words.length - 1) {
          fragment.appendChild(document.createTextNode(' '));
        }
      });

      node.parentNode.replaceChild(fragment, node);
    });
  }

  public revertText(): void {
    this.originalTextNodes.forEach(({ node, text }) => {
      let parentNode = node.parentNode;
      let newNode = document.createTextNode(text);
      parentNode.replaceChild(newNode, node);
    });
  }
}
