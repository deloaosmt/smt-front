import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Select,
  Option,
  IconButton,
  Chip,
  Tooltip,
  IconButton as JoyIconButton,
  Table,
  Sheet
} from '@mui/joy';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import type { File } from '../types/file';
import { truncate } from '../common/TextUtils';
import type { FilterState } from '../pages/files/files-ui-state';

interface FileTableProps {
  files: File[];
  isLoading?: boolean;
  onDownload?: (file: File) => void;
  onDelete?: (file: File) => void;
  onCreate?: () => void;

  // Filter options
  fileTypes?: Array<{ type: string; name: string }>;
  projects?: Array<{ id: number; title: string }>;
  subprojects?: Array<{ id: number; title: string }>;
  revisions?: Array<{ id: number; title: string }>;

  // Filter state
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FileTable: React.FC<FileTableProps> = ({
  files,
  isLoading = false,
  onDownload,
  onDelete,
  onCreate,
  fileTypes = [],
  projects = [],
  subprojects = [],
  revisions = [],
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (key: keyof FilterState, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tableHeaders = [
    'Название',
    'Тип',
    'Проект',
    'Подпроект',
    'Изм',
    'Дата создания',
    'Действия'
  ];

  const textMaxSize = 30;

  const renderTableRow = (file: File) => (
    <tr key={file.id}>
      <td>
        <Box>
          <Typography level="body-md" fontWeight="lg">
            {truncate(file.name, textMaxSize)}
          </Typography>
          {file.filename && (
            <Typography level="body-sm" color="neutral">
              {truncate(file.filename, textMaxSize)}
            </Typography>
          )}
        </Box>
      </td>
      <td>
        {file.document_type && (
          <Chip size="sm" variant="soft" color="primary">
            {fileTypes.find(type => type.type === file.document_type)?.name || '-'}
          </Chip>
        )}
      </td>
      <td>
        <Typography level="body-sm">
          {truncate(file?.project_name || '-', textMaxSize)}
        </Typography>
      </td>
      <td>
        <Typography level="body-sm">
          {truncate(file.subproject_name || '-', textMaxSize)}
        </Typography>
      </td>
      <td>
        <Typography level="body-sm">
          {truncate(file.revision_name || '-', textMaxSize)}
        </Typography>
      </td>
      <td>
        <Typography level="body-sm">
          {formatDate(file.created_at)}
        </Typography>
      </td>
      <td>
        <Stack direction="row" spacing={1} justifyContent="center">
          {onDownload && (
            <Tooltip title="Скачать">
              <JoyIconButton
                size="sm"
                variant="plain"
                color="success"
                onClick={() => onDownload(file)}
              >
                <DownloadIcon />
              </JoyIconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Удалить">
              <JoyIconButton
                size="sm"
                variant="plain"
                color="danger"
                onClick={() => onDelete(file)}
              >
                <DeleteIcon />
              </JoyIconButton>
            </Tooltip>
          )}
        </Stack>
      </td>
    </tr>
  );

  return (
    <Box sx={{ backgroundColor: 'background.body', justifyContent: 'center', width: '100%', flexGrow: 0 }}>
      <Box sx={{ p: 2, width: '100%' }}>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography level="h2" sx={{ fontWeight: 'bold' }}>
              Файлы
            </Typography>
            {onCreate && (
              <Button
                variant="solid"
                color="primary"
                startDecorator={<AddIcon />}
                onClick={onCreate}
              >
                Создать
              </Button>
            )}
          </Stack>

          {/* Filters */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <SearchIcon />

            <Select
              placeholder="Тип файла"
              value={filters.documentType || ''}
              onChange={(_, value) => onFiltersChange({ ...filters, documentType: value })}
              sx={{ minWidth: 150 }}
              {...(filters.documentType && {
                endDecorator: (
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => handleFilterChange('documentType', null)}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
                indicator: null,
              })}
            >
              {fileTypes.map(type => (
                <Option key={type.type} value={type.type}>
                  {type.name}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Проект"
              value={filters.projectId || ''}
              onChange={(_, value) => onFiltersChange({ ...filters, projectId: value, subprojectId: null, revisionId: null })}
              sx={{ minWidth: 150 }}
              {...(filters.projectId && {
                endDecorator: (
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => handleFilterChange('projectId', null)}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
                indicator: null,
              })}
            >
              {projects.map(project => (
                <Option key={project.id} value={project.id.toString()}>
                  {project.title}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Подпроект"
              value={filters.subprojectId || ''}
              onChange={(_, value) => onFiltersChange({ ...filters, subprojectId: value, revisionId: null })}
              disabled={!filters.projectId}
              sx={{ minWidth: 150 }}
              {...(filters.subprojectId && {
                endDecorator: (
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => handleFilterChange('subprojectId', null)}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
                indicator: null,
              })}
            >
              {subprojects.map(subproject => (
                <Option key={subproject.id} value={subproject.id.toString()}>
                  {subproject.title}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Изм"
              value={filters.revisionId || ''}
              onChange={(_, value) => onFiltersChange({ ...filters, revisionId: value })}
              disabled={!filters.subprojectId}
              sx={{ minWidth: 150 }}
              {...(filters.revisionId && {
                endDecorator: (
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => handleFilterChange('revisionId', null)}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
                indicator: null,
              })}
            >
              {revisions.map(revision => (
                <Option key={revision.id} value={revision.id.toString()}>
                  {revision.title}
                </Option>
              ))}
            </Select>
          </Stack>
        </Box>

        {/* Table */}
        <Sheet
          variant="outlined"
          sx={{
            borderRadius: 'sm',
            overflow: 'auto'
          }}
        >
          {isLoading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography>Загрузка...</Typography>
            </Box>
          ) : files.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography level="h4" sx={{ mb: 1, color: 'neutral' }}>
                Нет файлов
              </Typography>
              <Typography level="body-md" color="neutral">
                Файлы не найдены
              </Typography>
            </Box>
          ) : (
            <Table variant="soft" hoverRow>
              <thead>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th key={index} style={{ textAlign: 'center' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {files.map(renderTableRow)}
              </tbody>
            </Table>
          )}
        </Sheet>
      </Box>
    </Box>
  );
};

export default FileTable; 