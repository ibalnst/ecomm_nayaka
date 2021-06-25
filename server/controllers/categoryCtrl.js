import categoryModel from '../models/categoryModel.js';

export const category = async (req, res) => {
	try {
		const categories = await categoryModel.find();
		res.json(categories);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const createCategory = async (req, res) => {
	try {
		const { name } = req.body;

		const category = await categoryModel.findOne({ name });

		if (category) return res.status(400).json({ msg: 'this category already exist' });

		const newCategory = new categoryModel({ name });

		await newCategory.save();

		res.json({ msg: 'Created a category' });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const deleteCategory = async (req, res) => {
    try {
        await categoryModel.findByIdAndDelete( req.params.id )
        res.json({ msg:"Category deleted"})
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const updateCategory = async (req, res) => {
    try {
        const name = req.body;
        await categoryModel.findOneAndUpdate( { _id: req.params.id }, name )
        res.json({ msg:"Category Updated"})
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
