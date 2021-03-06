import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import planCount from './planCount.reducer';
import totalAction from './totalactions.reducer';
import imperator from './imperator.reducer';
import monthlyUsersOverTime from './monthlyusers.reducer';
import singleCompanyData from './singleCompany.reducer';
import singleCompanyUsers from './singleCompanyUsers.reducer';
import strategic from './strategic.reducer'
import aureliusUserSearch from './aureliusUserSearch.reducer'
// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  planCount,
  totalAction,
  imperator,
  monthlyUsersOverTime,
  strategic, 
  singleCompanyData,
  singleCompanyUsers,
  aureliusUserSearch
});

export default rootReducer;
