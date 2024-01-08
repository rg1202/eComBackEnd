const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // categories, include associated Products

  try {
    const allCategories = await Category.findAll({ include: Product});
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id,
    },
    include: [Product],
  })
    .then((category) => res.json(category))
    .catch((err) => res.status(400).json(err));
});

router.post('/', async (req, res) => {
  //new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => res.status(200).json(category))
    .catch((err) => res.status(400).json(err));
});

router.delete('/:id', async (req, res) => {
  // delete by id
  try {
    const targetCategory = await Category.destroy({where: { id: req.params.id }});
    if (!targetCategory) {
      res.status(404).json({ message: 'CATEGORY NOT FOUND' });
      return;
    }
    res.status(200).json(targetCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;