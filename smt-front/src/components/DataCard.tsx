import React from 'react';
import { Card, CardContent, Typography, Stack, Chip } from '@mui/joy';


interface DataCardProps {
  title: string;
  chip?: string;
  children?: React.ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  chip,
  children
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        width: '80%',
        minWidth: '250px',
        maxWidth: '320px',
        height: '100%',
      }}
    >
      <CardContent sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Typography
            level="title-lg"
            sx={{
              fontWeight: 'bold',
            }}
          >
            {title}
          </Typography>
          {chip && <Chip color="primary" size="md" sx={{ alignSelf: 'flex-end' }}>{chip}</Chip>}
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DataCard; 