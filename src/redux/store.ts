import { configureStore } from '@reduxjs/toolkit';
import labelsReducer from './slices/labels';
import notesReducer from './slices/notes';
import userReducer from './slices/user';

export const store = configureStore({
  reducer: {
    labels: labelsReducer,
    notes: notesReducer,
    user: userReducer,
  },
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
