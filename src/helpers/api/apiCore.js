import { unavailable } from '../showcase';

// Compatibility surface only. Never restores a production session.
const setAuthorization = () => {};
class APICore {
    get = unavailable;
    getFile = unavailable;
    getMultiple = unavailable;
    create = unavailable;
    updatePatch = unavailable;
    update = unavailable;
    delete = unavailable;
    createWithFile = unavailable;
    updateWithFile = unavailable;
    isUserAuthenticated = () => false;
    getLoggedInUser = () => null;
    setLoggedInUser = () => {};
    setUserInSession = () => {};
}
export { APICore, setAuthorization };
