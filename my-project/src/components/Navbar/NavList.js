const NavList = [
  {
    id: "1",
    list: "About us",
    link: "/about", // Assuming "HOME" links to the homepage
   
  },
  {
    id: "2",
    list: "For Doctors",
    link: "/doctors", // Assuming this links to the doctors' page
  },
  {
    id: "3",
    list: "For Hospitals",
    link: "/hospital", // Linking to the hospital page
    dropdown: [
      {
       
        items: [
          { name: "IPD", link: "/hospital/ipd" }, // Link for IPD
          { name: "OPD", link: "/hospital/opd" }, // Link for OPD
        ],
      },
    ],
  },
  {
    id: "4",
    list: "For Patients",
    link: "/patients", // Assuming this links to the doctors' page
  },
  {
    id: "5",
    list: "Services",
    link: "/services", // Assuming a link to a services page
  },
  {
    id: "6",
    list: "Team",
    link: "/team", // Assuming a link to a team page
  },
  
];

export default NavList;
