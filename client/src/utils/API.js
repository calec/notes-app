import axios from "axios";

// export const saveNote =  (NoteData) => {
//     return axios.post("/api/note/:id", NoteData)
// };

// export const saveUser =  (UserData) => {
//     console.log("fishfishfgoatfishapple" + UserData)
//     return axios.post("/api/user", UserData)
// };

export default {
    getNotes: function(userId) {
        return axios.get("/api/notes/user/" + userId)
    },
    saveNote: function(NoteData) {
        return axios.post("/api/note", NoteData);
    },

    // saveUser: function(UserData) {
    //     console.log("fishfishfgoatfishapple" + UserData)
    //     return axios.post("/api/user", UserData)
    // },

    getNote: function(id) {
        return axios.get("/api/note" + id)
    },

    updateTitle: function(id, title) {
        return axios.put("/api/" + id, title);
    },

    updateNote: function(id, content) {
        return axios.put("/api/" + id, content);
    },

    deleteNote: function (id) {
        return axios.delete("/api/" + id);
    }
}
