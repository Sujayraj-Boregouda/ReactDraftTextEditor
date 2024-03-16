// import React, { useState, useEffect } from 'react';
// import {
//   Editor,
//   EditorState,
//   convertToRaw,
//   convertFromRaw,
//   CompositeDecorator,
//   Modifier,
//   RichUtils,
// } from 'draft-js';
// import Button from './Button';
// import Title from './Title';


// const TextEditor = () => {
  
//   useEffect(() => {
//     // Load content from local storage on component mount
//     const savedContent = localStorage.getItem('draftjs_content');
//     if (savedContent) {
//       const contentState = convertFromRaw(JSON.parse(savedContent)); // Parse the saved content
//       setEditorState(EditorState.createWithContent(contentState, decorator));
//     }
//   }, []);

//   const handleChange = (newEditorState) => {
//     setEditorState(newEditorState);
//   };

//   const handleBeforeInput = (char) => {
//     let newEditorState = editorState;

//     if (char === '#' || char === '*' || char === '`') {
//       const selection = newEditorState.getSelection();
//       const contentState = newEditorState.getCurrentContent();
//       const blockKey = selection.getStartKey();
//       const block = contentState.getBlockForKey(blockKey);
//       const blockType = block.getType();
//       const startOffset = selection.getStartOffset();

//       // Check if the first character is a formatting character
//       if (startOffset === 0 || blockType !== 'unstyled') {
//         switch (char) {
//           case '#':
//             newEditorState = RichUtils.toggleBlockType(
//               newEditorState,
//               'header-one'
//             );
//             break;
//           case '*':
//             const boldText = block.getText();
//             if (boldText.startsWith('** ')) {
//               // Apply red line style
//               const contentWithRedLine = Modifier.applyInlineStyle(
//                 contentState,
//                 selection,
//                 'RED_LINE'
//               );
//               newEditorState = EditorState.push(
//                 newEditorState,
//                 contentWithRedLine,
//                 'change-inline-style'
//               );
//             } else if (boldText.startsWith('*** ')) {
//               // Apply underline style
//               const contentWithUnderline = Modifier.applyInlineStyle(
//                 contentState,
//                 selection,
//                 'UNDERLINE'
//               );
//               newEditorState = EditorState.push(
//                 newEditorState,
//                 contentWithUnderline,
//                 'change-inline-style'
//               );
//             } else {
//               // Apply bold style
//               newEditorState = RichUtils.toggleInlineStyle(
//                 newEditorState,
//                 'BOLD'
//               );
//             }
//             break;
//           case '`':
//             const codeText = block.getText();
//             if (codeText.startsWith('``` ')) {
//               // Apply code block style
//               newEditorState = RichUtils.toggleBlockType(
//                 newEditorState,
//                 'code-block'
//               );
//             }
//             break;
//           default:
//             break;
//         }
//       }
//     }

//     // Define decorator strategies and components for different text styles
//     const [editorState, setEditorState] = useState(
//       EditorState.createEmpty(decorator)
//     );

// // Decorator for underlined text
// const ColorUnderlineDecorator = {
//   // Strategy function to identify and apply underlining to text wrapped in "***"
//   strategy: (contentBlock, callback) => {
//     const text = contentBlock.getText();
//     let matchArr;
//     let start = 0;
//     while ((matchArr = /\*\*\*(.*?)\*\*\*/g.exec(text.substring(start)))) {
//       const matchStart = matchArr.index + start;
//       if (matchStart > 0 && text[matchStart - 1] !== ' ') {
//         // Ensure it's not in the middle of a word
//         start = matchStart + matchArr[0].length;
//         continue;
//       }
//       const matchEnd = matchStart + matchArr[0].length;
//       if (matchEnd < text.length && text[matchEnd] !== ' ') {
//         // Ensure it's not in the middle of a word
//         start = matchStart + matchArr[0].length;
//         continue;
//       }
//       callback(matchStart + 3, matchEnd - 3); // Adjust indexes to exclude delimiters
//       start = matchStart + matchArr[0].length;
//     }
//   },
//   // Component to render underlined text
//   component: (props) => {
//     return (
//       <span style={{ textDecoration: 'underline' }}>{props.children}</span>
//     );
//   },
// };

// // Decorator for colored text
// const ColorDecorator = {
//   // Strategy function to identify and apply color to text wrapped in "**"
//   strategy: (contentBlock, callback) => {
//     const text = contentBlock.getText();
//     let matchArr;
//     let start = 0;
//     while ((matchArr = /\*\*(.*?)\*\*/g.exec(text.substring(start)))) {
//       const matchStart = matchArr.index + start;
//       if (matchStart > 0 && text[matchStart - 1] !== ' ') {
//         // Ensure it's not in the middle of a word
//         start = matchStart + matchArr[0].length;
//         continue;
//       }
//       const matchEnd = matchStart + matchArr[0].length;
//       if (matchEnd < text.length && text[matchEnd] !== ' ') {
//         // Ensure it's not in the middle of a word
//         start = matchStart + matchArr[0].length;
//         continue;
//       }
//       callback(matchStart + 2, matchEnd - 2); // Adjust indexes to exclude delimiters
//       start = matchStart + matchArr[0].length;
//     }
//   },
//   // Component to render colored text
//   component: (props) => {
//     return <span style={{ color: 'red' }}>{props.children}</span>;
//   },
// };

// // Decorator for code blocks
// const CodeBlockDecorator = {
//   // Strategy function to identify and apply styling to text wrapped in "```"
//   strategy: (contentBlock, callback) => {
//     const text = contentBlock.getText();
//     let matchArr;
//     let start = 0;
//     while ((matchArr = /```(.*?)```/g.exec(text.substring(start)))) {
//       const matchStart = matchArr.index + start;
//       if (matchStart > 0 && text[matchStart - 1] !== ' ') {
//         // Ensure it's not in the middle of a word
//         start = matchStart + matchArr[0].length;
//         continue;
//       }
//       const matchEnd = matchStart + matchArr[0].length;
//       if (matchEnd < text.length && text[matchEnd] !== ' ') {
//         // Ensure it's not in the middle of a word
//         start = matchStart + matchArr[0].length;
//         continue;
//       }
//       callback(matchStart + 3, matchEnd - 3); // Adjust indexes to exclude delimiters
//       start = matchStart + matchArr[0].length;
//     }
//   },
//   // Component to render styled code blocks
//   component: (props) => {
//     return (
//       <span
//         style={{
//           backgroundColor: '#e6e6e6',
//           color: '#2c2c2c',
//           border: 'none',
//           borderRadius: '5px',
//         }}
//       >
//         {props.children}
//       </span>
//     );
//   },
// };

// // Create a composite decorator with all defined decorators
// const decorator = new CompositeDecorator([
//   ColorDecorator,
//   ColorUnderlineDecorator,
//   CodeBlockDecorator,
// ]);

//     if (newEditorState !== editorState) {
//       setEditorState(newEditorState);
//       return 'handled';
//     }

//     return 'not-handled';
//   };

//   const handleSave = () => {
//     // Save content to local storage
//     const contentState = editorState.getCurrentContent();
//     const contentText = JSON.stringify(convertToRaw(contentState));
//     localStorage.setItem('draftjs_content', contentText);
//   };

//   return (
//     <div>
//       <Title>Title of the Text Editor</Title>
//       <Editor
//         editorState={editorState}
//         onChange={handleChange}
//         // handleBeforeInput={handleBeforeInput}
//       />
//       <Button onClick={handleSave}>Save</Button>
//     </div>
//   );
// };

// export default TextEditor;
