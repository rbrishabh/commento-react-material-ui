import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxHeight: '90vh',
    minHeight: '65vh',
    width: (props: any) =>
      props.isExpanded ? props.expandedWidth : props.width,
    padding: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease-in-out',
    boxShadow: theme.shadows[5],
    borderRadius: '10px',
    position: 'relative',
    overflow: 'hidden'
  },
  popupHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    paddingBottom: theme.spacing(4),
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    '& .label': {
      color: theme.palette.primary.main,
      display: 'inline-block',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      flex: 1
    }
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    '& .actionBtn': {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 30,
      width: 30,
      background: '#f8f9f8',
      borderRadius: 10,
      cursor: 'pointer',
      '&:hover': {
        background: '#f1f1f1'
      },
      '&:not(:last-child)': {
        marginRight: theme.spacing(1)
      },
      '&.cross': {
        '& svg': {
          height: 10
        }
      },
      '& svg': {
        verticalAlign: 'middle',
        height: 20,
        width: 'auto'
      }
    }
  },
  commentsContainer: {
    minHeight: 0,
    flex: 1,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(7),
    overflowY: 'auto',
    '&::-webkit-scrollbar-thumb': {
      background: 'hsla(0,0%,53.3%,.519)',
      borderRagius: 10,
      padding: 4
    },
    '&::-webkit-scrollbar ': {
      width: 5,
      padding: 10
    }
  },
  addNewCommentWrapper: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`
  }
}))
