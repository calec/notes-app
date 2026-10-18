// Replaces the Express/MongoDB API (routes/api) with a localStorage store.
// Responses keep axios' { data } shape so callers are unchanged.
import { read, write } from './localStore';

const NOTES_KEY = 'gn_notes';

const respond = (data) => Promise.resolve({ data: JSON.parse(JSON.stringify(data)) });
const allNotes = () => read(NOTES_KEY, []);
const newestFirst = (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded);

const updateWhere = (id, fn) => {
    const notes = allNotes();
    const note = notes.find(n => n._id === id);
    if (note) {
        fn(note);
        write(NOTES_KEY, notes);
    }
    return respond(note || null);
};

export default {
    getNotes: function(userId) {
        return respond(allNotes().filter(n => n.userId === userId).sort(newestFirst));
    },

    saveNote: function(NoteData) {
        const note = {
            _id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            dateAdded: new Date().toISOString(),
            sharedWith: [],
            ...NoteData,
        };
        write(NOTES_KEY, [...allNotes(), note]);
        return respond(note);
    },

    getNote: function(id) {
        return respond(allNotes().find(n => n._id === id) || null);
    },

    updateNote: function(id, body) {
        return updateWhere(id, note => Object.assign(note, body));
    },

    deleteNote: function (id) {
        write(NOTES_KEY, allNotes().filter(n => n._id !== id));
        return respond({ ok: 1 });
    },

    addSharedUser: function(noteId, userId) {
        return updateWhere(noteId, note => note.sharedWith.push(userId));
    },

    getSharedNotes: function(userId) {
        return respond(allNotes().filter(n => (n.sharedWith || []).indexOf(userId) !== -1));
    }
}
