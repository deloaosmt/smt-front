import { Box, Container } from "@mui/joy";
import Navigation from "../components/Navigation";

const SinglePage = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ 
      backgroundColor: 'background.body', 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%',
      padding: '2rem'
    }}>
      <Navigation />
      <Container maxWidth="xl">
        {children}
      </Container>
    </Box>
  );
};

export default SinglePage;