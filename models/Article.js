var mongoose = require('mongoose');

// Save a reference to the Schema constructor function
var Schema = mongoose.Schema

// Create a new Schema object with constructor
let ArticleSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    // give 'name' its properties
    name: {
        type: String,
        required: false,
        unique: true,
    },
    image: {
        type: String,
        required: false,
    },
    // give 'summary' its properties 
    address: {
        type: String, 
        required: false, 
        maxlength: 300,
    },
    
    phone: {
        type: String,
        required: false,
    },

    fees: { 
        type: String,
        required: false,
    },

    hours: {
        type: String,
        required: false
    },

    climate: {
        type: String,
        required: false,
    },

    saved: {
        type: Boolean,
        default: false, 
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