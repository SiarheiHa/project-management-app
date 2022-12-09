import { Alert, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import BoardCard from './BoardCard/BoardCard';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetBoardsSetByUserIdQuery } from 'services/boards.api';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './boardList.scss';
import CreateBoardModal from '../CreateBoardModal/CreateBoardModal';
import TaskSearchBlock from 'components/TaskSearchBlock/TaskSearchBlock';

// tabs start
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { selectActiveTab, setActiveTab } from 'store/boardsPageSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// tabs end

const BoardsList = () => {
  const { id } = useCurrentUser();
  const { data, isError, isLoading } = useGetBoardsSetByUserIdQuery(id);
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const activeTab = useAppSelector(selectActiveTab);
  const dispatch = useAppDispatch();
  const onClickAddBoard = () => {
    setModalOpen(true);
  };
  const onModalClose = () => setModalOpen(false);

  // tabs
  const [value, setValue] = React.useState(activeTab === 'boards' ? 0 : 1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    dispatch(setActiveTab({ activeTab: newValue === 0 ? 'boards' : 'tasks' }));
  };

  return (
    <>
      {/* tabs start */}
      <Box sx={{ width: '100%', marginBottom: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label={t('boards.myBoards')} {...a11yProps(0)} />
            <Tab label={t('task.myTasks')} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {data && (
            <Grid container spacing={2}>
              {data &&
                data.map((board) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={board._id}>
                      <BoardCard key={board._id} board={board} />
                    </Grid>
                  );
                })}
              {!isLoading && (
                <Grid item xs={12} sm={6} md={4} key={'add'}>
                  <Card onClick={onClickAddBoard} className="addBoardCard">
                    <CardContent>
                      <Typography variant="h4" component="div">
                        {t('menu.addBoard')}
                      </Typography>

                      <AddCircleIcon sx={{ width: 50, height: 50 }} />
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {modalOpen && <CreateBoardModal onModalClose={onModalClose} open={modalOpen} />}
            </Grid>
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TaskSearchBlock />
        </TabPanel>
      </Box>
      {/* tabs end */}
      <Box textAlign={'center'}>
        {isLoading && <CircularProgress size={80} />}
        {isError && (
          <Alert variant="outlined" severity="error">
            {t('boards.serverError')}
          </Alert>
        )}
      </Box>
    </>
  );
};

export default BoardsList;
