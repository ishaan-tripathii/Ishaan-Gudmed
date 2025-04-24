import mongoose from "mongoose";

// Define the schema for individual sections

const ipdSchema = new mongoose.Schema({
    heading: { type: String },
    description: { type: String }
});

const comparisonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    beforeImage : {
        type: String,
        required: true,
        trim: true,
    },

    afterImage : {
        type: String,
        required: true,
        trim: true,
    },
    
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
});

// Define the main schema for ImageComparison

const imageComparisonSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        default: "Discharge Summary",
        trim: true,
    },
    description: {
        type: String,
        required: true,
        default: "Move the slider left and right to see the magic!",
        trim: true, //Remove unnecessary whitespace
    },
    sections: {
        type: [comparisonSchema],
        default: () => [
            {
                title: "Page1",
                beforeImage: "http://localhost:3000/static/media/ipd%201%201-0%20(1).52e7528d24e0dc3f0c0c.jpg",
                afterImage: "http://localhost:3000/static/media/HCG_ipd_724409.pdf%20(1).cfdb12a63da8e2c7567f.png",
            },
            {
                title: "Page2",
                beforeImage: "http://localhost:3000/static/media/ipd%201%201_page-0002.25d90e68c8fe464f2a09.jpg",
                afterImage: "http://localhost:3000/static/media/HCG_ipd_724409.pdf.a7c6e2728b8c02056f57.png",
            },
        ], // Default sections to match your initial data
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Set to current time on creation
    }
});

// Update the updatedAt field before saving

imageComaparisonSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model using ES6 module syntax
const ImageComparison = mongoose.model("ImageComparison", imageComparisonSchema);