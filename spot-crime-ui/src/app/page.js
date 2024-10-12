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
        <tableau-viz id='tableau-viz' src='https://public.tableau.com/views/SpotCrime/Sheet1?:language=en-GB&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link' width='1536' height='655' hide-tabs toolbar='bottom' ></tableau-viz>
      </Box>
    </Box>
  );
}
