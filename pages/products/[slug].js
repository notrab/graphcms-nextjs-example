import { GraphQLClient } from "graphql-request";

const graphcms = new GraphQLClient(process.env.GRAPHCMS_URL);

export async function getStaticProps({ params }) {
  const { product } = await graphcms.request(
    `query ProductPageQuery($slug: String!){
    product(where: {slug: $slug}) {
      name
      description
      price
    }
  }`,
    {
      slug: params.slug,
    }
  );

  return {
    props: {
      product,
    },
  };
}

export async function getStaticPaths() {
  const { products } = await graphcms.request(`{
    products {
      slug
      name
    }
  }`);

  return {
    paths: products.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}

export default ({ product }) => (
  <React.Fragment>
    <h1>{product.name}</h1>
    <p>{product.description}</p>
    <p>{product.price / 100}</p>
  </React.Fragment>
);