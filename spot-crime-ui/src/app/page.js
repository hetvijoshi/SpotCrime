"use client"

import { Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./components/HotspotMap'), { ssr: false });

export default function Home() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
      <Box sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Crime Hotspots in Los Angeles
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Stay informed about local incidents and keep your community safe
        </Typography>
        <Box sx={{ height: '400px', my: 4 }}>
          <Map />
        </Box>
        {/* <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            <Link href="/report" passHref legacyBehavior>
              <a style={{ color: 'inherit', textDecoration: 'none' }}>Report a Crime</a>
            </Link>
          </Button>
          <Button variant="outlined" color="primary" sx={{ mr: 2 }}>
            <Link href="/view" passHref legacyBehavior>
              <a style={{ color: 'inherit', textDecoration: 'none' }}>View Reports</a>
            </Link>
          </Button>
          <Button variant="outlined" color="secondary">
            <Link href="/forum" passHref legacyBehavior>
              <a style={{ color: 'inherit', textDecoration: 'none' }}>Discussion Forum</a>
            </Link>
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
}
