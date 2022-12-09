import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type BoardsPageState = {
  activeTab: 'boards' | 'tasks';
  searchValue: string;
};

const initialBoardsPageState: BoardsPageState = {
  activeTab: 'boards',
  searchValue: '',
};

const boardsPageSlice = createSlice({
  name: 'boardsPage',
  initialState: initialBoardsPageState,
  reducers: {
    setActiveTab: (
      state: BoardsPageState,
      action: PayloadAction<Pick<BoardsPageState, 'activeTab'>>
    ) => {
      state.activeTab = action.payload.activeTab;
    },
    setSearchValue: (
      state: BoardsPageState,
      action: PayloadAction<Pick<BoardsPageState, 'searchValue'>>
    ) => {
      state.searchValue = action.payload.searchValue;
    },
  },
});

export const { setActiveTab, setSearchValue } = boardsPageSlice.actions;
export default boardsPageSlice.reducer;

export const selectActiveTab = ({ boardsPage }: RootState) => boardsPage.activeTab;
export const selectSearchValue = ({ boardsPage }: RootState) => boardsPage.searchValue;
