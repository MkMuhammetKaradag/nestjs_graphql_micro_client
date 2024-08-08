import React from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(currentPage + 2, totalPages);

    if (currentPage <= 3) {
      startPage = 1;
      endPage = Math.min(maxVisiblePages, totalPages);
    } else if (currentPage > totalPages - 3) {
      startPage = Math.max(totalPages - (maxVisiblePages - 1), 1);
      endPage = totalPages;
    }

    // Eğer tıklanan sayfa ortadaysa, sayfa numaraları ortada olacak şekilde ayarlanır.
    if (
      endPage - startPage < maxVisiblePages - 1 &&
      totalPages > maxVisiblePages
    ) {
      if (startPage === 1) {
        endPage = maxVisiblePages;
      } else if (endPage === totalPages) {
        startPage = totalPages - (maxVisiblePages - 1);
      }
    }

    // Sayfa numaralarını oluştur
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i ? 'bg-red-500 text-white' : 'bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded-md ${
          currentPage === 1 ? 'bg-gray-200' : 'bg-red-500 text-white'
        }`}
      >
        <AiOutlineLeft
          size={23}
          className={`${currentPage === 1 ? 'text-black' : ' text-white'}`}
        />
      </button>
      {renderPageNumbers()}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded-md ${
          currentPage === totalPages ? 'bg-gray-200' : 'bg-red-500 text-white'
        }`}
      >
        <AiOutlineRight
          size={23}
          className={`${
            currentPage === totalPages ? 'text-black' : ' text-white'
          }`}
        />
      </button>
    </div>
  );
};

export default Pagination;
