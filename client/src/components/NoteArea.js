import React from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import API from '../utils/API';
import {firebase} from '../firebase';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { Bold, Italic } from './Editor';
import FormatBold from '@material-ui/icons/FormatBold';
import FormatItalic from '@material-ui/icons/FormatItalic';
import FormatUnderlined from '@material-ui/icons/FormatUnderlined';
import Code from '@material-ui/icons/Code';
import List from '@material-ui/icons/List';


const styles = {
  scroll: {
    overflowY: 'scroll',
    height: 'calc(100vh - 160px)'
  },
  toolbar: {
    display: 'flex',
    borderBottom: 'solid 1.7px rgba(199, 198, 255, 0.25)',
    padding: '10px 10px 0 10px',
  },
  iconbutton: {
    cursor: 'pointer',
    border: 0,
  },
  editorContainer: {
    marginTop: '10px',
  },
}

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: "Welcome to GrantsNotes!",
              },
            ],
          },
        ],
      },
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: "",
              },
            ],
          },
        ],
      },
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: "Create or select a note on the left to get started.",
              },
            ],
          },
        ],
      }
    ],
  },
})


class NoteArea extends React.Component {

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      if(this.state.email === null) {
      this.setState({ email: authUser.email })
      }
    })
  }

  componentDidUpdate(prevProps) {

    if (this.props.selectedNoteID !== prevProps.selectedNoteID) {
      // let contentStr = this.props.selectedNoteBody;
      // let contentObj = JSON.parse(contentStr);
      let contentObj = this.props.selectedNoteBody;
      let slateContent = Value.fromJSON(contentObj);

      this.setState({ 
        value: slateContent,
        id: this.props.selectedNoteID,
      })
    }
  }

  state = {
    value: initialValue,
    id: "",
    email: "test",
  }

  // On change, update the app's React state with the new editor value & update DB
  onChange = ({ value }) => {
    // if (this.props.selectedNoteBody) {
    if (value.document !== this.state.value.document) {
      // API.updateNote(this.state.id, { content: JSON.stringify(value) });
      // API.updateNote(this.state.id, { content: JSON.stringify(value.toJSON()) });
      if (this.state.id) {
        API.updateNote(this.state.id, { content: value.toJSON() });
      }
    }

    this.setState({ value });
  };

  // Modern Chrome fires selectionchange with a range equal to the stored one,
  // so slate-react 0.18 never marks the value focused and blurs the editor.
  onFocus = (event, change) => {
    if (change.value.selection.isBlurred) change.focus();
  };

  onKeyDown = (e, change) => {
    if (!e.ctrlKey) {
			return;
		}
    
    switch (e.key) {
			case 'b': {
				change.toggleMark('bold');
				return true;
			}
			case 'i': {
				change.toggleMark('italic');
				return true;
			}

			case 'l': {
				change.toggleMark('list');
				return true;
			}

			case 'u': {
				change.toggleMark('underline');
				return true;
			}
			default: {
				return;
			}
		}
  };

  renderMark = (props) => {
		switch (props.mark.type) {
			case 'bold':
				return <Bold {...props} />;

			case 'italic':
				return <Italic {...props} />;

			case 'code':
				return <code {...props.attributes}>{props.children}</code>;

			case 'list':
				return (
					<ul {...props.attributes}>
						<li>{props.children}</li>
					</ul>
				);

			case 'underline':
				return <u {...props.attributes}>{props.children}</u>;

			default: {
				return;
			}
		}
	};

	onMarkClick = (e, type) => {
		e.preventDefault();
		const { value } = this.state;
    const change = value.change().toggleMark(type);
    
		this.onChange(change);
  };

  // Render the editor.
  render() {
    const { classes } = this.props;
    return(
      <Paper className={classes.editorContainer}>
        <div className={classes.toolbar}>
          <IconButton
            onPointerDown={(e) => this.onMarkClick(e, 'bold')}
            className={classes.iconbutton}
          >
            <FormatBold />
          </IconButton>
          <IconButton
              onPointerDown={(e) => this.onMarkClick(e, 'italic')}
              className={classes.iconbutton}
            >
              <FormatItalic />
            </IconButton>
            <IconButton
              onPointerDown={(e) => this.onMarkClick(e, 'code')}
              className={classes.iconbutton}
            >
              <Code />
            </IconButton>
            <IconButton
              onPointerDown={(e) => this.onMarkClick(e, 'list')}
              className={classes.iconbutton}
            >
              <List />
            </IconButton>
            <IconButton
              onPointerDown={(e) => this.onMarkClick(e, 'underline')}
              className={classes.iconbutton}
            >
              <FormatUnderlined />
            </IconButton>
        </div>
        <Editor
          className={classes.scroll} 
          value={this.state.value}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
          renderMark={this.renderMark}
          style={{
            'minHeight':'calc(100vh - 160px)',
            margin: '20px 0 30px 0',
            padding: '10px',
            color: this.props.text,
          }}
        />
      </Paper>
    ) 
  }
}

export default withStyles(styles)(NoteArea);