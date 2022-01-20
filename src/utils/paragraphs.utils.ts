import {getSelection} from '@deckdeckgo/utils';
import {isTextNode, toHTMLElement} from './node.utils';
import {findParagraph, isParagraph, isTargetParagraph} from './paragraph.utils';

export interface RemovedParagraph {
  paragraph: HTMLElement;
  previousSibling: Node;
}

export const findAddedParagraphs = ({
  mutations,
  container
}: {
  mutations: MutationRecord[] | undefined;
  container: HTMLElement;
}): HTMLElement[] => {
  if (!mutations || mutations.length <= 0) {
    return [];
  }

  const addedNodes: Node[] = mutations
    .filter(({addedNodes}: MutationRecord) => addedNodes?.length > 0)
    .reduce((acc: Node[], {addedNodes}: MutationRecord) => [...acc, ...Array.from(addedNodes)], []);

  return filterAddedParagraphs({nodes: addedNodes, container});
};

export const findAddedNodesParagraphs = ({
  mutations,
  container
}: {
  mutations: MutationRecord[] | undefined;
  container: HTMLElement;
}): MutationRecord[] => {
  return mutations
    .filter(({addedNodes}: MutationRecord) => addedNodes?.length > 0)
    .filter(({addedNodes}: MutationRecord) => {
      const node: Node = addedNodes[0];

      return !isParagraph({element: node, container}) && node?.nodeName.toLowerCase() !== 'br';
    });
};

export const findRemovedNodesParagraphs = ({
  mutations,
  container
}: {
  mutations: MutationRecord[] | undefined;
  container: HTMLElement;
}): MutationRecord[] => {
  return mutations
    .filter(({removedNodes}: MutationRecord) => removedNodes?.length > 0)
    .filter(({target}: MutationRecord) => !isTargetParagraph({target, container}));
};

export const findRemovedParagraphs = ({
  mutations,
  container
}: {
  mutations: MutationRecord[] | undefined;
  container: HTMLElement;
}): RemovedParagraph[] => {
  if (!mutations || mutations.length <= 0) {
    return [];
  }

  return mutations
    .filter(({target}: MutationRecord) => isTargetParagraph({target, container}))
    .filter(({removedNodes}: MutationRecord) => removedNodes?.length > 0)
    .reduce((acc: RemovedParagraph[], {removedNodes, previousSibling}: MutationRecord) => {
      const paragraphs: Node[] = filterRemovedParagraphs({nodes: Array.from(removedNodes)});

      return [
        ...acc,
        ...paragraphs.map((paragraph: HTMLElement) => ({paragraph, previousSibling}))
      ];
    }, []);
};

export const findUpdatedParagraphs = ({
  mutations,
  container
}: {
  mutations: MutationRecord[] | undefined;
  container: HTMLElement;
}): HTMLElement[] => {
  if (!mutations || mutations.length <= 0) {
    return [];
  }

  const nodes: Node[] = mutations.reduce(
    (acc: Node[], {target}: MutationRecord) => [...acc, target],
    []
  );

  return [
    ...new Set(
      nodes
        .map((node: Node) => findParagraph({element: node, container}))
        .filter(
          (paragraph: Node | undefined) =>
            paragraph !== undefined &&
            paragraph?.nodeType !== Node.TEXT_NODE &&
            paragraph?.nodeType !== Node.COMMENT_NODE
        ) as HTMLElement[]
    )
  ];
};

const filterAddedParagraphs = ({
  nodes,
  container
}: {
  nodes: Node[];
  container: HTMLElement;
}): HTMLElement[] => {
  return nodes
    .filter((node: Node) => isParagraph({element: node, container}))
    .filter(
      (paragraph: Node | undefined) =>
        paragraph?.nodeType !== Node.TEXT_NODE && paragraph?.nodeType !== Node.COMMENT_NODE
    ) as HTMLElement[];
};

// We remove text node, should not happen we only want elements as children of the container
const filterRemovedParagraphs = ({nodes}: {nodes: Node[]}): HTMLElement[] => {
  return nodes
    .filter((paragraph: Node | undefined) => !isTextNode(paragraph))
    .map((node: Node) => toHTMLElement(node));
};

export const findSelectionParagraphs = ({
  container,
  filterEmptySelection
}: {
  container: HTMLElement;
  filterEmptySelection: boolean;
}): HTMLElement[] | undefined => {
  const selection: Selection | null = getSelection();
  const range: Range | undefined = selection?.rangeCount > 0 ? selection?.getRangeAt(0) : undefined;

  if (!range || (filterEmptySelection && selection?.toString().length === 0)) {
    return undefined;
  }

  const start: HTMLElement | undefined = toHTMLElement(
    findParagraph({element: range.startContainer, container})
  );
  const end: HTMLElement | undefined = toHTMLElement(
    findParagraph({element: range.endContainer, container})
  );

  if (!end || start?.isSameNode(end)) {
    return start ? [start] : [];
  }

  if (start.nextElementSibling.isSameNode(end)) {
    return [start, end];
  }

  const nodes: HTMLElement[] = [];

  let next: Element | null = start.nextElementSibling;
  while (next !== null && !next.isSameNode(end)) {
    nodes.push(toHTMLElement(next));
    next = next.nextElementSibling;
  }

  return [start, ...nodes, end];
};