export const find = async (model, query, populate = [], select = '', skip = 0, limit = 100) => {
    const result = (await model
        .find(query)
        .populate(populate)
        .select(select)
        .skip(skip)
        .limit(limit)
        .lean());
    return result;
};
export const findOne = async (model, query, populate = [], select = '', skip = 0, limit = 100) => {
    const result = (await model
        .findOne(query)
        .populate(populate)
        .select(select)
        .skip(skip)
        .limit(limit)
        .lean());
    return result;
};
export const create = async (model, data) => {
    const result = await model.create(data);
    return result;
};
export const findById = async (model, id, populate = [], select = '', skip = 0, limit = 100) => {
    const result = (await model
        .findById(id)
        .populate(populate)
        .select(select)
        .skip(skip)
        .limit(limit)
        .lean());
    return result;
};
export const updateById = async (model, id, data) => {
    const result = (await model.findByIdAndUpdate(id, data, { new: true }).lean());
    return result;
};
export const deleteOne = async (model, query) => {
    const result = await model.deleteOne(query);
    return result;
};
