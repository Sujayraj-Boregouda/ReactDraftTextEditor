import React, { useState, useRef, useEffect } from "react";
import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Title from "./Title";
import Button from "./Button";

// Decorator Strategies
const HeadingDecorator = {
  strategy: (contentBlock, callback) => {
    const text = contentBlock.getText();
    const firstChar = text.charAt(0);
    if (firstChar === '#' && text.charAt(1) === ' ') {
      callback(0, text.length);
    }
  },
  component: (props) => <h1>{props.children}</h1>,
};

const BoldDecorator = {
  strategy: (contentBlock, callback) => {
    const text = contentBlock.getText();
    const firstChar = text.charAt(0);
    if (firstChar === '*' && text.charAt(1) === ' ') {
      callback(0, text.length);
    }
  },
  component: (props) => <strong>{props.children}</strong>,
};

const ColorDecorator = {
  strategy: (contentBlock, callback) => {
    const text = contentBlock.getText();
    const firstTwoChars = text.substring(0, 2);
    if (firstTwoChars === '**' && text.charAt(2) === ' ') {
      callback(0, text.length);
    }
  },
  component: (props) => <span style={{ color: 'red' }}>{props.children}</span>,
};

const UnderlineDecorator = {
  strategy: (contentBlock, callback) => {
    const text = contentBlock.getText();
    const firstThreeChars = text.substring(0, 3);
    if (firstThreeChars === '***' && text.charAt(3) === ' ') {
      callback(0, text.length);
    }
  },
  component: (props) => <span style={{ textDecoration: 'underline' }}>{props.children}</span>,
};

const HighlightDecorator = {
  strategy: (contentBlock, callback) => {
    const text = contentBlock.getText();
    const firstThreeChars = text.substring(0, 3);
    if (firstThreeChars === '```' && text.charAt(3) === ' ') {
      callback(0, text.length);
    }
  },
  component: (props) => <span style={{ backgroundColor: 'yellow' }}>{props.children}</span>,
};

// Composite Decorator
const decorator = new CompositeDecorator([
  HeadingDecorator,
  BoldDecorator,
  ColorDecorator,
  UnderlineDecorator,
  HighlightDecorator,
]);

const DraftEditor = () => {
  const showClearRef = useRef(null);
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  );
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current.focus();
    const savedContent = localStorage.getItem("draftjs_content");
    if (savedContent) {
      if (showClearRef.current) {
        showClearRef.current.style.display = "block";
      }
      const content = JSON.parse(savedContent);
      const contentState = convertFromRaw(content.editorState);
      setEditorState(EditorState.createWithContent(contentState, decorator));
    }
  }, []);

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const content = {
      editorState: convertToRaw(contentState),
    };
    localStorage.setItem("draftjs_content", JSON.stringify(content));
    alert('Your Inputs are Saved')
  };

  const handleClear = () => {
      const confirmed = window.confirm("Are you sure you want to clear the data?");
      if (confirmed) {
          localStorage.removeItem("draftjs_content");
          setEditorState(EditorState.createEmpty(decorator));
          if (showClearRef.current) {
              showClearRef.current.style.display = "none";
          }
      }
  };

  return (
    <div className="text-editor-content">
      <Title title="React Draft Text Editor" /> {/* Pass the title as a prop */}
      <Button
        className="clearBtn"
        style={{ display: localStorage.getItem("draftjs_content") ? "block" : "none" }}
        forwardRef={showClearRef}
        onClick={handleClear}
      >
        Clear Data
      </Button>

      <Editor
        editorState={editorState}
        onChange={handleChange}
        placeholder="Enter some text..."
        ref={editorRef}
      />

      <Button className="saveBtn" onClick={handleSave}>Save</Button>
    </div>
  );
};

export default DraftEditor;
