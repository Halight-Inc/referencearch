import { legacy_createStore as createStore } from 'redux'

// Define the type for the state
interface AppState {
  sidebarShow: boolean;
  theme: 'light' | 'dark' | 'auto';
  sidebarUnfoldable?: boolean;
  // Add other state properties here if needed
}

// Define the type for the actions
interface AppAction {
  type: string;
  [key: string]: any; // Allow other properties in the action
}

const initialState: AppState = {
  sidebarShow: true,
  theme: 'light',
  sidebarUnfoldable: false,
}

const changeState = (state: AppState = initialState, { type, ...rest }: AppAction) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
