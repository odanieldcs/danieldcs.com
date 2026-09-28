const HTML_TO_MDX_COMPONENT: Record<string, string> = {
  figure: 'MdxFigure',
  figcaption: 'MdxFigcaption',
}

type MdxTreeNode = {
  type?: string
  name?: string
  children?: MdxTreeNode[]
}

function walkMdxNodes(node: MdxTreeNode, visitor: (node: MdxTreeNode) => void) {
  if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
    visitor(node)
  }

  for (const child of node.children ?? []) {
    walkMdxNodes(child, visitor)
  }
}

/** Renames parsed `<figure>` / `<figcaption>` JSX nodes to styled MDX components. */
export function remarkMdxHtmlComponents() {
  return (tree: MdxTreeNode) => {
    walkMdxNodes(tree, (node) => {
      if (!node.name) {
        return
      }
      const replacement = HTML_TO_MDX_COMPONENT[node.name]
      if (replacement) {
        node.name = replacement
      }
    })
  }
}
