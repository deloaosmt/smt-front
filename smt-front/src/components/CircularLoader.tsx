import CircularProgress from '@mui/joy/CircularProgress';

interface CircularLoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

export const CircularLoader = ({ size }: CircularLoaderProps = {}) => {
  return <CircularProgress 
    size={size} 
    sx={{ 
      position: size ? 'static' : 'absolute', 
      top: size ? undefined : '50%', 
      left: size ? undefined : '50%' 
    }} 
  />;
};