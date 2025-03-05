import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header'
import helpers from '../helpers/helpers'


const  clientsService = {
  getDashboard
};

export default clientsService

function getDashboard() {
  return HTTP.get(`dashboard`,{
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}
