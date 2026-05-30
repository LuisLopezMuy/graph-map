import { Grid } from '@mui/material'
import { MapPanel, CityDetailPanel } from "./components"


function App() {

  return (
    <Grid container spacing={1} sx={{ backgroundColor: "#929292ff" }}>
      <Grid size={9}>
        <MapPanel />
      </Grid>

      <Grid size={3}>
        <CityDetailPanel />
      </Grid>
    </Grid>
  )
}

export default App
