import { Grid } from "@material-ui/core";
import { GetServerSideProps } from "next";
import Search from ".";
import { CarModel } from "../../api/Car";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModel";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { getAsString } from "../getAsString";
import { useRouter } from "next/router";
import { ParsedUrlQuery, stringify } from "querystring";
import useSWR from "swr";
import deepEqual from 'fast-deep-equal';
import { CarPagination } from '../components/CarPagination';
import { CarCard, CarCardLoading } from '../components/CarCard';

export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
  serverQuery: ParsedUrlQuery;
}

export default function CarsList({ makes, models, cars, totalPages, serverQuery }: CarsListProps) {
  const { query } = useRouter();
  const { data } = useSWR('/api/cars?' + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery) ? {cars, totalPages} : undefined
  });
  return <Grid container spacing={3}>
    <Grid item xs={12} sm={5} md={3} lg={2}>
      <Search singleColumn makes={makes} models={models} />
    </Grid>
    <Grid container item xs={12} sm={7} md={9} lg={10} spacing={3}>
      <Grid item xs={12}>
        <CarPagination totalPages={data?.totalPages}/>
      </Grid>
      {
        !data?.cars ? (
          <>
            <Grid item xs={12} sm={6}>
              <CarCardLoading />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CarCardLoading />
            </Grid>
          </>
        ) : (data?.cars || []).map(car => (
          <Grid item key={car.id} xs={12} sm={6}>
            <CarCard car={car} />
          </Grid>
        ))
      }
      <Grid item xs={12}>
        <CarPagination totalPages={data?.totalPages} />
      </Grid>
    </Grid>
  </Grid>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);

  const [makes, models, pagination] = await Promise.all([getMakes(), getModels(make), getPaginatedCars(ctx.query)]);

  return {
    props: { makes, models, cars: pagination.cars, totalPages: pagination.totalPages, serverQuery: ctx.query },
  };
};