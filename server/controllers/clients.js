import Product from "../models/Products.js";
import ProductStat from "../models/ProdectStat.js";
import User from "../models/User.js"
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3"



export const getProducts = async (req, res) => {
    try {
        // Find All Products....Give us all the Products in the db......
        const products = await Product.find()
        // Get All Products Stat.......
        const productsWithStat = await Promise.all(
            // For every single products get the 
            // product Stat using the product Id
            products.map(async (product) => {
                const stat = await ProductStat.find({
                    productId: product._id
                })
                // Returns a array of Products 
                // information and combining it with the stat info
                return {
                    ...product._doc,
                    stat
                }
            })
        )
        res.status(200).json(productsWithStat)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getCustomers = async (req, res) => {
    try {
        // Find All customers....Give us all the customers in the db......
        const customers = await User.find({ role: "user" }).select("-password");
        res.status(200).json(customers)
       
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getTransactions = async (req, res) => {
    try {
        // Getting From the Frontend
        // sort should look like this: { "field": "userId", "sort": "desc" }
        const { page = 1, pageSize = 20, sort = null, search = ""} = req.query;

        // formatted sort should look like { userId: -1 }
        const generatSort = () => {
            const sortParsed = JSON.parse(sort);
            const sortFromatted = {
                [sortParsed.field]: sortParsed.sort = "asc" ? 1 : -1
            }
            return sortFromatted;
        }
        const sortFromatted = Boolean(sort) ? generatSort() : {};

        const transactions = await Transaction.find({
            // Checking for cost using Search, 
            // $or allows us to search for muiltpul stuffs
            $or: [
                { cost: { $regex: new RegExp(search, "i") }},
                { userId: { $regex: new RegExp(search, "i") }}
            ]
        })
        .sort(sortFromatted)
        .skip(page * pageSize)
        .limit(pageSize)

        const total = await Transaction.countDocuments({
            name: { $regex: search, $options: "i"}
        })

        res.status(200).json({
            transactions, total
        })
       
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getGeography = async (req, res) => {
    try {
        const users = await User.find()

        const mappedLocations = users.reduce((acc, { country}) => {
            const countryISO3 = getCountryIso3(country)
            if (!acc[countryISO3]) {
                acc[countryISO3] = 0
            }
            acc[countryISO3]++
            return acc
        }, {})

        const formattedLocations = Object.entries(mappedLocations).map(
            ([country, count]) => {
                return { id: country, value: count }
            }
        )
        res.status(200).json(formattedLocations)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}