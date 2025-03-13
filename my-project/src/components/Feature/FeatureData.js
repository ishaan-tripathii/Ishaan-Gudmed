import Medicine from "../../img/Medicine.png";
import Medical from "../../img/Medical Vault.jpg";
import Digital from "../../img/Genreatic Medicine.png";
import ClinicalMedicine from "../../img/Medical Vault.jpg";

const features = [
  {
    icon: <img src={Medicine} alt="Medicine Reminder" className="w-16 h-16" />,
    title: "Medicine Reminder",
    description:
      "Now you can get Medicine reminders on your phone by using Medicine Reminder Service from GudMed",
  },
  {
    icon: <img src={Medical} alt="Medical Vault" className="w-16 h-16" />,
    title: "Medical VAULT",
    description:
      "Now you can store all your medical Documents, Reports, Prescriptions, Images in a secured VAULT",
  },
  {
    icon: <img src={Digital} alt="Digital Prescription" className="w-16 h-16" />,
    title: "DIGITAL Prescription in your Language",
    description:
      "Now you can get your Doctor’s handwritten prescription in Digital format in your own Hindi Language",
  },
  {
    icon: (
      <img
        src={ClinicalMedicine}
        alt="Generic Medicine Service"
        className="w-16 h-16"
      />
    ),
    title: "Generic Medicine Service",
    description:
      "Now you can SAVE UP TO 70% on your medical bills by using GudMed Generic Service",
  },
];

export default features;
