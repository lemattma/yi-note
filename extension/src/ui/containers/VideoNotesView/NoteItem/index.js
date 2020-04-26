import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useStoreActions } from 'easy-peasy'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { PlayCircle as PlayIcon } from 'styled-icons/feather/PlayCircle'
import { Edit as EditIcon } from 'styled-icons/material/Edit'
import { Delete as DeleteIcon } from 'styled-icons/material/Delete'
import {
  StyledMainRow,
  StyledSummary,
  StyledTimestamp,
  StyledExpandMoreIcon,
  StyledExpandedSection,
  StyledNote
} from './styled'
import IconButton from '../../../components/IconButton'
import { usePlayer } from '../../../hooks'
import { secondsToTime } from '../../../utils'

const NoteItem = ({ id, content, timestamp }) => {
  const { t } = useTranslation('noteItem')
  const {
    videoNotes: { edit, removeNote },
    alerts: { showAlerts }
  } = useStoreActions(actions => actions)
  const [expanded, setExpanded] = useState(false)
  const playerRef = usePlayer()

  const handleExpand = () => setExpanded(!expanded)

  const handlePlay = () => {
    playerRef.current.seek(timestamp)
  }

  const handleEdit = () => edit(timestamp)

  const handleDelete = () =>
    showAlerts({
      content: t('removeNoteAlertContent'),
      onConfirm: removeNote.bind(null, id)
    })

  const formattedTime = secondsToTime(timestamp)
  return (
    <Grid container>
      <StyledMainRow
        item
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Grid container direction="row" alignItems="center">
            <IconButton
              color="red"
              tooltip={t('playButtonTooltip', { formattedTime })}
              onClick={handlePlay}
            >
              <PlayIcon />
            </IconButton>
            <StyledSummary>{content}</StyledSummary>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row" alignItems="center">
            {!expanded && <StyledTimestamp>{formattedTime}</StyledTimestamp>}
            <IconButton
              tooltip={expanded ? t('collapseTooltip') : t('expandTooltip')}
              onClick={handleExpand}
            >
              <StyledExpandMoreIcon
                expanded={expanded ? expanded : undefined}
              />
            </IconButton>
          </Grid>
        </Grid>
      </StyledMainRow>
      <StyledExpandedSection
        expanded={expanded ? expanded : undefined}
        item
        direction="column"
        container
      >
        <Grid container spacing={1}>
          <Grid item container justify="space-between" alignItems="center">
            <StyledTimestamp>{formattedTime}</StyledTimestamp>
            <Grid item>
              <Grid container direction="row">
                <IconButton
                  size="small"
                  tooltip={t('editTooltip')}
                  onClick={handleEdit}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  tooltip={t('removeTooltip')}
                  onClick={handleDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <StyledNote>{content}</StyledNote>
          </Grid>
        </Grid>
      </StyledExpandedSection>
    </Grid>
  )
}

NoteItem.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired
}

export default NoteItem
