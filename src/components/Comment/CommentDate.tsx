import React from 'react'
import moment from 'moment'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  dateBackground: {
    backgroundColor: '#828280',
    width: 'fit-content',
    padding: '5px 10px',
    color: 'white',
    fontSize: '12px',
    fontFamily: 'Open Sans',
    marginBottom: '20px'
  }
}))

export default function CommentDate(_props: any) {
  const classes = useStyles()

  return (
    <div className={classes.dateBackground}>
      {moment(_props.commentData.creationDate).format('dddd DD MMMM')}
    </div>
  )
}
