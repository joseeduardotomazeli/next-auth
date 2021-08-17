import withSSRAuth from '../utils/withSSRAuth';

function Metrics() {
  return <h1>Metrics</h1>;
}

export const getServerSideProps = withSSRAuth(
  async (context) => {
    console.log(context);

    return {
      props: {},
    };
  },
  { permissions: ['metrics.list'], roles: ['administrator'] }
);

export default Metrics;
