import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Typography,
  Select,
  Option,
  IconButton
} from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from './Pagination';
import CloseRounded from '@mui/icons-material/CloseRounded';

interface SearchProps {
  searchOptions: Array<{ label: string, values: string[] }>
  onChange: (searchFields: Array<string | null>) => void
  searchValues: Array<string | null>
}

function SearchBar({ onChange, searchOptions, searchValues }: SearchProps) {
  const handleSearchChange = (index: number, value: string | null) => {
    const newSearchFields = [...searchValues];
    newSearchFields[index] = value;
    onChange(newSearchFields);
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <SearchIcon />
      {searchOptions.map((option, index) => (
        <Select
          key={option.label}
          placeholder={option.label}
          value={searchValues[index] || ''}
          onChange={(_, value) => handleSearchChange(index, value as string | null)}
          sx={{ minWidth: 150 }}
          {...(searchValues[index] && {
            // display the button and remove select indicator
            // when user has selected a value
            endDecorator: (
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                onMouseDown={(event) => {
                  // don't open the popup when clicking on this button
                  event.stopPropagation();
                }}
                onClick={() => handleSearchChange(index, null)}
              >
                <CloseRounded />
              </IconButton>
            ),
            indicator: null,
          })}
        >
          {option.values.map((value) => (
            <Option key={value} value={value}>
              {value}
            </Option>
          ))}
        </Select>
      ))}
    </Stack>
  );
}

interface DataGridProps<T> {
  title: string;
  items: T[];
  itemsPerPage?: number;
  renderCard: (item: T) => React.ReactNode;
  onCreateItem: () => void;

  emptyStateTitle: string;
  emptyStateDescription: string;

  filterFunction?: (items: T[], filterParams: Record<string, unknown>) => T[];
  filterParams?: Record<string, unknown>;
  searchConfig?: SearchProps;
}

const DataGrid = <T extends { id: string | number }>({
  title,
  items,
  itemsPerPage = 8,
  renderCard,
  onCreateItem,
  emptyStateTitle,
  emptyStateDescription,
  filterFunction,
  filterParams = {},
  searchConfig,
}: DataGridProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filtering if filterFunction is provided
  const filteredItems = filterFunction ? filterFunction(items, filterParams) : items;

  // Apply search filtering based on selected search fields
  const searchFilteredItems = searchConfig && searchConfig.searchValues.some(field => field !== null) ?
    filteredItems.filter(item => {
      return searchConfig.searchValues.every((searchValue, index) => {
        if (!searchValue) return true; // Skip empty search fields

        const searchOption = searchConfig.searchOptions[index];
        if (!searchOption) return true;

        // Map search option labels to actual item fields
        let itemValue: unknown;
        switch (searchOption.label.toLowerCase()) {
          case 'document type':
          case 'тип документа': {
            itemValue = (item as Record<string, unknown>).document_type;
            break;
          }
          case 'project':
          case 'проект': {
            itemValue = (item as Record<string, unknown>).project_id;
            break;
          }
          case 'subproject':
          case 'подпроект': {
            itemValue = (item as Record<string, unknown>).subproject_id;
            break;
          }
          case 'revision':
          case 'ревизия': {
            itemValue = (item as Record<string, unknown>).revision_id;
            break;
          }
          default: {
            // Try to find the field by converting label to camelCase
            const fieldName = searchOption.label.toLowerCase().replace(/\s+/g, '');
            itemValue = (item as Record<string, unknown>)[fieldName];
          }
        }

        // Convert both values to strings for comparison, handling null/undefined
        const searchValueStr = searchValue?.toString() || '';
        const itemValueStr = itemValue?.toString() || '';

        return itemValueStr === searchValueStr;
      });
    }) : filteredItems;

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilteredItems.length]);

  // Calculate pagination
  const totalPages = Math.ceil(searchFilteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = searchFilteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.body' }}>
      {/* Main content with left margin to account for sidebar */}
      <Box sx={{ ml: '280px', p: 4, width: '70%' }}>

        {/* Header */}
        <Box sx={{ mb: 4, width: '100%' }}>
          <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography level="h2" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Button
              variant="solid"
              color="primary"
              size="lg"
              onClick={onCreateItem}
            >
              Создать
            </Button>
          </Stack>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            {searchConfig && (
              <SearchBar
                searchOptions={searchConfig.searchOptions}
                onChange={searchConfig.onChange}
                searchValues={searchConfig.searchValues}
              />
            )}
          </Box>

        </Box>

        {/* Items Grid */}
        <Grid container spacing={3}>
          {currentItems.map((item) => (
            <Grid xs={12} md={6} key={item.id}>
              {renderCard(item)}
            </Grid>
          ))}
        </Grid>

        {/* Empty state (if no items) */}
        {searchFilteredItems.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: 'text.secondary',
            }}
          >
            <Typography level="h4" sx={{ mb: 2 }}>
              {searchConfig?.searchValues.some(field => field !== null) ? 'No results found' : emptyStateTitle}
            </Typography>
            <Typography level="body-md" sx={{ mb: 3 }}>
              {searchConfig?.searchValues.some(field => field !== null)
                ? `No items match your selected filters`
                : emptyStateDescription
              }
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {searchFilteredItems.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={searchFilteredItems.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </Box>
    </Box>
  );
};

export default DataGrid; 