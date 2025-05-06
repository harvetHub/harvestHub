"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import DropdownAddress from "./DropDownAddress";
import { Address } from "@/lib/definitions";
import regions from "@/json/region.json";
import municipalities from "@/json/municipality.json";
import provinces from "@/json/province.json";
import barangays from "@/json/barangay.json";

const initialForm = {
  name: "",
  phone: "",
  address: {
    region: { region_id: "", region_name: "" },
    province: { province_id: "", region_id: "", province_name: "" },
    cityMunicipality: {
      municipality_id: "",
      province_id: "",
      municipality_name: "",
    },
    barangay: { barangay_id: "", municipality_id: "", barangay_name: "" },
  },
  postal: "",
  street: "",
  label: "",
  isDefault: false,
  isPickup: false,
  isReturn: false,
};

const AddressList: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<
    Partial<Omit<Address, "address">> & {
      address: Partial<Address["address"]>;
    }
  >(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.street) {
      alert("Please fill in all required fields.");
      return;
    }

    const newId =
      addresses.length > 0 ? Math.max(...addresses.map((a) => a.id)) + 1 : 1;
    setAddresses([
      ...addresses,
      {
        ...newAddress,
        id: newId,
        isDefault: false,
        isPickup: false,
        isReturn: false,
      } as Address,
    ]);
    setNewAddress(initialForm);
    setIsModalOpen(false);
  };

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((address) =>
        address.id === id
          ? { ...address, isDefault: true }
          : { ...address, isDefault: false }
      )
    );
  };

  const handleEditAddress = (address: Address) => {
    setNewAddress(address);
    setIsModalOpen(true);
  };

  const handleSetAddress = (
    type: keyof Address["address"],
    value: Address["address"][keyof Address["address"]] | null
  ) => {
    console.log(`Updating ${type} with value:`, value);
    setNewAddress((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [type]: value || { province_id: "", region_id: "", province_name: "" }, // Ensure default structure
      },
    }));
  };

  const formFields = [
    { id: "name", label: "Full Name", type: "text", placeholder: "Full Name" },
    {
      id: "phone",
      label: "Phone Number",
      type: "text",
      placeholder: "Phone Number",
    },
    {
      id: "postal",
      label: "Postal Code",
      type: "text",
      placeholder: "Postal Code",
    },
    {
      id: "street",
      label: "Street Name, Building, House No.",
      type: "text",
      placeholder: "Street Address",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Addresses</h2>

      {/* Add New Address Button */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button>Add New Address</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newAddress.id ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {formFields.map((field) => (
              <Input
                key={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={String(newAddress[field.id as keyof Address] || "")}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, [field.id]: e.target.value })
                }
              />
            ))}

            {/* DropdownAddress Component */}
            <DropdownAddress
              address={{
                ...initialForm.address,
                ...newAddress.address,
              }}
              setAddress={handleSetAddress}
              regions={regions.map((region) => ({
                ...region,
                region_id: String(region.region_id),
              }))}
              provinces={provinces.map((province) => ({
                ...province,
                province_id: String(province.province_id),
                region_id: String(province.region_id),
              }))}
              municipalities={municipalities.map((municipality) => ({
                ...municipality,
                municipality_id: String(municipality.municipality_id),
                province_id: String(municipality.province_id),
              }))}
              barangays={barangays.map((barangay) => ({
                ...barangay,
                barangay_id: String(barangay.barangay_id),
                municipality_id: String(barangay.municipality_id),
              }))}
              errors={{}}
            />

            <div className="space-y-2">
              <Checkbox
                checked={newAddress.isDefault || false}
                onCheckedChange={(checked) =>
                  setNewAddress({ ...newAddress, isDefault: !!checked })
                }
              >
                Set as Default Address
              </Checkbox>
              <Checkbox
                checked={newAddress.isPickup || false}
                onCheckedChange={(checked) =>
                  setNewAddress({ ...newAddress, isPickup: !!checked })
                }
              >
                Set as Pickup Address
              </Checkbox>
              <Checkbox
                checked={newAddress.isReturn || false}
                onCheckedChange={(checked) =>
                  setNewAddress({ ...newAddress, isReturn: !!checked })
                }
              >
                Set as Return Address
              </Checkbox>
            </div>
            <Button onClick={handleAddAddress}>
              {newAddress.id ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <Card key={address.id} className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {address.name}{" "}
                {address.isDefault && (
                  <span className="text-sm text-blue-600">(Default)</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{address.street}</p>
              <p className="text-sm text-gray-600">
                {address.address.cityMunicipality.municipality_name},{" "}
                {address.address.province.province_name},{" "}
                {address.address.region.region_name}
              </p>
              <p className="text-sm text-gray-600">Postal: {address.postal}</p>
              <p className="text-sm text-gray-600">Phone: {address.phone}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleEditAddress(address)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSetDefault(address.id)}
                disabled={address.isDefault}
              >
                {address.isDefault ? "Default" : "Set as Default"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddressList;
