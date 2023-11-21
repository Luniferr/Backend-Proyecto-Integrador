
const appDonaciones = require('./BackDonaciones/app/app.cjs')

const port = process.env.PORT || 3000;

const {coneccionDB} = require('./BackDonaciones/database/coneccionDB.cjs')

appDonaciones.listen(port,()=>console.log(`server funcional en el puerto ${port}!`))

coneccionDB();
