import React from 'react';
import { Box, Button, Typography } from '@mui/joy';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 6,
        px: 2,
      }}
    >
      {/* Items info */}
      <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
        Показано {startItem}-{endItem} из {totalItems} проектов
      </Typography>

      {/* Pagination controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Previous button */}
        <Button
          variant="outlined"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Назад
        </Button>

        {/* Page numbers */}
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <Typography level="body-sm" sx={{ px: 1, color: 'text.secondary' }}>
                ...
              </Typography>
            ) : (
              <Button
                variant={currentPage === page ? 'solid' : 'outlined'}
                color={currentPage === page ? 'primary' : 'neutral'}
                size="sm"
                onClick={() => onPageChange(page as number)}
                sx={{ minWidth: '40px' }}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        {/* Next button */}
        <Button
          variant="outlined"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Вперед
        </Button>
      </Box>
    </Box>
  );
};

// Simple Next/Prev pagination for server-side pagination without total count
interface NextPrevPaginationProps {
  currentPage: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  itemsPerPage: number;
  currentItemsCount: number;
}

export const NextPrevPagination: React.FC<NextPrevPaginationProps> = ({
  currentPage,
  onNextPage,
  onPrevPage,
  hasNextPage,
  hasPrevPage,
  itemsPerPage,
  currentItemsCount,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = (currentPage - 1) * itemsPerPage + currentItemsCount;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 6,
        px: 2,
      }}
    >
      {/* Items info */}
      <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
        Показано {startItem}-{endItem} файлов (страница {currentPage})
      </Typography>

      {/* Pagination controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Previous button */}
        <Button
          variant="outlined"
          size="sm"
          disabled={!hasPrevPage}
          onClick={onPrevPage}
        >
          Назад
        </Button>

        {/* Page indicator */}
        <Typography level="body-sm" sx={{ px: 2, color: 'text.primary' }}>
          Страница {currentPage}
        </Typography>

        {/* Next button */}
        <Button
          variant="outlined"
          size="sm"
          disabled={!hasNextPage}
          onClick={onNextPage}
        >
          Вперед
        </Button>
      </Box>
    </Box>
  );
};

export default Pagination; 