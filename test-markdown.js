import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize from 'rehype-sanitize';
import { visit } from 'unist-util-visit';

const allowedHTMLElements = [
  'a', 'b', 'blockquote', 'br', 'code', 'dd', 'del', 'details', 'div', 'dl', 'dt',
  'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'ins', 'kbd', 'li', 'ol',
  'p', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'source', 'span', 'strike',
  'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead',
  'tr', 'ul', 'var', 'think', 'plan', 'header',
];

function remarkThinkRawContent() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'html' && node.value && node.value.startsWith('<plan>')) {
        const cleanedContent = node.value.slice(6);
        node.value = `<div class="__falborPlan__">${cleanedContent}`;
        return;
      }
      if (node.type === 'html' && node.value && node.value.startsWith('</plan>')) {
        const cleanedContent = node.value.slice(7);
        node.value = `</div>${cleanedContent}`;
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkThinkRawContent)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSanitize, {
    tagNames: allowedHTMLElements,
    attributes: {
      div: ['className', 'class']
    }
  })
  .use(rehypeStringify);

const md = `Some text.

<plan>
This is a plan.
- Point 1
- Point 2
</plan>

More text.`;

processor.process(md).then(vfile => {
  console.log(String(vfile));
});
