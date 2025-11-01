import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../feature/authSlice'
import settingReducer from '../feature/settingSlide'
import workflowReducer from '../feature/workflowSlide'
import categoryReducer from '../feature/categorSlice'
import usersReducer from '../feature/userSlide'
import notificationReducer from '../feature/notificationSlide'
import purchasesReducer from '../feature/purchaseSlide'
import depositsReducer from '../feature/depositSlide'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    setting: settingReducer,
    workflows: workflowReducer,
    categories: categoryReducer,
    users: usersReducer,
    notification: notificationReducer,
    purchases: purchasesReducer,
    deposits: depositsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;