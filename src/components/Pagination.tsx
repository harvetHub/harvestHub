import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center gap-2 mt-12">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="cursor-pointer"
      >
        Previous
      </Button>
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            className="cursor-pointer"
            onClick={() => onPageChange(page)}
            variant={currentPage === page ? "default" : "outline"}
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="px-2">
            {page}
          </span>
        )
      )}
      <Button
        className="cursor-pointer"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
