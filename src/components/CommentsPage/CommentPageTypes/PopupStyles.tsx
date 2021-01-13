import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxHeight: '90vh',
    minHeight: '65vh',
    background: 'rgba(204, 196, 192, 0.98)',
    width: (props: any) =>
      props.isExpanded ? props.expandedWidth : props.width,
    padding: '5px 20px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden'
  },
  popupHeader: {
    width: '100%',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    display: 'flex',
    alignItems: 'center',
    '& .label': {
      fontFamily: "Barlow Condensed, sans-serif",
      color: "#494340",
      display: 'inline-block',
      textTransform: 'uppercase',
      textDecorationLine: 'underline',
      textUnderlineOffset: '5px',
      textDecorationThickness: '5px',
      fontWeight: '600',
      lineHeight: '38px',
      wordSpacing: '0px',
      fontSize: '1.5rem',
      paddingBottom: '1px',
      marginTop: '35px',
      marginBottom: '10px',
      flex: 1
    }
  },
  popupSubHeader: {
    fontSize: '20px',
    padding: '8px 16px',
    fontWeight: 700,
    color: 'black',
    paddingBottom: theme.spacing(4),
  },
  headerActions: {
    display: 'flex',
    marginTop: '-15px',
    alignItems: 'center',
    marginBottom: '20px',
    '& .actionBtn': {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 25,
      width: 25,
      background: 'rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)'
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
        width: 'auto',
        transform: 'scale(1.2)'
      }
    }
  },
  commentsContainer: {
    minHeight: 0,
    flex: 1,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(0),
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
