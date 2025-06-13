import React, { useState } from "react";
import {
  Address,
  Region,
  Province,
  Municipality,
  Barangay,
} from "@/lib/definitions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DropdownAddressProps {
  address: {
    region: Region;
    province: Province;
    cityMunicipality: Municipality;
    barangay: Barangay;
  };
  setAddress: (
    type: keyof Address["address"],
    value: Address["address"][keyof Address["address"]] | null
  ) => void;
  regions: Region[];
  provinces: Province[];
  municipalities: Municipality[];
  barangays: Barangay[];
  errors: Record<string, string>;
}

const DropdownAddress: React.FC<DropdownAddressProps> = ({
  address,
  setAddress,
  regions = [],
  provinces = [],
  municipalities = [],
  barangays = [],
  errors = {},
}) => {
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState<
    Municipality[]
  >([]);
  const [filteredBarangays, setFilteredBarangays] = useState<Barangay[]>([]);

  // Unified function for filtering dependent options
  const filterOptions = (type: keyof Address["address"], id: string | null) => {
    switch (type) {
      case "region":
        setFilteredProvinces(
          id ? provinces.filter((p) => p.region_id === id) : []
        );
        setFilteredMunicipalities([]);
        setFilteredBarangays([]);
        setAddress("province", null);
        setAddress("cityMunicipality", null);
        setAddress("barangay", null);
        break;
      case "province":
        setFilteredMunicipalities(
          id ? municipalities.filter((m) => m.province_id === id) : []
        );
        setFilteredBarangays([]);
        setAddress("cityMunicipality", null);
        setAddress("barangay", null);
        break;
      case "cityMunicipality":
        setFilteredBarangays(
          id ? barangays.filter((b) => b.municipality_id === id) : []
        );
        setAddress("barangay", null);
        break;
      default:
        break;
    }
  };

  // Handle changes in dropdowns
  const handleChange = (type: keyof Address["address"], value: string) => {
    const id = value || null;
    const map = {
      region: regions.find((r) => r.region_id === id) || null,
      province: provinces.find((p) => p.province_id === id) || null,
      cityMunicipality:
        municipalities.find((m) => m.municipality_id === id) || null,
      barangay: barangays.find((b) => b.barangay_id === id) || null,
    };

    setAddress(type, map[type]);

    if (type !== "barangay") {
      filterOptions(type, id);
    }
  };

  // Dropdown configuration
  const dropdowns = [
    {
      label: "Region",
      type: "region" as keyof Address["address"],
      options: regions,
      value: address.region?.region_name,
      keyField: "region_id",
      nameField: "region_name",
      disabled: false,
      filteredOptions: regions,
    },
    {
      label: "Province",
      type: "province" as keyof Address["address"],
      options: filteredProvinces,
      value: address.province?.province_name,
      keyField: "province_id",
      nameField: "province_name",
      disabled: !address.region.region_id,
      filteredOptions: filteredProvinces,
    },
    {
      label: "City/Municipality",
      type: "cityMunicipality" as keyof Address["address"],
      options: filteredMunicipalities,
      value: address.cityMunicipality?.municipality_name,
      keyField: "municipality_id",
      nameField: "municipality_name",
      disabled: !address.province.province_id,
      filteredOptions: filteredMunicipalities,
    },
    {
      label: "Barangay",
      type: "barangay" as keyof Address["address"],
      options: filteredBarangays,
      value: address.barangay?.barangay_name,
      keyField: "barangay_id",
      nameField: "barangay_name",
      disabled: !address.cityMunicipality.municipality_id,
      filteredOptions: filteredBarangays,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {dropdowns.map((dropdown) => (
        <div key={dropdown.type}>
          <label className="mb-2 font-semibold text-gray-800">
            {dropdown.label} <span className="text-red-500">*</span>
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full text-left" disabled={dropdown.disabled}>
                {dropdown.value || `Select ${dropdown.label}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {dropdown.filteredOptions.map((option) => (
                <DropdownMenuItem
                  key={option[dropdown.keyField as keyof typeof option]}
                  onClick={() =>
                    handleChange(
                      dropdown.type,
                      option[dropdown.keyField as keyof typeof option] as string
                    )
                  }
                >
                  {option[dropdown.nameField as keyof typeof option]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {errors[dropdown.type] && (
            <span className="text-red-500 text-sm">
              {errors[dropdown.type]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default DropdownAddress;
