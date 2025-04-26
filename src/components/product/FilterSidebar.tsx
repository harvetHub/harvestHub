import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { categories } from "@/lib/productsConfig";

interface FilterSidebarProps {
  filter: string;
  setFilter: (filter: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
}

const FilterSidebar: FC<FilterSidebarProps> = ({
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}) => {
  return (
    <div className="w-full md:w-1/4">
      <h2 className="text-xl font-bold mt-8 mb-4">Search Products</h2>
      <Input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4"
      />

      <h2 className="text-xl font-bold mt-8 mb-4 border-t pt-4">Price Range</h2>
      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className="w-1/2"
          placeholder="Min"
        />
        <Input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-1/2"
          placeholder="Max"
        />
      </div>
      <Slider
        min={0}
        max={maxPrice}
        value={priceRange}
        onValueChange={(value: number[]) =>
          setPriceRange(value as [number, number])
        }
        className="w-full"
      />
      <div className="flex justify-between mt-2 mb-4 border-b pb-4">
        <span>₱{priceRange[0]}</span>
        <span>₱{priceRange[1]}</span>
      </div>
      <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
      <div className="space-y-2">
        <Button
          key="all"
          variant={filter === "All" ? "default" : "outline"}
          onClick={() => setFilter("All")}
          className="w-full text-left"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={filter === category.value ? "default" : "outline"}
            onClick={() => setFilter(category.value)}
            className="w-full text-left flex items-center space-x-2"
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
