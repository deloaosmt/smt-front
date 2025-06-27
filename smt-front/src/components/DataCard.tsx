import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/joy';
import type { File } from '../types/file';
import type { Project } from '../types/project';
import type { Subproject } from '../types/subpoject';
import type { Revision } from '../types/revision';
import { KeyboardArrowRight } from '@mui/icons-material';

type DataItem = File | Project | Subproject | Revision;

interface DataCardProps {
  item: DataItem;
  onClick?: () => void;
  onForwardClick?: () => void;
  showChip?: boolean;
  chipText?: string;
  chipColor?: 'primary' | 'neutral' | 'danger' | 'success' | 'warning';
}

const DataCard: React.FC<DataCardProps> = ({
  item,
  onClick,
  onForwardClick = null,
  showChip = false,
  chipText,
  chipColor = 'primary'
}) => {
  // Helper function to get the title
  const getTitle = (item: DataItem): string => {
    if ('displayName' in item) return item.displayName; // File
    if ('title' in item) return item.title; // Project, Subproject, Revision
    return 'Untitled';
  };

  // Helper function to get the description
  const getDescription = (item: DataItem): string => {
    if ('documentType' in item) return item.documentType || 'generic document'; // File
    if ('description' in item) return item.description; // Project, Subproject, Revision
    return '';
  };

  // Helper function to get the creation date
  const getCreatedDate = (item: DataItem): string => {
    if ('createdAt' in item) return new Date(item.createdAt).toLocaleDateString();
    return '';
  };

  // Helper function to get the update date
  const getUpdatedDate = (item: DataItem): string => {
    if ('updatedAt' in item) return new Date(item.updatedAt).toLocaleDateString();
    return '';
  };

  // Helper function to get additional info
  const getAdditionalInfo = (item: DataItem): string => {
    if ('projectId' in item && 'revisionNumber' in item) {
      return `Project ID: ${item.projectId}`; // Revision
    }
    return '';
  };

  // Helper function to get chip text
  const getChipText = (item: DataItem): string => {
    if (chipText) return chipText;
    if ('revisionNumber' in item) return `Rev ${item.revisionNumber}`; // Revision
    if ('documentType' in item) return item.documentType || 'File'; // File
    return '';
  };

  const title = getTitle(item);
  const description = getDescription(item);
  const createdDate = getCreatedDate(item);
  const updatedDate = getUpdatedDate(item);
  const additionalInfo = getAdditionalInfo(item);
  const chipTextToShow = getChipText(item);

  return (
    <Card
      variant="outlined"
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography level="h4" sx={{ fontWeight: 'bold', flex: 1 }}>
            {title}
          </Typography>
          {(showChip || chipTextToShow) && (
            <Chip
              size="sm"
              variant="soft"
              color={chipColor}
              sx={{ ml: 1 }}
            >
              {chipTextToShow}
            </Chip>
          )}
        </Box>

        <Typography level="body-md" sx={{ mb: 2, color: 'text.secondary' }}>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
            {additionalInfo || `Создано: ${createdDate}`}
          </Typography>
          {updatedDate && updatedDate !== createdDate && (
            <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
              Обновлено: {updatedDate}
            </Typography>
          )}
          {onForwardClick && (
            <Button variant="outlined" color="neutral" size="sm" endDecorator={<KeyboardArrowRight />} onClick={onForwardClick}>
              Перейти
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DataCard; 