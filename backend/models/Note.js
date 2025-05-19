const mongoose = require('mongoose');
const {Schema} = mongoose;

const NoteSchema = new Schema({
    note_id:{
        type: Number,
        unique: true
    },
    username:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true  
    },
    date:{
        type: String,
        default: Date.now
    }

});

NoteSchema.statics.getNextNoteId = async function () {
    const doc = await this.findOne({}, {}, { sort: { note_id: -1 } });
    return doc ? doc.note_id + 1 : 1;
};

NoteSchema.pre('save', async function (next) {
    if (!this.note_id) {
        this.note_id = await this.constructor.getNextNoteId();
    }
    next();
});

module.exports = mongoose.model('notes', NoteSchema);