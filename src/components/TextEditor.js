import React, { useState, useEffect } from 'react';
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  Modifier,
  RichUtils,
} from 'draft-js';
import Button from './Button';

const customStyleMap = {
  'RED_LINE': {
    color: 'red'
  },
  'UNDERLINE': {
    textDecoration: 'underline'
  },
  // Define more custom styles as needed
};

const TextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    // Load content from local storage on component mount
    const savedContent = localStorage.getItem('draftjs_content');
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent)); // Parse the saved content
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleBeforeInput = (char) => {
    let newEditorState = editorState;

    if (char === '#' || char === '*' || char === '`') {
      const selection = newEditorState.getSelection();
      const contentState = newEditorState.getCurrentContent();
      const blockKey = selection.getStartKey();
      const block = contentState.getBlockForKey(blockKey);
      const blockType = block.getType();
      const startOffset = selection.getStartOffset();

      // Check if the first character is a formatting character
      if (startOffset === 0 || blockType !== 'unstyled') {
        switch (char) {
          case '#':
            newEditorState = RichUtils.toggleBlockType(newEditorState, 'header-one');
            break;
          case '*':
            const boldText = block.getText();
            if (boldText.startsWith('**')) {
              // Apply red line style (keep double asterisks)
              const contentWithRedLine = Modifier.applyInlineStyle(contentState, selection, 'RED_LINE');
              newEditorState = EditorState.push(newEditorState, contentWithRedLine, 'change-inline-style');
            } else if (boldText.startsWith('***')) {
              // Apply underline style (keep triple asterisks)
              const contentWithUnderline = Modifier.applyInlineStyle(contentState, selection, 'UNDERLINE');
              newEditorState = EditorState.push(newEditorState, contentWithUnderline, 'change-inline-style');
            } else {
              // Apply bold style
              newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'BOLD');
            }
            break;
          case '`':
            const codeText = block.getText();
            if (codeText.startsWith('```')) {
              // Apply code block style
              newEditorState = RichUtils.toggleBlockType(newEditorState, 'code-block');
            }
            break;
          default:
            break;
        }
      }
    }

    if (newEditorState !== editorState) {
      setEditorState(newEditorState);
      return 'handled';
    }

    return 'not-handled';
  };

  const handleSave = () => {
    // Save content to local storage
    const contentState = editorState.getCurrentContent();
    const contentText = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem('draftjs_content', contentText);
  };

  return (
    <div>
      <Editor editorState={editorState} onChange={handleChange} handleBeforeInput={handleBeforeInput} customStyleMap={customStyleMap} />
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default TextEditor;