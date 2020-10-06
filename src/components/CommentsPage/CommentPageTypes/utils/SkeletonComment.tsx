import React from 'react'
import { Box, Grid } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'

export const SkeletonComment = () => {
  return (
    <Box mb={4}>
      <Grid container alignItems='center'>
        <Grid item>
          <Skeleton variant='circle' width={25} height={25} animation='wave' />
        </Grid>
        <Grid xs>
          <Box px={2}>
            <Skeleton variant='rect' height={20} animation='wave' />
          </Box>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <Box pt={2}>
              <Skeleton
                variant='rect'
                style={{ width: '75%' }}
                height={15}
                animation='wave'
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box pt={1}>
              <Skeleton
                variant='rect'
                height={15}
                animation='wave'
                style={{ width: '45%' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
