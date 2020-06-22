const Cloud = require("../models/cloud");
// const mongoose = require("mongoose");

exports.cupload = (req,res,next) => {
	const file = req.files;
	console.log(req);
	// console.log(req.body.file);
	// console.log(req.files[0].buffer);
	// const imageType = req.files.
	const documentArray = req.files.map((file) => {
		return {image: file.buffer, fileName: file.originalname, userID: req.body.userId, date: req.body.date};
	});
	// console.log(documentArray);

	Cloud.insertMany(documentArray, { ordered: true })
		.then((result) => {
			console.log(result);
			return res.status(201).json(result);
		})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({error: "not uploaded"});
		})
}

exports.displayImage = (req,res,next) => {
	const userId = req.params.userId;
	// const imageArray;
	Cloud.find({userID: userId}).sort({"createdAt": -1})
		.then((result) => {
			if(result.length) {
				console.log("recieved data");
				const imageArray = result.map((reslt) => {
					return {id: reslt._id, image: reslt.image, date: reslt.date, fileName: reslt.fileName};
				})
				// console.log(imageArray);
				return res.status(200).json(imageArray);
			}
			else {
				return res.status(400).json({error: "something went wrong"});
			}
		})
		// .catch((err) => {
		// 	console.log(err);
		// 	return res.status(400).json({error: "something went wrong"});
		// })
}

exports.deleteImage =(req,res,next) => {
	const imageId = req.params.imageId;
	const userId = req.body.userId;
	console.log(req.body);
	console.log(`\nImaggeId: ${imageId}\n$userId: ${userId}`);
	Cloud.findOneAndDelete({_id: imageId, userID: userId})
		.then((result) => {
			console.log(result);
			res.status(200).json("Image deleted");
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json("Image not deleted");
		})
}