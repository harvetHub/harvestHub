export const groupedCategories = {
    plantCare: {
      name: "🌱 Plant Care",
      items: [
        { id: 1, name: "Seeds", value: "seeds", icon: "🌱" },
        { id: 2, name: "Fertilizers", value: "fertilizers", icon: "💩" },
        { id: 9, name: "Soil Amendments", value: "soil-amendments", icon: "🌿" },
        { id: 4, name: "Pesticides", value: "pesticides", icon: "🧴" },
      ],
    },
    farmEquipment: {
      name: "🚜 Farm Equipment",
      items: [
        { id: 3, name: "Tools", value: "tools", icon: "🛠️" },
        { id: 7, name: "Machinery", value: "machinery", icon: "🚜" },
        { id: 5, name: "Irrigation Equipment", value: "irrigation", icon: "💧" },
      ],
    },
    livestockAndPoultry: {
      name: "🐓 Livestock & Poultry",
      items: [
        { id: 6, name: "Animal Feed", value: "animal-feed", icon: "🐄" },
        { id: 10, name: "Crop Protection", value: "crop-protection", icon: "🛡️" },
      ],
    },
    greenhouseAndSustainability: {
      name: "🌿 Greenhouse & Sustainability",
      items: [
        { id: 8, name: "Greenhouse Supplies", value: "greenhouse", icon: "🏡" },
        { id: 5, name: "Irrigation Equipment", value: "irrigation", icon: "💧" }, // Shared with Farm Equipment
      ],
    },
  };