import React, { useState, useRef, useEffect } from "react";
import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Button from "./Button";

//*** Define decorator strategies and components for different text styles ***//


// Decorator for HEADING Text
const HeadingDecorator = {
  // Strategy function to identify and apply Heading 1 format to text
  strategy: (contentBlock, callback) => {
    const text = contentBlock.getText();
    const firstChar = text.charAt(0);
    // Check if the line starts with '#' followed by a space
    if (firstChar === '#' && text.charAt(1) === ' ') {
      callback(0, text.length);
    }
  },
  // Component to render text in Heading 1 format
  component: (props) => {
    return <h1>{props.children}</h1>;
  },
};

// Decorator for Bold Text
const BoldDecorator = {
  // Strategy function to identify and apply bold format to text
  strategy: (contentBlock, callback) => {
    const text = contentBlock.getText();
    const firstChar = text.charAt(0);
    // Check if the line starts with '*' followed by a space
    if (firstChar === '*' && text.charAt(1) === ' ') {
      callback(0, text.length);
    }
  },
  // Component to render text in bold format
  component: (props) => {
    return <strong>{props.children}</strong>;
  },
};

// Decorator for Red Color text
const ColorDecorator = {
  // Strategy function to identify and apply red line to text
  strategy: (contentBlock, callback) => {
    const text = contentBlock.getText();
    const firstTwoChars = text.substring(0, 2);
    // Check if the line starts with '** ' followed by a space
    if (firstTwoChars === '**' && text.charAt(2) === ' ') {
      callback(0, text.length);
    }
  },
  // Component to render text with red line
  component: (props) => {
    return <span style={{ color: 'red' }}>{props.children}</span>;
  },
};

// Decorator for Underline Text
const ColorUnderlineDecorator = {
  // Strategy function to identify and apply red line to text
  strategy: (contentBlock, callback) => {
    const text = contentBlock.getText();
    const firstThreeChars = text.substring(0, 3);
    // Check if the line starts with '** ' followed by a space
    if (firstThreeChars === '***' && text.charAt(3) === ' ') {
      callback(0, text.length);
    }
  },
  // Component to render text with red line
  component: (props) => {
    return <span style={{ textDecoration: 'underline'}}>{props.children}</span>;
  },
};

// Decorator for Highlight Text
const CodeBlockDecorator = {
  // Strategy function to identify and apply red line to text
  strategy: (contentBlock, callback) => {
    const text = contentBlock.getText();
    const firstThreeChars = text.substring(0, 3);
    // Check if the line starts with '** ' followed by a space
    if (firstThreeChars === '```' && text.charAt(3) === ' ') {
      callback(0, text.length);
    }
  },
  // Component to render text with red line
  component: (props) => {
    return <span style={{ backgroundColor: 'blue', color:'white' }}>{props.children}</span>;
  },
};

// Create a composite decorator with all defined decorators
const decorator = new CompositeDecorator([
  HeadingDecorator,
  BoldDecorator,
  ColorDecorator,
  ColorUnderlineDecorator,
  CodeBlockDecorator,
]);

const DraftEditor = () => {
  // Reference to the "Clear Data" button
  const showClearRef = useRef(null);
  // Initialize editor state with the composite decorator
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  );
  // Reference to the editor component
  const editorRef = useRef(null);

  useEffect(() => {
    // Focus the editor when the component mounts
    editorRef.current.focus();
    // Retrieve saved content from local storage and update editor state if available
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


  // Handler for editor state changes
  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  // Handler for saving content to local storage
  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const content = {
      editorState: convertToRaw(contentState),
    };
    localStorage.setItem("draftjs_content", JSON.stringify(content));
  };

  // Handler for clearing editor content and local storage
  const handleClear = () => {
    localStorage.removeItem("draftjs_content");
    setEditorState(EditorState.createEmpty(decorator));
    showClearRef.current.style.display = "none";
  };

  return (
    <div>
      {/* "Clear Data" button */}
      <Button
        style={{ display: "none" }}
        ref={showClearRef}
        onClick={() => handleClear()}
      >
        Clear Data
      </Button>
      {/* Draft.js Editor component */}
      <Editor
        editorState={editorState}
        onChange={handleChange}
        placeholder="Enter some text..."
        ref={editorRef}
      />
      {/* "Save" button */}
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default DraftEditor;
