import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
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
  Breadcrumbs,
  Link
} from '@mui/joy';
import { useNavigate } from 'react-router';
import Pagination from './Pagination';

interface DataGridProps<T> {
  title: string;
  items: T[];
  itemsPerPage?: number;
  renderCard: (item: T) => React.ReactNode;
  onCreateItem: (formData: Record<string, string>) => void;
  createModalTitle: string;
  createModalDescription: string;
  createButtonText: string;
  formFields: {
    name: string;
    label: string;
    required?: boolean;
  }[];
  emptyStateTitle: string;
  emptyStateDescription: string;
  breadcrumbs?: Array<{
    label: string;
    path?: string;
  }>;
  filterFunction?: (items: T[], filterParams: Record<string, unknown>) => T[];
  filterParams?: Record<string, unknown>;
}

const DataGrid = <T extends { id: string | number }>({
  title,
  items,
  itemsPerPage = 8,
  renderCard,
  onCreateItem,
  createModalTitle,
  createModalDescription,
  createButtonText,
  formFields,
  emptyStateTitle,
  emptyStateDescription,
  breadcrumbs = [],
  filterFunction,
  filterParams = {},
}: DataGridProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Apply filtering if filterFunction is provided
  const filteredItems = filterFunction ? filterFunction(items, filterParams) : items;

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredItems.length]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreateItem(formData);
    setCreateModalOpen(false);
    setFormData({});
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const createModal = (
    <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
      <ModalDialog>
        <DialogTitle>{createModalTitle}</DialogTitle>
        <DialogContent>{createModalDescription}</DialogContent>
        <form onSubmit={handleCreateSubmit}>
          <Stack spacing={2}>
            {formFields.map((field) => (
              <FormControl key={field.name}>
                <FormLabel>{field.label}</FormLabel>
                <Input
                  autoFocus={field.name === formFields[0].name}
                  required={field.required !== false}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              </FormControl>
            ))}
            <Button type="submit">{createButtonText}</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.body' }}>
      {/* Main content with left margin to account for sidebar */}
      <Box sx={{ ml: '280px', p: 4 }}>
        <Container maxWidth="xl" sx={{ p: 0 }}>
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Breadcrumbs>
                {breadcrumbs.map((crumb, index) => (
                  <Link
                    key={index}
                    color={index === breadcrumbs.length - 1 ? 'primary' : 'neutral'}
                    href={crumb.path}
                    onClick={(e: React.MouseEvent) => {
                      if (crumb.path) {
                        e.preventDefault();
                        navigate(crumb.path);
                      }
                    }}
                    sx={{ 
                      textDecoration: 'none',
                      cursor: crumb.path ? 'pointer' : 'default'
                    }}
                  >
                    {crumb.label}
                  </Link>
                ))}
              </Breadcrumbs>
            </Box>
          )}

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography level="h2" sx={{ fontWeight: 'bold' }}>
                {title}
              </Typography>
              <Button
                variant="solid"
                color="primary"
                size="lg"
                onClick={() => setCreateModalOpen(true)}
              >
                {createButtonText}
              </Button>
            </Box>
            {createModal}
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
          {filteredItems.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <Typography level="h4" sx={{ mb: 2 }}>
                {emptyStateTitle}
              </Typography>
              <Typography level="body-md" sx={{ mb: 3 }}>
                {emptyStateDescription}
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredItems.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default DataGrid; 