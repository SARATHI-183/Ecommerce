import { Product } from "../Models/Product.js";
import { rm} from "fs";

export const createProduct = async ( req, res)=>{
    try {
        if(req.user.role != "admin")
        {
            return res.status(403).json({
                message: "Unauthorized access",
            })
        }

        const { title ,description , category ,price ,stock } = req.body;
        const image = req.file;
        if(!image)
        {
            return res.status(400).json({
                message : "Please select the image",
            })
        }

        //store the product to DB
        const product = await Product.create({
            title,
            description,
            category,
            price,
            stock,
            image : image?.path,
        });

        res.status(201).json({
            message : "Product Details added successfully",
            product,
        });

    } catch (error) {
        res.status(500).json({
            message : error.message,
        });
    }
};

//fetch all products
export const fetchAllProducts = async( req ,res) =>{
    try {
        const product = await Product.find();
        return res.status(200).json({
            message : "List of products",
            product,
        });

    } catch (error) {
        res.status(500).json({
            message : error.message,
        });
    }
};

//fetch single product
export const fetchSingleProduct = async( req ,res) =>{
    try {
        const id=req.params.id;
        const product = await Product.findById(id);
        return res.status(200).json({
            message : "Product detail",
            product,
        });
        
    } catch (error) {
        res.status(500).json({
            message : error.message,
        });
    }
};

//Delete product
export const deleteProduct = async(req ,res)=>{
    try {
        if(req.user.role != "admin")
        {
            return res.status(403).json({
                message: "Unauthorized access",
            })
        }

        const product = await Product.findById(req.params.id);
        if(!product)
        {
            return res.status(403).json({
                message : "Invalid Product Details",
            });
        }

        rm(product.image, ()=>{
            console.log("Image Deleted");
        }) ;

        await product.deleteOne();
        return res.json({
            message : "Product Deleted",
        });

    } catch (error) {
        res.status(500).json({
            message : error.message,
        })
    }
}
