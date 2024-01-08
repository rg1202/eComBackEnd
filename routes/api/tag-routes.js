const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The api  endpoint
router.get('/', async (req, res) => {
  // find  tags Product data
  try {
    const allTags = await Tag.findAll({ include: {model: Product} });
    res.status(200).json(allTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find  tag by `id` include Product data
  try {
    const tagByID = await Tag.findByPk(req.params.id, { include: {model: Product} });
    res.status(200).json(tagByID);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create new tag 
  Tag.create(req.body)
    .then((tag) => {
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update by its id
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      if (req.body.productIds && req.body.productIds.length) {
        
        ProductTag.findAll({
          where: { tag_id: req.params.id }
        }).then((productTags) => {
          // filtered list 
          const productTagIds = productTags.map(({ product_id }) => product_id);
          const newProductTags = req.body.productIds
          .filter((product_id) => !productTagIds.includes(product_id))
          .map((product_id) => {
            return {
              tag_id: req.params.id,
              product_id,
            };
          });
          const productTagsToRemove = productTags
          .filter(({ product_id }) => !req.body.productIds.includes(product_id))
          .map(({ id }) => id);
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }
      return res.json(tag);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete tag by id
  try {
    const targetTag = await Tag.destroy({where: { id: req.params.id }});
    if (!targetTag) {
      res.status(404).json({ message: 'No Tag with this id!' });
      return;
    }
    res.status(200).json(targetTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;