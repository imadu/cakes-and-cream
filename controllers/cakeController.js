const Model = require('../models/cake');

const { Cake, CakeCategory } = Model;

const cakeController = {
  // get all categories
  getCategory(req, res) {
    CakeCategory.find({}).populate('Cakes').exec((err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    });
  },

  // get category by id
  getCategoryId(req, res) {
    const idparams = req.params.id;
    CakeCategory.find({ _id: idparams }).populate('Cakes').exec((err, data) => {
      if (err) throw err;
      else res.status(200).json(data);
    });
  },

  // create a new cake category
  createCategory(req, res) {
    req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    const err = req.validationErrors();
    if (err) res.status(400).send({ success: false, message: 'there are some erros in your form', error: err });
    const name = req.body.name;
    CakeCategory.findOne({ name }, (error, category) => {
      if (error) res.status(500).send({ success: false, message: 'something went wrong', err });
      if (category) res.status(409).send({ success: false, message: 'duplicate categories cannot exist' });
      let categoryForm = {};
      categoryForm = req.body;
      const newCategory = new CakeCategory(categoryForm);
      newCategory.save(() => {
        if (error) res.status(500).send({ success: false, message: 'something went wrong', error });
        else return res.status(200).json({ success: true, category: newCategory.id });
      });
    });
  },

  // update a category
  updateCategory(req, res) {
    req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    const idParams = req.params.id;
    const newSectionData = req.body;
    CakeCategory.update({ _id: idParams },
      { $set: newSectionData }, { upsert: true }, (err, data) => {
        if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
        else res.status(200).send({ success: true, message: 'updated the data', data });
      });
  },
  // remove the category
  deleteCategory(req, res) {
    const idParams = req.params.id;
    CakeCategory.remove({ _id: idParams }, (err, removed) => {
      if (err) throw err;
      return res.status(200).send({ success: true, message: 'successfully deleted the user', removed });
    });
  },

  // get all cakes
  getCakes(req, res) {
    Cake.find({}, (err, cake) => {
      if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
      else res.status(200).send({ success: true, cake });
    });
  },
  // get a particular cake
  getCake(req, res) {
    const idParams = req.params.id;
    Cake.find({ _id: idParams }, (err, cake) => {
      if (err) res.status(500).send({ success: false, message: 'something went wrong', err });
      else res.status(200).send({ success: true, cake });
    });
  },

  // create a cake
  async makeCake(req, res) {
    try {
      req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
      req.checkBody('size', 'empty size').notEmpty();
      req.checkBody('price', 'empty price').notEmpty();
      const cat = req.body.category;
      const name = req.body.name;
      const category = await CakeCategory.findOne({ name: cat });
      const duplicateName = await Cake.findOne({ name });
      // check if category for cake exist and ensure that no cake has duplicate names
      if (!category) return res.status(400).send({ success: false, message: 'category does not exist, cannot create cake without category' });
      if (duplicateName) return  res.status(400).send({ success: false, message: 'duplicate names exist for cake' });
      // if it pass tests then create cake
      let cakeForm = {};
      cakeForm = req.body;
      cakeForm.category = category.id;
      const newCakeForm = new Cake(cakeForm);
      newCakeForm.save(() => {
        category.Cakes = newCakeForm.id;
        category.save(() => {
          res.status(201).send({ success: true, message: 'cake made successfully!', category: category.id });
        });
      });
    } catch (error) {
      res.status(500).send({ success: false, message: ' you have spoilt it', error });
    }
  },

  // update a cake
  editCake(req, res) {
    req.checkBody('name', 'empty name').isLength({ min: 1 }).trim().notEmpty();
    req.checkBody('size', 'empty size').notEmpty();
    req.checkBody('price', 'empty price').notEmpty();
    const err = req.validationErrors();
    if (err) res.status(400).send({ success: false, message: 'there are some erros in your form', error: err });
    const newSectionData = req.body;
    const idParams = req.params.id;
    Cake.update({ _id: idParams }, { $set: newSectionData }, { upsert: true }, (error, data) => {
      if (error) res.status(500).send({ success: false, message: 'something went wrong', err });
      else res.status(200).send({ success: true, message: 'updated the data', data });
    });
  },
  // delete a cake
  deleteCake(req, res) {
    const idParams = req.params.id;
    Cake.remove({ _id: idParams }, (err, removed) => {
      if (err) throw err;
      return res.status(200).send({ success: true, message: 'successfully deleted the user', removed });
    });
  },

};

module.exports = cakeController;
