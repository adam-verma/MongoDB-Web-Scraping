var mongoose = require('mongoose');

// Save a reference to the Schema constructor function
var Schema = mongoose.Schema

// Create a new Schema object with constructor
let ArticleSchema = new Schema({
    _id: {
        type: String,
        required:true,
    },
    // give 'headline' its properties
    name: {
        type: String,
        required: true
    },
    // give 'summary' its properties 
    address: {
        type: String, 
        required: true, 
        maxlength: 140,
    },
    
    phone: {
        type: String,
        required: true,
    },

    fees: { 
        type: String,
        required: true,
    },

    hours: {
        type: String,
        required: true
    },

    climate: {
        type: String,
        required: true
    },

    // 'note' stores the ObjectId associated to Model
    // Populates 
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }

})

// Create model from mongoose's model scheme
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model 
module.exports = Article; 