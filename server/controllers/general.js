import User from "../models/User.js"
import Transaction from "../models/Transaction.js"
import OverallStat from "../models/OverallStat.js"


export const getUser = async (req, res) => {
    try {
        // Find the params[parameter] of the id
        /*  A parameter is a special kind of variable
         used in a function to refer to one of the pieces
          of data provided as input to the function
        */
        const { id } = req.params;
        // Find the user by id
        const user = await User.findById(id)
        // Sends the user information to the frontend
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getDashboardStats = async (req, res) => {
    try {
        // Hardcoded Values
        const currentMonth = "November"
        const currentYear = 2021
        const currentDay = "2021-11-15"

        /*
        .... Recent Transactions ....
        .... Get Recent Transactions made ...
        */
       const transactions = await Transaction.find().limit(50).sort({ createdOn: -1 })

       /* Overall Stats */
       const overallStat = await OverallStat.find({ year: currentYear })

       const {
        totlaCustomers,
        yearlySalesTotal,
        yearlyTotalSoldUnits,
        monthlyData,
        salesByCategory
       } = overallStat[0]

       const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
        return month === currentMonth
       })

       const todayStats = overallStat[0].dailyData.find(({ date }) => {
        return date === currentDay
       })

        res.status(200).json({
            totlaCustomers,
            yearlySalesTotal,
            yearlyTotalSoldUnits,
            monthlyData,
            salesByCategory,
            thisMonthStats,
            todayStats,
            transactions,
        })
    } catch (error) {
        res.status(404).json( {message: error.message })
    }
}