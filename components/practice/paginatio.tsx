"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const totalPages = 10;

function getPages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage]);
  if (currentPage - 1 > 1) pages.add(currentPage - 1);
  if (currentPage + 1 < totalPages) pages.add(currentPage + 1);
  return Array.from(pages).sort((a, b) => a - b);
}

export default function PaginationDemo() {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = getPages(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage((page) => Math.max(1, page - 1));
            }}
          />
        </PaginationItem>

        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const showEllipsis = previousPage !== undefined && page - previousPage > 1;

          return (
            <span key={page} className="flex items-center">
              {showEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </span>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage((page) => Math.min(totalPages, page + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
