const RepositoryInterface = require('./RepositoryInterface');

module.exports = class BaseRepository extends RepositoryInterface {
  constructor() {
    super();
  }

  async add(info, id) {
    let model = this.model(String(id));
    let obj = new model(info);
    await obj.save();
    return obj;
  }

  async addBatch(info) {
    let model = this.model()
    return await model.collection.insert(info);
  }


  async find(predicate = null, projection = null, id = null) {
    let model
    if (id) {
      model = this.model(id);
    } else {
      model = this.model()
    }
    if (projection) {
      let objs = await model.find(predicate, projection);
      return objs;
    } else {
      let objs = await model.find(predicate);
      return objs;
    }
  }

  async findOneAndPopulate(predicate, keysToPopulate, attributesOfKeysToPopulate, id) {
    let model
    if (id) {
      model = this.model(id)
    } else {
      model = this.model()
    }
    let obj = await model.findOne(predicate).populate(keysToPopulate, attributesOfKeysToPopulate);
    return obj

  }

  async findOneAndUpdate(predicate, info, options = null, params) {
    let model
    if (params) {
      model = this.model(params);
    } else {
      model = this.model()
    }
    if (options == null) {
      options = { new: true };
    }
    let obj = await model.findOneAndUpdate(predicate, info, options);
    return obj;
  }

  async count(predicate) {

    let model = this.model()
    let obj = await model.countDocuments(predicate);
    return obj
  }


  async findAndPopulate(predicate, populate) {
    let model = this.model()
    let obj = await model.find(predicate).populate(populate);
    return obj

  }

  async findOne(predicate, id = null) {
    let model
    if (id) {
      model = this.model(id)
    } else {
      model = this.model()
    }
    let obj = await model.findOne(predicate);
    return obj
  }

  async findByPagination(predicate, pageIndex, pageSize, keysToPopulate = null, attributesOfKeysToPopulate = null, sort = null, tenantId = null) {
    let model
    if (tenantId) {
      model = this.model(tenantId)
    } else {
      model = this.model()

    }
    let totalCount = await model.find(predicate).countDocuments({})
    if (keysToPopulate != null) {

      let data
      if (sort) {
        data = await model.find(predicate).sort(sort).skip(pageSize * pageIndex).limit(pageSize).populate(keysToPopulate, attributesOfKeysToPopulate);
      } else {
        data = await model.find(predicate).skip(pageSize * pageIndex).limit(pageSize).populate(keysToPopulate, attributesOfKeysToPopulate);
      }
      return { data: data, totalCount: totalCount, totalPages: Math.ceil(totalCount / pageSize) };

    } else {

      let data
      if (sort) {
        data = await model.find(predicate).sort(sort).skip(pageSize * pageIndex).limit(pageSize);
      } else {
        data = await model.find(predicate).skip(pageSize * pageIndex).limit(pageSize);
      }
      return { data: data, totalCount: totalCount, totalPages: Math.ceil(totalCount / pageSize) };
    }
  }

  async remove(predicate) {
    let model = this.model()
    let res = await model.deleteMany(predicate);
    if (res.deletedCount >= 1) {
      return 'Records deleted Successfully'
    } else {
      return 'Error'
    }
  }


};
