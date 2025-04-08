"use client";

import { useState, useEffect } from "react";
import { AdminMainLayout } from "@/layout/AdminMainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newQuantity, setNewQuantity] = useState<number | null>(null);

  // Fetch inventory items from the API
  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/admin/inventory");
      const data = await response.json();

      if (response.ok) {
        setInventory(data.items || []);
        setFilteredInventory(data.items || []);
      } else {
        console.error("Failed to fetch inventory:", data.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(term)
    );
    setFilteredInventory(filtered);
  };

  const handleManageItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setNewQuantity(item.quantity); // Initialize the quantity input with the current quantity
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setNewQuantity(null);
  };

  const handleUpdateQuantity = async () => {
    if (!selectedItem || newQuantity === null) return;

    try {
      const response = await fetch(`/api/admin/inventory`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedItem.id,
          quantity: newQuantity,
        }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Success",
          text: "Stock quantity updated successfully.",
          icon: "success",
        });
        fetchInventory(); // Refresh the inventory list
        handleCloseModal(); // Close the modal
      } else {
        const data = await response.json();
        Swal.fire({
          title: "Error",
          text: data.error || "Failed to update stock quantity.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    }
  };

  return (
    <AdminMainLayout>
      <section className="mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      ₱
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                      }).format(item.price)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleManageItem(item)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No inventory items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={handleCloseModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  <strong>ID:</strong> {selectedItem.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedItem.name}
                </p>
                <p>
                  <strong>Category:</strong> {selectedItem.category}
                </p>
                <p>
                  <strong>Current Quantity:</strong> {selectedItem.quantity}
                </p>
                <div>
                  <label htmlFor="quantity" className="block font-medium">
                    Update Quantity:
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newQuantity ?? ""}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="default" onClick={handleUpdateQuantity}>
                  Update Quantity
                </Button>
                <Button variant="outline" onClick={handleCloseModal}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </section>
    </AdminMainLayout>
  );
}
