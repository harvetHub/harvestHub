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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Address {
  id: number;
  name: string;
  phone: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  postal: string;
  street: string;
  label: string;
  isDefault: boolean;
  isPickup: boolean;
  isReturn: boolean;
}

const AddressList: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: "John Doe",
      phone: "09123456789",
      region: "Region 1",
      province: "Province 1",
      city: "City 1",
      barangay: "Barangay 1",
      postal: "1234",
      street: "123 Main St, Building A",
      label: "Home",
      isDefault: true,
      isPickup: false,
      isReturn: false,
    },
  ]);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
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
    setNewAddress({});
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

  const dropdownFields = [
    { id: "region", label: "Region", options: ["Region 1", "Region 2"] },
    {
      id: "province",
      label: "Province",
      options: ["Province 1", "Province 2"],
    },
    { id: "city", label: "City", options: ["City 1", "City 2"] },
    {
      id: "barangay",
      label: "Barangay",
      options: ["Barangay 1", "Barangay 2"],
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dropdownFields.map((field) => (
                <Select
                  key={field.id}
                  onValueChange={(value) =>
                    setNewAddress({ ...newAddress, [field.id]: value })
                  }
                  value={String(newAddress[field.id as keyof Address] || "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
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
                {address.city}, {address.province}, {address.region}
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
