import React from 'react';
import { Card, CardContent, Typography, Stack } from '@mui/joy';


interface DataCardProps {
  title: string;
  children?: React.ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
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
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}>
        <Typography
          level="h4"
          sx={{
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DataCard; 