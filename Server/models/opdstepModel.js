import mongoose from "mongoose";
 
// Step Schema

const stepSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true}
});

//Main Schema
const ipdStepSchema = new mongoose.Schema({
    heading:{
        type: String,
        required: true,
        default: "OPD Prescription Digitization: How GudMed Works"
    },
    description: {
        type: String,
        required: true,
        default: "GudMed’s OPD prescription digitization process captures handwritten prescriptions and converts them into digital records in real-time, ensuring accuracy, quick access, and seamless integration with hospital systems such as pharmacies and labs. This process simplifies the entire workflow for doctors, patients, and hospital staff, improving the efficiency of outpatient care."
    },
    steps: [stepSchema] //Array of step objects
});

const ipdstepModel = mongoose.model('IPDStep', ipdStepSchema);
export default ipdstepModel;