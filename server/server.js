const app = express()
app.use(express.json())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

/* ROUTES */
app.use('/client', clientRoutes)
app.use('/general', generalRoutes)
app.use('/management', managementRoutes)
app.use('sales', salesRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
    /* ONLY ADD DATA ONE TIME */
    // Product.insertMany(dataProduct)
    // Product.insertMany(dataProductStat)
    // User.insertMany(dataUser)
  })
  .catch((error) => console.log(`${error} did not connect`))