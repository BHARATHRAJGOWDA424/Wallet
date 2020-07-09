const UserModel = require('../schemas/UserSchema');
const BaseRepository = require('./BaseRepository');

module.exports = class UserRepository extends BaseRepository {
  constructor() {
    super();
  }

  async findOneBySelectingPassword(predicate, id) {
    let user = await this.model(id).findOne(predicate, "+password");
    return user

  }

  async findProductManagersByPagination(pageIndex, pageSize, searchKey, tenantId) {
    let query = {}
    let filters = [{ role: Role.ProductManager }, { role: Role.Tenant }]
    if (searchKey) {
      filters.push({
        $or: [
          { "name": new RegExp(searchKey, 'i') },
          { "tenantId": new RegExp(searchKey, 'i') },
          { "email": new RegExp(searchKey, 'i') },
        ]
      })
    }
    if (filters.length > 0) {
      query.$or = filters
    }
    return super.findByPagination(query, pageIndex, pageSize, null, null, { _id: 1 }, tenantId);

  }

  async findTenantsByPagination(pageIndex, pageSize,searchKey){
    let query = {}
    let filters = [{ role: Role.ProductManager }, { role: Role.Tenant }]
    if (searchKey) {
      filters.push({
        $or: [
          { "name": new RegExp(searchKey, 'i') },
          { "tenantId": new RegExp(searchKey, 'i') },
          { "email": new RegExp(searchKey, 'i') },
          { "phoneNumber":new RegExp(searchKey,'i')},
        ]
      })
    }
    if (filters.length > 0) {
      query.$or = filters
    }
    return super.findByPagination(query, pageIndex, pageSize, null, null, { _id: 1 });
  }

  async removePms(tenantId) {
    connection.db.dropDatabase(function (err, result) {
      if (result) {
        return 'Success'
      } else {
        return 'Error'
      }
    });
  }

  
  model() {
    return UserModel;
  }

};