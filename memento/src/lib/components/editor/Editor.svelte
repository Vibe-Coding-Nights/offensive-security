<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Link from '@tiptap/extension-link';
  import Placeholder from '@tiptap/extension-placeholder';
  import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
  import { common, createLowlight } from 'lowlight';

  export let content: any = '';
  export let editable = true;
  export let placeholder = "Start writing, or press '/' for commands...";

  const dispatch = createEventDispatcher();
  const lowlight = createLowlight(common);

  let element: HTMLElement;
  let editor: Editor;

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-accent underline cursor-pointer hover:text-accent-bright'
          }
        }),
        Placeholder.configure({
          placeholder,
          emptyEditorClass: 'is-editor-empty'
        }),
        CodeBlockLowlight.configure({
          lowlight,
          HTMLAttributes: {
            class: 'bg-canvas-raised border border-border rounded-lg p-4 font-mono text-sm my-4'
          }
        }),
      ],
      content,
      editable,
      editorProps: {
        attributes: {
          class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] px-8 py-6'
        }
      },
      onUpdate: ({ editor }) => {
        dispatch('update', {
          content: editor.getJSON(),
          html: editor.getHTML(),
          text: editor.getText()
        });
      },
      onSelectionUpdate: ({ editor }) => {
        dispatch('selectionUpdate', {
          from: editor.state.selection.from,
          to: editor.state.selection.to,
          empty: editor.state.selection.empty
        });
      }
    });
  });

  onDestroy(() => {
    editor?.destroy();
  });

  export function getEditor() {
    return editor;
  }

  export function focus() {
    editor?.commands.focus();
  }

  export function setContent(newContent: any) {
    editor?.commands.setContent(newContent);
  }
</script>

<div class="editor-wrapper bg-canvas rounded-lg border border-border">
  <div bind:this={element} />
</div>

<style>
  :global(.editor-wrapper .ProseMirror) {
    color: var(--ink);
  }

  :global(.editor-wrapper .ProseMirror.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: var(--ink-faint);
    pointer-events: none;
    height: 0;
  }

  :global(.editor-wrapper .ProseMirror h1) {
    font-size: 2em;
    font-weight: 700;
    margin-top: 1em;
    margin-bottom: 0.5em;
    color: var(--ink);
  }

  :global(.editor-wrapper .ProseMirror h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin-top: 0.83em;
    margin-bottom: 0.5em;
    color: var(--ink);
  }

  :global(.editor-wrapper .ProseMirror h3) {
    font-size: 1.25em;
    font-weight: 600;
    margin-top: 0.83em;
    margin-bottom: 0.5em;
    color: var(--ink);
  }

  :global(.editor-wrapper .ProseMirror p) {
    margin-bottom: 1em;
    line-height: 1.6;
  }

  :global(.editor-wrapper .ProseMirror ul),
  :global(.editor-wrapper .ProseMirror ol) {
    padding-left: 1.5em;
    margin-bottom: 1em;
  }

  :global(.editor-wrapper .ProseMirror li) {
    margin-bottom: 0.5em;
  }

  :global(.editor-wrapper .ProseMirror blockquote) {
    border-left: 3px solid var(--accent);
    padding-left: 1em;
    margin-left: 0;
    font-style: italic;
    color: var(--ink-muted);
  }

  :global(.editor-wrapper .ProseMirror code) {
    background: var(--canvas-raised);
    border: 1px solid var(--border);
    border-radius: 0.25em;
    padding: 0.125em 0.25em;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.9em;
  }

  :global(.editor-wrapper .ProseMirror hr) {
    border: none;
    border-top: 2px solid var(--border);
    margin: 2em 0;
  }
</style>
