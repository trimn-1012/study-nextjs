import { GetServerSideProps } from "next"
import { CarModel } from "../../../../../api/Car";
import { openDB } from "../../../../openDB";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { makeStyles } from '@material-ui/core/styles';
import Head from "next/head";

interface CarDetailsProps {
  car: CarModel | null | undefined;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
  },
  img: {
    width: '100%'
  },
}));

export default function CarDetails({car}: CarDetailsProps) {
  const classes = useStyles();

  if (!car) {
    return <h1>Sorry, car not found</h1>
  }

  return <div>
    <Head>
      <title>{car.make + " " + car.model}</title>
    </Head>
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item>
            <img className={classes.img} alt="complex" src={car.photoUrl} />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h4">
                {car.make + ' ' + car.model}
              </Typography>
              <Typography gutterBottom variant="h5">
                ${car.price}
              </Typography>
              <Typography gutterBottom variant="body2" color="textSecondary">
                Year: {car.year}
              </Typography>
              <Typography gutterBottom variant="body2" color="textSecondary">
                KMs: {car.kilometers}
              </Typography>
              <Typography gutterBottom variant="body2" color="textSecondary">
                fuelType: {car.fuelType}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Details: {car.details}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  </div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params.id;
  const db = await openDB();
  const car = await db.get<CarModel | undefined>('SELECT * FROM Car where id = ?', id); 

  return {
    props: { car: car || null }
  }
}